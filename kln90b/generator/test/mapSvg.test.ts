import {describe, expect, it} from 'vitest';
import {blocksToSvg} from '../lib/mapSvg.ts';

/** The `d` of every <path> of the SVG, in order */
const pathsOf = (svg: string): string[] => Array.from(svg.matchAll(/<path d="([^"]*)"\/>/g), m => m[1]);

describe('blocksToSvg', () => {
	it('draws one path per row with lit pixels, one run per stretch', () => {
		const svg = blocksToSvg('..##.\n.....\n#....');
		expect(pathsOf(svg)).toEqual(['M2 0h2v1h-2z', 'M0 2h1v1h-1z']);
		expect(svg).toContain('viewBox="0 0 5 3" width="5" height="3"');
	});

	it('joins several runs of a row into one path', () => {
		expect(pathsOf(blocksToSvg('.#.##\n'))).toEqual(['M1 0h1v1h-1zM3 0h2v1h-2z']);
	});

	it('draws no path for a dark map and keeps its size', () => {
		const svg = blocksToSvg('...\n...');
		expect(pathsOf(svg)).toEqual([]);
		expect(svg).toContain('viewBox="0 0 3 2"');
	});

	it('is an inline SVG in the color of its parent, with sharp edges', () => {
		const svg = blocksToSvg('#');
		expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" /);
		expect(svg).toContain('shape-rendering="crispEdges"');
		expect(svg).toContain('fill="currentColor"');
		expect(svg.endsWith('</svg>\n')).toBe(true);
	});

	it('reads the output of downsampled, with its trailing newline and a CRLF alike', () => {
		expect(blocksToSvg('#.\n.#\n')).toEqual(blocksToSvg('#.\r\n.#'));
	});

	it('rejects rows of different length and other characters', () => {
		expect(() => blocksToSvg('##\n#')).toThrow(/row 2/);
		expect(() => blocksToSvg('#x')).toThrow(/"x"/);
		expect(() => blocksToSvg('')).toThrow(/empty/);
	});
});
