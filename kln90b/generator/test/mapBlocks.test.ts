import {describe, expect, it} from 'vitest';
import {mapBlocks} from '../lib/mapBlocks.ts';

/** Canvas rows as the unit draws them, `#` lit and `.` dark, joined as canvasToAscii joins them. */
const canvas = (...rows: string[]) => rows.join('\n');

describe('mapBlocks', () => {
	it('lights a block whose 16 pixels are all lit, as the unit draws its lines and icons', () => {
		expect(mapBlocks(canvas('####....', '####....', '####....', '####....'))).toBe('#.\n');
	});

	it('draws the top stroke of a label one map pixel high, although the font draws it one canvas row low', () => {
		// The top stroke of a D in the map font: canvas rows 5 to 8 of a label placed at row 4 (textBaseline top)
		const top = '############....';
		const blank = '................';
		expect(mapBlocks(canvas(blank, top, top, top, top, blank, blank, blank))).toBe('###.\n....\n');
	});

	it('lights a block with exactly half of its pixels lit, and not one with fewer', () => {
		const half = canvas('##..', '##..', '##..', '##..');
		const less = canvas('##..', '##..', '##..', '#...');
		expect(mapBlocks(half)).toBe('#\n');
		expect(mapBlocks(less)).toBe('.\n');
	});

	it('counts a block cut off at the right or bottom edge by the pixels it has', () => {
		expect(mapBlocks(canvas('######', '######'))).toBe('##\n');
		expect(mapBlocks(canvas('#.....', '......'))).toBe('..\n');
	});
});
