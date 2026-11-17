// The generated screens (screens/<id>/screen.txt and map-<side>.svg), read at build time. The id is the path of the
// screen's folder below screens/, packages included ("pages/apt/apt-1-ksea"). The files come through import.meta.glob,
// which works in the Astro build and under Vitest alike.
import {explanationMismatch, fieldIdsOf} from './explanations.ts';
import {parseScreenFile, type MapSide, type ScreenCapture} from './screenFile.ts';

const screenFiles = import.meta.glob<string>('../../screens/**/screen.txt', {query: '?raw', import: 'default', eager: true});
const mapFiles = import.meta.glob<string>('../../screens/**/map-*.svg', {query: '?raw', import: 'default', eager: true});

const PREFIX = '../../screens/';

/** The id of the screen whose folder holds the file of a glob key: `../../screens/pages/nav/nav-1/screen.txt` is `pages/nav/nav-1`. */
export const screenIdOfFile = (key: string): string => key.slice(PREFIX.length, key.lastIndexOf('/'));

/** The first screen that lies inside another one, as `[outer, inner]`, or `null` when no screen folder holds a screen. */
export function nestedScreen(ids: Iterable<string>): [outer: string, inner: string] | null {
	const all = [...ids];
	for (const outer of all) {
		const inner = all.find(id => id.startsWith(`${outer}/`));
		if (inner !== undefined) return [outer, inner];
	}
	return null;
}

const nested = nestedScreen(Object.keys(screenFiles).map(screenIdOfFile));
if (nested !== null) {
	throw new Error(`screen ${nested[1]} lies inside screen ${nested[0]}; a screen folder holds no other screen, move it into a package`);
}

const fileOf = (files: Record<string, string>, id: string, name: string): string | undefined =>
	files[`${PREFIX}${id}/${name}`];

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
