import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {it} from 'vitest';
import {bootUnit, settle, type BootOptions, type HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';
import {serializeScreenFile, type CellAttr, type Show} from '../../src/lib/screenFile.ts';
import {explanationMismatch, fieldIdsOf} from '../../src/lib/explanations.ts';
import {vendorCommit} from '../vendorCheck.mjs';
import {captureScreen} from './capture.ts';
import {locateFields, type FieldDef} from './fields.ts';

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

async function generate(dir: string, id: string, d: ScreenDescription): Promise<void> {
	if (!ID.test(id)) throw new Error(`the folder name must match ${ID}`);
	// Until the FAA navdata and the magnetic model are wired in: the default navdata and no magnetic variation
	const unit = await bootUnit({...d.boot, defaultNavdata: true, magvar: 0});
	await settle(unit);
	await d.steps?.(unit);
	const capture = await captureScreen();
	if (capture.layout === 'full' && d.show !== 'both') {
		throw new Error(`a full page needs show both, not ${d.show}`);
	}
	const text = capture.cells.map(row => row.map(c => c.ch).join(''));
	const mask = capture.cells.map(row => row.map(c => c.attr as CellAttr));
	const fields = locateFields(text, capture.layout, d.show, d.fields, capture.status);

	const mdxFile = path.join(dir, 'fields.mdx');
	const ids = d.fields.map(f => f.id);
	if (!fs.existsSync(mdxFile)) throw new Error(`${mdxFile} is missing; it needs a <Field> for: ${ids.join(', ')}`);
	const mismatch = explanationMismatch(ids, fieldIdsOf(fs.readFileSync(mdxFile, 'utf8')));
	if (mismatch !== null) throw new Error(mismatch);

	const file = serializeScreenFile({
		kln90b: vendorCommit(), title: d.title, show: d.show, layout: capture.layout, status: capture.status,
		text, mask, fields, maps: [],
	});
	fs.writeFileSync(path.join(dir, 'screen.txt'), file);
	// No maps are drawn yet, so every map file in the folder is stale
	for (const name of fs.readdirSync(dir)) if (MAP_FILE.test(name)) fs.rmSync(path.join(dir, name));
}

/**
 * Boots the unit, brings it to the page, captures one blink cycle and writes `screen.txt` into `dir`. The id of the
 * screen is the name of the folder.
 * @throws Error `screen <id>: ...` for anything that stops the screen from being generated; `screen.txt` is written only
 * after every check has passed
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
