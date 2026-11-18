import {describe, expect, it} from 'vitest';
import {coverOf, isCovered} from '../lib/capture.ts';
import type {Cell} from '../../../vendor/kln90b/test/harness/render/screen';

type Set = [row: number, column: number, ch: string, attr: Cell['attr']];

/** A 23 x 7 grid of normal blanks with the given cells set. */
function grid(...set: Set[]): Cell[][] {
	const cells: Cell[][] = Array.from({length: 7}, () => Array.from({length: 23}, () => ({ch: ' ', attr: '.' as Cell['attr']})));
	for (const [row, column, ch, attr] of set) cells[row][column] = {ch, attr};
	return cells;
}

describe('coverOf', () => {
	it('covers nothing while the menu and the window are closed', () => {
		expect(coverOf(grid([6, 6, '4', '.'], [5, 6, 'm', 'F']))).toEqual([]);
	});

	it('covers the pixels of the menu: 8 characters of 9 pixels from the map pixel 76, 4 rows of 13 and the border line', () => {
		expect(coverOf(grid([0, 15, 'Ü', '.']))).toEqual([{x: 76, y: 0, w: 72, h: 53}]);
		// Any cell of the rectangle opens it, and the blank ones are covered with it
		expect(coverOf(grid([3, 22, '^', '.']))).toEqual([{x: 76, y: 0, w: 72, h: 53}]);
	});

	it('covers the pixels of the window: 6 characters from the map pixel 94 in the last row, even when it is empty', () => {
		const empty: Set[] = [17, 18, 19, 20, 21, 22].map(c => [6, c, ' ', 'I']);
		expect(coverOf(grid(...empty))).toEqual([{x: 94, y: 78, w: 54, h: 13}]);
	});

	it('is not opened by the range, which ends before column 17', () => {
		expect(coverOf(grid([6, 6, 'A', '.'], [6, 7, 'U', '.'], [6, 8, 'T', '.'], [6, 9, 'O', '.']))).toEqual([]);
	});
});

describe('isCovered', () => {
	const rects = [{x: 76, y: 0, w: 72, h: 53}];

	it('is true inside a rectangle and false on every side outside it', () => {
		expect(isCovered(rects, 76, 0)).toBe(true);
		expect(isCovered(rects, 147, 52)).toBe(true);
		expect(isCovered(rects, 75, 10)).toBe(false);
		expect(isCovered(rects, 148, 10)).toBe(false);
		expect(isCovered(rects, 100, 53)).toBe(false);
		expect(isCovered([], 100, 10)).toBe(false);
	});
});
