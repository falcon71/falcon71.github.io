import {describe, expect, it} from 'vitest';
import {initialState, statusName, treeView, turn, type Knob, type KnobState} from './knobDemo';
import {leftTree, rightTree} from '../data/pageTree';

/** Turns the left knobs through a list of steps, from NAV 1 */
function left(...steps: [Knob, 1 | -1][]): KnobState {
	return steps.reduce((s, [knob, dir]) => turn(s, leftTree, knob, dir), initialState(leftTree, 3));
}

describe('initialState', () => {
	it('starts at NAV 1 on the left and APT 1 on the right', () => {
		expect(statusName(initialState(leftTree, 3), leftTree)).toBe('NAV 1');
		expect(statusName(initialState(rightTree, 5), rightTree)).toBe('APT 1');
	});
});

describe('turn', () => {
	it('wraps the outer knob from the last page type to the first and back', () => {
		const oth = left(['outer', 1], ['outer', 1], ['outer', 1], ['outer', 1]);
		expect(statusName(oth, leftTree)).toBe('OTH 1');
		const tri = turn(oth, leftTree, 'outer', 1);
		expect(statusName(tri, leftTree)).toBe('TRI 0');
		expect(statusName(turn(tri, leftTree, 'outer', -1), leftTree)).toBe('OTH 1');
	});

	it('wraps the inner knob within its page type', () => {
		const nav5 = left(['inner', -1]);
		expect(statusName(nav5, leftTree)).toBe('NAV 5');
		expect(statusName(turn(nav5, leftTree, 'inner', 1), leftTree)).toBe('NAV 1');
	});

	it('brings a page type back with its last page', () => {
		expect(statusName(left(['inner', 1], ['inner', 1], ['outer', 1], ['outer', -1]), leftTree)).toBe('NAV 3');
	});

	it('leaves the state it was given unchanged', () => {
		const before = initialState(leftTree, 3);
		const copy = structuredClone(before);
		turn(before, leftTree, 'inner', 1);
		turn(before, leftTree, 'outer', 1);
		expect(before).toEqual(copy);
	});
});

describe('treeView', () => {
	it('expands only the selected page type', () => {
		const view = treeView(initialState(leftTree, 3), leftTree);
		expect(view.map((t) => t.name)).toEqual(['TRI', 'MOD', 'FPL', 'NAV', 'CAL', 'STA', 'SET', 'OTH']);
		expect(view.filter((t) => t.current).map((t) => t.name)).toEqual(['NAV']);
		expect(view[3].pages.map((p) => p.name)).toEqual(['NAV 1', 'NAV 2', 'NAV 3', 'NAV 4', 'NAV 5']);
		expect(view[3].pages.map((p) => p.current)).toEqual([true, false, false, false, false]);
		for (const t of view.filter((t) => !t.current)) expect(t.pages).toEqual([]);
	});

	it('lists all 26 FPL pages', () => {
		const pages = treeView(left(['outer', -1]), leftTree)[2].pages.map((p) => p.name);
		expect(pages).toHaveLength(26);
		expect(pages[0]).toBe('FPL 0');
		expect(pages[25]).toBe('FPL25');
	});

	it('ends SET with SET 0', () => {
		const pages = treeView(left(['outer', 1], ['outer', 1], ['outer', 1]), leftTree)[6].pages.map((p) => p.name);
		expect(pages.at(-1)).toBe('SET 0');
	});

	it('marks the optional pages', () => {
		const oth = treeView(left(['outer', 1], ['outer', 1], ['outer', 1], ['outer', 1]), leftTree)[7].pages;
		expect(oth.filter((p) => p.optional).map((p) => p.name)).toEqual(['OTH 5', 'OTH 6', 'OTH 7', 'OTH 8', 'OTH 9', 'OTH10']);
		const apt = treeView(initialState(rightTree, 5), rightTree)[5].pages;
		expect(apt.filter((p) => p.optional).map((p) => p.name)).toEqual(['APT 8']);
	});

	it('gives a page type with a single page no leaves', () => {
		const ref = treeView(initialState(rightTree, 1), rightTree)[1];
		expect(ref.current).toBe(true);
		expect(ref.pages).toEqual([]);
	});
});
