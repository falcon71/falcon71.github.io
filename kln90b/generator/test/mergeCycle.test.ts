import {describe, expect, it} from 'vitest';
import {checkStable, mergeCycle} from '../lib/capture.ts';
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

	it('marks inverse text that blinks away as flashing inverse', () => {
		// The Blink control: an inverse span that gets the blink class on the blink tick
		const merged = mergeCycle([read('A', 'I'), read('A', 'I'), read('A', 'I'), read('A', 'B')]);
		expect(merged).toEqual([[{ch: 'A', attr: 'F'}]]);
	});

	it('marks a cell that reads F and B as flashing inverse', () => {
		const merged = mergeCycle([read('K', 'F'), read('K', 'B'), read('K', 'F'), read('K', 'B')]);
		expect(merged).toEqual([[{ch: 'K', attr: 'F'}]]);
	});

	it('throws when the reads differ in size', () => {
		expect(() => mergeCycle([read('AB', '..'), read('A', '.')])).toThrow(/size/);
	});
});

describe('checkStable', () => {
	it('accepts four equal inspections', () => {
		const tick = {layout: 'split' as const, status: true};
		expect(checkStable([tick, tick, tick, tick])).toBeUndefined();
	});

	it('throws when the layout changes during the cycle', () => {
		const split = {layout: 'split' as const, status: true};
		const full = {layout: 'full' as const, status: true};
		expect(() => checkStable([split, split, full, full])).toThrow('the screen changed during the blink cycle: layout split → full');
	});

	it('throws when the status line appears during the cycle', () => {
		const without = {layout: 'full' as const, status: false};
		const withStatus = {layout: 'full' as const, status: true};
		expect(() => checkStable([without, without, without, withStatus])).toThrow('status false → true');
	});
});
