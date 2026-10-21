import type {FieldPart, Show} from '../../src/lib/screenFile.ts';

/** Left half, right half, status line, full page. */
export type Area = 'L' | 'R' | 'S' | 'F';

/** The map of the left or the right half page. */
export type MapSide = 'L' | 'R';

/**
 * Where a field is on the screen:
 * - a regex, searched in every visible area;
 * - a regex with an area, and optionally one row of it (`row` needs an `area`);
 * - a place: one row of an area, trimmed to its non-blank cells or cut at `from`/`to`.
 * - a map locator: the elements of the map of one half whose description (`icon % KSEA`, see mapElements.ts) `draw`
 *   matches; exactly one element, or with `many` at least one.
 * Rows count from 0 within the area (0-5 for L and R, 0-5 or 0-6 for F, only 0 for S). Columns count from 0 within
 * the area (0-10 for L and R, 0-22 for S and F, `to` exclusive).
 */
export type Locator =
	| RegExp
	| {re: RegExp; area?: Area; row?: number}
	| {area: Area; row?: number; from?: number; to?: number}
	| MapLocator;

export interface MapLocator {
	map: MapSide;
	draw: RegExp;
	many?: boolean;
}

type TextLocator = Exclude<Locator, MapLocator>;

/**
 * An array of locators gives a field of several parts. The locators of a field are all text locators or all map
 * locators of one side.
 */
export interface FieldDef {
	id: string;
	find: Locator | Locator[];
}

const ROWS = 7;
const COLUMNS = 23;
const HALF = 11;
const RIGHT_OFFSET = 12;                // column 11 is the middle line
const STATUS_ROW = 6;
const ID = /^[a-z0-9-]+$/;
// Columns of the status line that a cropped screen shows: the page name of the visible side
const PAGE_NAME: {[side in 'left' | 'right']: {from: number; to: number}} = {left: {from: 0, to: 5}, right: {from: 18, to: 23}};

interface Layout {
	text: string[];
	layout: 'split' | 'full';
	show: Show;
	status: boolean;
}

interface Region {
	name: Area;
	offset: number;     // screen column of the area's column 0
	width: number;
	rows: number;       // number of rows of the area
	firstRow: number;   // screen row of the area's row 0
}

function region(name: Area, ctx: Layout): Region {
	const hidden = (why: string): never => {
		throw new Error(`area ${name} does not exist ${why}`);
	};
	switch (name) {
		case 'L':
			if (ctx.layout !== 'split') hidden('on a full layout');
			if (ctx.show === 'right') hidden('on a screen that shows only the right half');
			return {name, offset: 0, width: HALF, rows: STATUS_ROW, firstRow: 0};
		case 'R':
			if (ctx.layout !== 'split') hidden('on a full layout');
			if (ctx.show === 'left') hidden('on a screen that shows only the left half');
			return {name, offset: RIGHT_OFFSET, width: HALF, rows: STATUS_ROW, firstRow: 0};
		case 'S':
			if (!ctx.status) hidden('on a screen without status line');
			return {name, offset: 0, width: COLUMNS, rows: 1, firstRow: STATUS_ROW};
		case 'F':
			if (ctx.layout !== 'full') hidden('on a split layout');
			return {name, offset: 0, width: COLUMNS, rows: ctx.status ? STATUS_ROW : ROWS, firstRow: 0};
		default:
			throw new Error(`unknown area "${name}"`);
	}
}

/** The areas a locator without an area searches, in screen order. */
function visibleRegions(ctx: Layout): Region[] {
	const names: Area[] = [];
	if (ctx.layout === 'full') names.push('F');
	else names.push(...(ctx.show === 'right' ? [] : ['L' as const]), ...(ctx.show === 'left' ? [] : ['R' as const]));
	if (ctx.status) names.push('S');
	return names.map(name => region(name, ctx));
}

function checkRow(reg: Region, row: number | undefined): number {
	const index = row ?? 0;
	if (row === undefined && reg.rows > 1) throw new Error(`area ${reg.name} needs a row`);
	if (!Number.isInteger(index) || index < 0 || index >= reg.rows) {
		throw new Error(`row ${row} is outside the ${reg.rows} row${reg.rows === 1 ? '' : 's'} of area ${reg.name}`);
	}
	return index;
}

/** The cells of one row of an area. */
function cells(reg: Region, index: number, ctx: Layout): string {
	return ctx.text[reg.firstRow + index].slice(reg.offset, reg.offset + reg.width);
}

function matches(re: RegExp, reg: Region, index: number, ctx: Layout): FieldPart[] {
	// A clone, so that the caller's lastIndex is neither read nor changed
	const clone = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
	const row = cells(reg, index, ctx);
	const parts: FieldPart[] = [];
	let m: RegExpExecArray | null;
	while ((m = clone.exec(row)) !== null) {
		if (m[0] === '') throw new Error(`${re} matches an empty string`);
		parts.push({row: reg.firstRow + index, from: reg.offset + m.index, to: reg.offset + m.index + m[0].length});
	}
	return parts;
}

function locateRegex(re: RegExp, areaName: Area | undefined, row: number | undefined, ctx: Layout): FieldPart[] {
	if (row !== undefined && areaName === undefined) throw new Error(`${re} names a row but no area`);
	const regions = areaName === undefined ? visibleRegions(ctx) : [region(areaName, ctx)];
	const found: FieldPart[] = [];
	for (const reg of regions) {
		const indexes = row === undefined ? Array.from({length: reg.rows}, (_, i) => i) : [checkRow(reg, row)];
		for (const index of indexes) found.push(...matches(re, reg, index, ctx));
	}
	if (found.length === 0) throw new Error(`${re} matches nothing`);
	if (found.length > 1) throw new Error(`${re} matches ${found.length} times`);
	return found;
}

function locatePlace(areaName: Area, row: number | undefined, from: number | undefined, to: number | undefined,
					 ctx: Layout): FieldPart[] {
	const reg = region(areaName, ctx);
	const index = checkRow(reg, row);
	let start: number;
	let end: number;
	if (from === undefined && to === undefined) {
		const content = cells(reg, index, ctx);
		start = content.search(/[^ ]/);
		if (start < 0) throw new Error(`row ${index} of area ${areaName} is blank`);
		end = content.replace(/ +$/, '').length;
	} else {
		start = from ?? 0;
		end = to ?? reg.width;
		if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start >= end || end > reg.width) {
			throw new Error(`columns ${start} to ${end} are outside the ${reg.width} columns of area ${areaName}`);
		}
	}
	return [{row: reg.firstRow + index, from: reg.offset + start, to: reg.offset + end}];
}

function locate(loc: TextLocator, ctx: Layout): FieldPart[] {
	if (loc instanceof RegExp) return locateRegex(loc, undefined, undefined, ctx);
	if ('re' in loc) return locateRegex(loc.re, loc.area, loc.row, ctx);
	return locatePlace(loc.area, loc.row, loc.from, loc.to, ctx);
}

function isMapLocator(loc: Locator): loc is MapLocator {
	return !(loc instanceof RegExp) && 'map' in loc;
}

type Field = {id: string} & ({map: false; finds: TextLocator[]} | {map: true; finds: MapLocator[]});

/**
 * The field definitions of a screen description, with their locators as a list and whether each is a map field.
 * @throws Error `field <id>: ...` for a bad id, an id defined twice, an empty list and a mix of text and map locators
 */
function fieldsOf(defs: FieldDef[]): Field[] {
	const ids = new Set<string>();
	return defs.map(({id, find}) => {
		try {
			if (!ID.test(id)) throw new Error(`the id must match ${ID}`);
			if (ids.has(id)) throw new Error('is defined twice');
			ids.add(id);
			const finds = Array.isArray(find) ? find : [find];
			if (finds.length === 0) throw new Error('has no locator');
			const maps = finds.filter(isMapLocator);
			if (maps.length === finds.length) return {id, map: true, finds: maps};
			if (maps.length > 0) throw new Error('mixes text and map locators');
			return {id, map: false, finds: finds as TextLocator[]};
		} catch (e) {
			throw new Error(`field ${id}: ${(e as Error).message}`);
		}
	});
}

/** Runs `f`, with an error that names the field. */
function inField<T>(id: string, f: () => T): T {
	try {
		return f();
	} catch (e) {
		throw new Error(`field ${id}: ${(e as Error).message}`);
	}
}

function overlap(a: FieldPart, b: FieldPart): boolean {
	return a.row === b.row && a.from < b.to && b.from < a.to;
}

/** On a cropped screen the status line shows only the page name of the visible side. */
function checkCropped(parts: FieldPart[], ctx: Layout): void {
	if (ctx.layout !== 'split' || ctx.show === 'both') return;
	const name = PAGE_NAME[ctx.show];
	for (const part of parts) {
		if (part.row === STATUS_ROW && (part.from < name.from || part.to > name.to)) {
			throw new Error(`the status line of a screen that shows only the ${ctx.show} half shows only the page name, ` +
				`columns ${name.from} to ${name.to}, but the part is columns ${part.from} to ${part.to}`);
		}
	}
}

/**
 * Turns the text fields of a screen description into cell ranges. The map fields are left to locateMapFields.
 *
 * @param text the 7 rows of 23 characters as captured: on a split layout column 11 of rows 0-5 is the middle line
 * and row 6 the status line
 * @param status false only for a full page without status line, which then has the page rows 0-6
 * @return the parts of each field in the order of the definitions, as absolute screen rows and columns
 * @throws Error `field <id>: ...` for a field that matches nothing or more than once, lies in a hidden area, outside
 * the page name of a cropped status line, or overlaps another field, and for a bad definition of any field
 */
export function locateFields(text: string[], layout: 'split' | 'full', show: Show, defs: FieldDef[],
							 status = true): Map<string, FieldPart[]> {
	if (text.length !== ROWS) throw new Error(`text must have ${ROWS} rows of ${COLUMNS} characters, not ${text.length} rows`);
	text.forEach((row, i) => {
		if (row.length !== COLUMNS) throw new Error(`text row ${i} has ${row.length} characters instead of ${COLUMNS}`);
	});
	const ctx: Layout = {text, layout, show, status};
	const fields = new Map<string, FieldPart[]>();
	const owners: {id: string; part: FieldPart}[] = [];
	for (const field of fieldsOf(defs)) {
		if (field.map) continue;
		const {id, finds} = field;
		inField(id, () => {
			const parts: FieldPart[] = [];
			for (const loc of finds) parts.push(...locate(loc, ctx));
			checkCropped(parts, ctx);
			parts.forEach((part, i) => {
				if (parts.slice(0, i).some(other => overlap(part, other))) throw new Error('overlaps itself');
				const other = owners.find(o => overlap(part, o.part));
				if (other) throw new Error(`overlaps field ${other.id}`);
			});
			fields.set(id, parts);
			owners.push(...parts.map(part => ({id, part})));
		});
	}
	return fields;
}

/** The map fields of a screen: the side of each field, and the field of each element of each map, by element index. */
export interface MapFields {
	sides: Map<string, MapSide>;
	owners: Partial<Record<MapSide, string[]>>;
}

const SHOWN: {[show in Show]: MapSide[]} = {left: ['L'], right: ['R'], both: ['L', 'R']};

/**
 * Gives the elements of the maps to the map fields of a screen description. Every element of a map the screen shows
 * must belong to exactly one field.
 * @param elements the elements of each map the unit shows, in drawing order, by their descriptions
 * @return the map fields in the order of the definitions, and the field of each element of each map the screen shows
 * @throws Error `field <id>: ...` for a map locator that matches no element, more than one without `many`, or names a
 * side the screen does not show or that has no map, for an element claimed twice, and for a bad definition of any
 * field; `the element "<description>" of map <side> belongs to no field` for an element no field claims (all of them
 * when there are several)
 */
export function locateMapFields(defs: FieldDef[], show: Show, elements: Partial<Record<MapSide, {draw: string}[]>>): MapFields {
	const sides = new Map<string, MapSide>();
	const owners: Partial<Record<MapSide, string[]>> = {};
	for (const side of SHOWN[show]) {
		const list = elements[side];
		if (list !== undefined) owners[side] = list.map(() => '');
	}
	for (const field of fieldsOf(defs)) {
		if (!field.map) continue;
		const {id, finds} = field;
		inField(id, () => {
			const side = finds[0].map;
			if (finds.some(loc => loc.map !== side)) throw new Error('its map locators name both sides');
			if (!SHOWN[show].includes(side)) throw new Error(`map ${side} is not shown`);
			const list = elements[side];
			const owner = owners[side];
			if (list === undefined || owner === undefined) throw new Error(`there is no map ${side}`);
			for (const loc of finds) {
				// Without the global and sticky flags, so that the caller's lastIndex is neither read nor changed
				const re = new RegExp(loc.draw.source, loc.draw.flags.replace(/[gy]/g, ''));
				const found = list.map((_, i) => i).filter(i => re.test(list[i].draw));
				if (found.length === 0) throw new Error(`${loc.draw} matches no element of map ${side}`);
				if (found.length > 1 && !loc.many) {
					const names = found.map(i => `"${list[i].draw}"`).join(', ');
					throw new Error(`${loc.draw} matches ${found.length} elements of map ${side}: ${names}`);
				}
				for (const i of found) {
					const what = `the element "${list[i].draw}" of map ${side}`;
					if (owner[i] === id) throw new Error(`${what} is claimed twice by the field`);
					if (owner[i] !== '') throw new Error(`${what} belongs to the fields ${owner[i]} and ${id}`);
					owner[i] = id;
				}
			}
			sides.set(id, side);
		});
	}
	for (const side of SHOWN[show]) {
		const free = (owners[side] ?? []).flatMap((owner, i) => owner === '' ? [`"${elements[side]![i].draw}"`] : []);
		if (free.length === 1) throw new Error(`the element ${free[0]} of map ${side} belongs to no field`);
		if (free.length > 1) throw new Error(`the elements ${free.join(', ')} of map ${side} belong to no field`);
	}
	return {sides, owners};
}
