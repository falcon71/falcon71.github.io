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
import {locateFields, type FieldDef} from './fields.ts';
import {blocksToSvg} from './mapSvg.ts';
import {facilitiesOf, loadExtract} from './navdata.ts';
import {decimalYear, declination, screenModel, SCREEN_DEGREE} from './wmm.ts';

export interface ScreenDescription {
	title: string;
	/** Which half of a split screen the manual shows; a full page needs 'both' */
	show: Show;
	boot?: Omit<BootOptions, 'facilities' | 'defaultNavdata' | 'magvar' | 'airspaces'>;
	/** Brings the unit to the page, from the settled state */
	steps?: (unit: HeadlessUnit) => Promise<void>;
	fields: FieldDef[];
}

const ID = /^[a-z0-9-]+$/;
const MAP_FILE = /^map-.*\.svg$/;

/**
 * The SVG of the map of each side that the manual shows and that has a canvas, even a dark one, so that the files of a
 * screen do not come and go with what the map happens to draw.
 */
function mapsOf(canvases: CapturedScreen['canvases'], show: Show): Map<'L' | 'R', string> {
	const maps = new Map<'L' | 'R', string>();
	for (const side of ['L', 'R'] as const) {
		const canvas = canvases[side];
		if (canvas !== undefined && (show === 'both' || show === (side === 'L' ? 'left' : 'right'))) {
			maps.set(side, blocksToSvg(downsampled(canvasToAscii(canvas))));
		}
	}
	return maps;
}

async function generate(dir: string, id: string, d: ScreenDescription): Promise<void> {
	if (!ID.test(id)) throw new Error(`the folder name must match ${ID}`);
	// Only the places of the FAA extract exist, and the variation is the model's at the date the unit starts
	const year = decimalYear(d.boot?.start ?? DEFAULT_START);
	const unit = await bootUnit({
		...d.boot, defaultNavdata: false, facilities: facilitiesOf(loadExtract()),
		magvar: (lat, lon) => declination(screenModel(), lat, lon, year, 0, SCREEN_DEGREE),
	});
	await settle(unit);
	await d.steps?.(unit);
	const capture = await captureScreen();
	if (capture.layout === 'full' && d.show !== 'both') {
		throw new Error(`a full page needs show both, not ${d.show}`);
	}
	const text = capture.cells.map(row => row.map(c => c.ch).join(''));
	const mask = capture.cells.map(row => row.map(c => c.attr as CellAttr));
	const fields = locateFields(text, capture.layout, d.show, d.fields, capture.status);
	const maps = mapsOf(capture.canvases, d.show);

	const mdxFile = path.join(dir, 'fields.mdx');
	const ids = d.fields.map(f => f.id);
	if (!fs.existsSync(mdxFile)) throw new Error(`${mdxFile} is missing; it needs a <Field> for: ${ids.join(', ')}`);
	const mismatch = explanationMismatch(ids, fieldIdsOf(fs.readFileSync(mdxFile, 'utf8')));
	if (mismatch !== null) throw new Error(mismatch);

	const file = serializeScreenFile({
		kln90b: vendorCommit(), title: d.title, show: d.show, layout: capture.layout, status: capture.status,
		text, mask, fields, maps: Array.from(maps.keys()),
	});
	fs.writeFileSync(path.join(dir, 'screen.txt'), file);
	for (const [side, svg] of maps) fs.writeFileSync(path.join(dir, `map-${side}.svg`), svg);
	// A map file of an earlier run that this run did not write is stale
	for (const name of fs.readdirSync(dir)) {
		if (MAP_FILE.test(name) && !maps.has(name.slice('map-'.length, -'.svg'.length) as 'L' | 'R')) fs.rmSync(path.join(dir, name));
	}
}

/**
 * Boots the unit, brings it to the page, captures one blink cycle and writes `screen.txt` into `dir`. The id of the
 * screen is the name of the folder.
 * @throws Error `screen <id>: ...` for anything that stops the screen from being generated; `screen.txt` is written only
 * after every check has passed. The maps of NAV 5 and APT 3 are written next to it as `map-L.svg` and `map-R.svg`.
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
