// The generated screens (screens/<id>/screen.txt and map-<side>.svg), read at build time. The files come through
// import.meta.glob, which works in the Astro build and under Vitest alike.
import {explanationMismatch, fieldIdsOf} from './explanations.ts';
import {parseScreenFile, type MapSide, type ScreenCapture} from './screenFile.ts';

const screenFiles = import.meta.glob<string>('../../screens/*/screen.txt', {query: '?raw', import: 'default', eager: true});
const mapFiles = import.meta.glob<string>('../../screens/*/map-*.svg', {query: '?raw', import: 'default', eager: true});

const fileOf = (files: Record<string, string>, id: string, name: string): string | undefined =>
	files[`../../screens/${id}/${name}`];

/**
 * The capture of a screen and the SVG of each of its maps.
 * @throws Error when the screen was never generated, or lists a map whose file is missing
 */
export function loadCapture(id: string): {capture: ScreenCapture; maps: Partial<Record<MapSide, string>>} {
	const text = fileOf(screenFiles, id, 'screen.txt');
	if (text === undefined) throw new Error(`no generated screen "${id}"; run npm run screens -- ${id}`);
	let capture: ScreenCapture;
	try {
		capture = parseScreenFile(text);
	} catch (e) {
		throw new Error(`screen ${id}: ${(e as Error).message}; run npm run screens -- ${id}`, {cause: e});
	}
	const maps: Partial<Record<MapSide, string>> = {};
	for (const side of capture.maps) {
		const svg = fileOf(mapFiles, id, `map-${side}.svg`);
		if (svg === undefined) throw new Error(`screen ${id}: map-${side}.svg is missing; run npm run screens -- ${id}`);
		maps[side] = svg;
	}
	return {capture, maps};
}

/**
 * Checks that the explanations of a screen (the text of its fields.mdx) and its text and map fields agree, with the
 * same rule the generator applies.
 * @throws Error naming the screen, the difference and the command that regenerates the screen
 */
export function checkExplanations(id: string, capture: ScreenCapture, mdx: string): void {
	const mismatch = explanationMismatch([...capture.fields.keys(), ...capture.mapFields.keys()], fieldIdsOf(mdx));
	if (mismatch !== null) {
		throw new Error(`screen ${id}: ${mismatch}; fix screens/${id}/fields.mdx or screen.ts, then run npm run screens -- ${id}`);
	}
}

/** The text and map fields of a screen that have an explanation in its fields.mdx: the fields the site makes interactive. */
export function documentedFields(capture: ScreenCapture, mdx: string): Set<string> {
	const explained = new Set(fieldIdsOf(mdx));
	return new Set([...capture.fields.keys(), ...capture.mapFields.keys()].filter(id => explained.has(id)));
}
