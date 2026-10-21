import {describe, expect, it} from 'vitest';
import {mapToSvg, type MapGroup} from '../lib/mapSvg.ts';

/** The `d` of every <path> of the SVG, in order */
const pathsOf = (svg: string): string[] => Array.from(svg.matchAll(/<path d="([^"]*)"\/>/g), m => m[1]);

/** The opening tags of the groups, in order */
const groupsOf = (svg: string): string[] => Array.from(svg.matchAll(/<g [^>]*>/g), m => m[0]);

const OPEN = (w: number, h: number) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges" fill="currentColor">`;

const TWO: MapGroup[] = [
	{field: 'aircraft', draw: 'icon $ 47.1000,-122.3000', pixels: [[2, 0], [3, 0], [0, 2]]},
	{field: 'leg', draw: 'arrow <A&B> "C" KSEA', pixels: [[4, 1]]},
];

describe('mapToSvg', () => {
	it('writes one group per element, in order, with its field, escaped description and box', () => {
		expect(groupsOf(mapToSvg(5, 3, TWO))).toEqual([
			'<g data-field="aircraft" data-draw="icon $ 47.1000,-122.3000" data-box="0 0 4 3">',
			'<g data-field="leg" data-draw="arrow &lt;A&amp;B&gt; &quot;C&quot; KSEA" data-box="4 1 1 1">',
		]);
	});

	it('draws the pixels of a group as one path per row, one run per stretch', () => {
		expect(mapToSvg(5, 3, TWO).split('\n')).toEqual([
			OPEN(5, 3),
			'<g data-field="aircraft" data-draw="icon $ 47.1000,-122.3000" data-box="0 0 4 3">',
			'<path d="M2 0h2v1h-2z"/>',
			'<path d="M0 2h1v1h-1z"/>',
			'</g>',
			'<g data-field="leg" data-draw="arrow &lt;A&amp;B&gt; &quot;C&quot; KSEA" data-box="4 1 1 1">',
			'<path d="M4 1h1v1h-1z"/>',
			'</g>',
			'</svg>',
			'',
		]);
	});

	it('joins the runs of a row and sorts the pixels of a group', () => {
		const svg = mapToSvg(5, 2, [{field: 'x', draw: 'd', pixels: [[4, 0], [1, 1], [3, 0], [1, 0]]}]);
		expect(pathsOf(svg)).toEqual(['M1 0h1v1h-1zM3 0h2v1h-2z', 'M1 1h1v1h-1z']);
	});

	it('writes no group for a dark map and keeps its size', () => {
		expect(mapToSvg(3, 2, [])).toBe(`${OPEN(3, 2)}\n</svg>\n`);
	});

	it('rejects a pixel outside the map, a pixel of two groups, a group without pixels and an empty map', () => {
		expect(() => mapToSvg(5, 3, [{field: 'x', draw: 'd', pixels: [[5, 0]]}])).toThrow(/"d".*5,0.*outside/);
		expect(() => mapToSvg(5, 3, [{field: 'x', draw: 'd', pixels: [[0, -1]]}])).toThrow(/outside/);
		expect(() => mapToSvg(5, 3, [{field: 'x', draw: 'd', pixels: [[1.5, 0]]}])).toThrow(/outside/);
		expect(() => mapToSvg(5, 3, [
			{field: 'x', draw: 'a', pixels: [[1, 1]]}, {field: 'y', draw: 'b', pixels: [[1, 1]]},
		])).toThrow(/1,1.*"a".*"b"/);
		expect(() => mapToSvg(5, 3, [{field: 'x', draw: 'd', pixels: []}])).toThrow(/"d" has no pixels/);
		expect(() => mapToSvg(0, 3, [])).toThrow(/size/);
	});
});
