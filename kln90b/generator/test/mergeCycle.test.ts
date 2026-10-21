import {describe, expect, it} from 'vitest';
import {mergeCycle} from '../lib/capture.ts';
import type {Cell} from '../../../vendor/kln90b/test/harness/render/screen';

type Attr = Cell['attr'];

/** One read of a one-row grid: the characters and one attribute per cell. */
function read(text: string, attrs: string): Cell[][] {
	return [Array.from(text).map((ch, i) => ({ch, attr: attrs[i] as Attr}))];
}

describe('mergeCycle', () => {
	it('keeps a steady cell', () => {
		const merged = mergeCycle([read('AB', '.I'), read('AB', '.I'), read('AB', '.I'), read('AB', '.I')]);
		expect(merged).toEqual([[{ch: 'A', attr: '.'}, {ch: 'B', attr: 'I'}]]);
	});

	it('marks flashing text', () => {
		// The dark phase reads B; the character is still in the cell
		const merged = mergeCycle([read('K', '.'), read('K', 'B'), read('K', '.'), read('K', 'B')]);
		expect(merged).toEqual([[{ch: 'K', attr: 'B'}]]);
	});

	it('marks a flashing inverse cell', () => {
		const merged = mergeCycle([read('K', 'I'), read('K', 'F'), read('K', 'I'), read('K', 'F')]);
		expect(merged).toEqual([[{ch: 'K', attr: 'F'}]]);
	});

	it('marks a cell that flips between normal and inverse', () => {
		const merged = mergeCycle([read('K', '.'), read('K', 'I'), read('K', '.'), read('K', 'I')]);
		expect(merged).toEqual([[{ch: 'K', attr: 'F'}]]);
	});

	it('takes the characters of the last read', () => {
		const merged = mergeCycle([read('0:21', '....'), read('0:21', '....'), read('0:21', '....'), read('0:22', '....')]);
		expect(merged[0].map(c => c.ch).join('')).toBe('0:22');
	});

	it('merges every row and column on its own', () => {
		const grid = (a: Attr, b: Attr): Cell[][] => [[{ch: 'A', attr: '.'}], [{ch: 'B', attr: a}, {ch: 'C', attr: b}]];
		const merged = mergeCycle([grid('.', 'I'), grid('B', 'I'), grid('.', 'I'), grid('B', 'I')]);
		expect(merged.map(r => r.map(c => c.attr))).toEqual([['.'], ['B', 'I']]);
	});

	it('throws on B with I and names the cell', () => {
		const grid = (a: Attr): Cell[][] => [[{ch: 'A', attr: '.'}], [{ch: 'B', attr: '.'}, {ch: 'C', attr: '.'}, {ch: 'D', attr: '.'}, {ch: 'E', attr: a}]];
		expect(() => mergeCycle([grid('B'), grid('I'), grid('B'), grid('I')])).toThrow('row 1 column 3');
	});

	it('throws on B with F', () => {
		expect(() => mergeCycle([read('K', 'B'), read('K', 'F'), read('K', 'B'), read('K', 'F')])).toThrow('row 0 column 0');
	});

	it('throws when the reads differ in size', () => {
		expect(() => mergeCycle([read('AB', '..'), read('A', '.')])).toThrow(/size/);
	});
});
