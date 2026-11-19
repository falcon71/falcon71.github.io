/**
 * The state of one side of the knob demo and the page tree it shows. The outer knob selects the page type, the inner
 * knob the page within it; both wrap around, and each page type comes back with the page last used in it.
 */
import type {PageGroup} from '../data/pageTree';

export type Knob = 'outer' | 'inner';

export interface KnobState {
	/** The selected page type */
	type: number;
	/** The last page of each page type */
	page: number[];
}

export interface TreePage {
	name: string;
	current: boolean;
	optional: boolean;
}

export interface TreeType {
	name: string;
	current: boolean;
	/** The pages of the selected page type; empty for the others and for a page type of one page */
	pages: TreePage[];
}

export function initialState(tree: PageGroup[], startType: number): KnobState {
	return {type: startType, page: tree.map(() => 0)};
}

const wrap = (i: number, n: number) => (i + n) % n;

export function turn(state: KnobState, tree: PageGroup[], knob: Knob, dir: 1 | -1): KnobState {
	if (knob === 'outer') return {type: wrap(state.type + dir, tree.length), page: state.page};
	const page = [...state.page];
	page[state.type] = wrap(page[state.type] + dir, tree[state.type].pages.length);
	return {type: state.type, page};
}

/** The page name as the status line shows it, five characters */
export function statusName(state: KnobState, tree: PageGroup[]): string {
	return tree[state.type].pages[state.page[state.type]];
}

export function treeView(state: KnobState, tree: PageGroup[]): TreeType[] {
	return tree.map((group, i) => {
		const current = i === state.type;
		const pages = current && group.pages.length > 1
			? group.pages.map((name, p) => ({
				name: name.trimEnd(),
				current: p === state.page[i],
				optional: group.optional?.includes(name) ?? false,
			}))
			: [];
		return {name: group.name, current, pages};
	});
}
