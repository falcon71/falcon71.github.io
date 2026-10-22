import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {it} from 'vitest';
import {bootUnit, settle, type BootOptions, type HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';
import {DEFAULT_START} from '../../../vendor/kln90b/test/harness/sim/clock';
import {canvasToAscii, downsampled} from '../../../vendor/kln90b/test/harness/render/canvas';
import {serializeScreenFile, type CellAttr, type Show} from '../../src/lib/screenFile.ts';
import {explanationMismatch, fieldIdsOf} from '../../src/lib/explanations.ts';
import {vendorCommit} from '../vendorCheck.mjs';
import {captureScreen, type CapturedScreen} from './capture.ts';
import {locateFields, locateMapFields, type FieldDef, type MapSide} from './fields.ts';
import {checkCoverage, recordMapElements, type MapElement} from './mapElements.ts';
import {mapToSvg} from './mapSvg.ts';
import {airspacesOf, facilitiesOf, loadAirspaces, loadExtract, loadProcedures, pointNamesOf} from './navdata.ts';
import {decimalYear, declination, screenModel, SCREEN_DEGREE} from './wmm.ts';

export interface ScreenDescription {
	title: string;
	/** Which half of a split screen the manual shows; a full page needs 'both' */
	show: Show;
	boot?: Omit<BootOptions, 'facilities' | 'defaultNavdata' | 'magvar' | 'airspaces'>;
	/**
	 * Lets the status line flash msg on this screen, which is otherwise an error: a message is pending then, and a pilot
	 * would have read it. Answer it in the steps instead: `adjustCourseIndicator(u)` for ADJ NAV IND CRS, `u.panel.readMessages()`
	 * for any other. Only a screen that shows the MSG annunciator or the MSG page needs this, and it stages a real
	 * message for it (a flight plan that is active, or a last position that differs from the boot position).
	 */
	keepMessages?: boolean;
	/** Brings the unit to the page, from the settled state */
	steps?: (unit: HeadlessUnit) => Promise<void>;
	fields: FieldDef[];
}

const STATUS_ROW = 6;
const MSG_ANNUNCIATOR = 'msg';
const ID = /^[a-z0-9-]+$/;
const MAP_FILE = /^map-.*\.svg$/;

interface ShownMap {
	width: number;
	height: number;
	elements: MapElement[];
}

/**
 * The map of each side that the manual shows and that has a canvas, even a dark one, so that the files of a screen do
 * not come and go with what the map happens to draw.
 * @throws Error `map <side>: ...` when the recorded elements do not account for the pixels of the map
 */
function mapsOf(capture: CapturedScreen, show: Show): Map<MapSide, ShownMap> {
	const maps = new Map<MapSide, ShownMap>();
	for (const side of ['L', 'R'] as const) {
		const canvas = capture.canvases[side];
		if (canvas !== undefined && (show === 'both' || show === (side === 'L' ? 'left' : 'right'))) {
			const blocks = downsampled(canvasToAscii(canvas));
			const rows = blocks.replace(/\n$/, '').split('\n');
			const elements = capture.elements[side] ?? [];
			try {
				checkCoverage(blocks, elements);
			} catch (e) {
				throw new Error(`map ${side}: ${(e as Error).message}`);
			}
			maps.set(side, {width: rows[0].length, height: rows.length, elements});
		}
	}
	return maps;
}

/**
 * The user settings a screen starts with: the airspace alert off, and the last position at the boot position, and
 * the screen's own `storage` wins over both. The unit warns when the first fix is more than 2 NM from the last position
 * it saved (Gps.ts), which a pilot who last flew from here never sees. The alert is on by default and would flash
 * its message over any screen that stands in or near an airspace.
 */
export function screenStorage(position?: { lat: number; lon: number }, own?: Record<string, unknown>): Record<string, unknown> {
	const last = position === undefined ? {} : {lastLatitude: position.lat, lastLongitude: position.lon};
	return {airspaceAlertEnabled: false, ...last, ...own};
}

async function generate(dir: string, id: string, d: ScreenDescription): Promise<void> {
	if (!ID.test(id)) throw new Error(`the folder name must match ${ID}`);
	// Only the places of the FAA extract exist, and the variation is the model's at the date the unit starts
	const year = decimalYear(d.boot?.start ?? DEFAULT_START);
	const extract = loadExtract();
	const unit = await bootUnit({
		...d.boot, storage: screenStorage(d.boot?.position, d.boot?.storage), defaultNavdata: false,
		facilities: facilitiesOf(extract, loadProcedures()), airspaces: airspacesOf(loadAirspaces(), extract),
		magvar: (lat, lon) => declination(screenModel(), lat, lon, year, 0, SCREEN_DEGREE),
	});
	await settle(unit);
	// From the steps on, so that the first frame of a map that draws only when its page opens (APT 3) is recorded; the
	// last frame each map finished before the capture's last read counts
	const recorder = recordMapElements(pointNamesOf(loadExtract()));
	let capture: CapturedScreen;
	try {
		await d.steps?.(unit);
		capture = await captureScreen(recorder);
	} finally {
		recorder.stop();
	}
	if (capture.layout === 'full' && d.show !== 'both') {
		throw new Error(`a full page needs show both, not ${d.show}`);
	}
	const text = capture.cells.map(row => row.map(c => c.ch).join(''));
	if (!d.keepMessages && capture.status && text[STATUS_ROW].includes(MSG_ANNUNCIATOR)) {
		throw new Error('a message is pending (the status line flashes msg): answer it in the steps, after whatever raised it, '
			+ 'with `adjustCourseIndicator(u)` for ADJ NAV IND CRS or `await u.panel.readMessages()` for any other, '
			+ 'or set keepMessages for a screen that shows msg');
	}
	const mask = capture.cells.map(row => row.map(c => c.attr as CellAttr));
	const fields = locateFields(text, capture.layout, d.show, d.fields, capture.status);
	const maps = mapsOf(capture, d.show);
	const mapFields = locateMapFields(d.fields, d.show, Object.fromEntries(Array.from(maps, ([side, map]) => [side, map.elements])));
	const svgs = new Map<MapSide, string>();
	for (const [side, {width, height, elements}] of maps) {
		const owners = mapFields.owners[side]!;
		svgs.set(side, mapToSvg(width, height, elements.map((e, i) => ({field: owners[i], draw: e.draw, pixels: e.pixels}))));
	}

	const mdxFile = path.join(dir, 'fields.mdx');
	const ids = d.fields.map(f => f.id);
	if (!fs.existsSync(mdxFile)) throw new Error(`${mdxFile} is missing; it needs a <Field> for: ${ids.join(', ')}`);
	const mismatch = explanationMismatch(ids, fieldIdsOf(fs.readFileSync(mdxFile, 'utf8')));
	if (mismatch !== null) throw new Error(mismatch);

	const file = serializeScreenFile({
		kln90b: vendorCommit(), title: d.title, show: d.show, layout: capture.layout, status: capture.status,
		text, mask, fields, mapFields: mapFields.sides, maps: Array.from(maps.keys()),
	});
	fs.writeFileSync(path.join(dir, 'screen.txt'), file);
	for (const [side, svg] of svgs) fs.writeFileSync(path.join(dir, `map-${side}.svg`), svg);
	// A map file of an earlier run that this run did not write is stale
	for (const name of fs.readdirSync(dir)) {
		if (MAP_FILE.test(name) && !maps.has(name.slice('map-'.length, -'.svg'.length) as 'L' | 'R')) fs.rmSync(path.join(dir, name));
	}
}

/**
 * Boots the unit, brings it to the page, captures one blink cycle and writes `screen.txt` into `dir`. The id of the
 * screen is the name of the folder.
 * @throws Error `screen <id>: ...` for anything that stops the screen from being generated; `screen.txt` is written only
 * after every check has passed, among them that every element drawn on a map the screen shows belongs to one map field.
 * The maps of NAV 5 and APT 3 are written next to it as `map-L.svg` and `map-R.svg`.
 */
export async function generateScreen(dir: string, d: ScreenDescription): Promise<void> {
	const id = path.basename(dir);
	try {
		await generate(dir, id, d);
	} catch (e) {
		throw new Error(`screen ${id}: ${(e as Error).message}`, {cause: e});
	}
}

/** Registers the test that generates the screen of the folder that contains the module at `moduleUrl` (`import.meta.url`). */
export function defineScreen(moduleUrl: string, d: ScreenDescription): void {
	const dir = path.dirname(fileURLToPath(moduleUrl));
	it(path.basename(dir), () => generateScreen(dir, d), 120_000);
}
