// The HTML of an example screen: the rows of segments, from the hand markup of KlnScreen or from a generated capture.
import type {MapSide, ScreenCapture} from './screenFile.ts';

export interface Segment {
	text: string;
	field?: string;
	inverse: boolean;
	flash: boolean;
}

export interface ScreenBlocks {
	/** A half screen: only that side is shown, with the middle line */
	crop?: 'left' | 'right';
	/** An excerpt of some rows: the window onto the stage, in screen pixels from the top of the screen */
	window?: ExcerptWindow;
	blocks: {cls: string; rows: Segment[][]}[];
}

const COLUMNS = 23;
const HALF = 11;
const RIGHT_OFFSET = 12;       // column 11 is the middle line
const STATUS_ROW = 6;
const CROPPED_STATUS = 5;      // the page name of the shown side: columns 0-4 on the left, 18-22 on the right
// Super NAV 5: the left column in columns 0-5, the message indicator and the range from column 6 in rows 5 and 6, the
// map everywhere else
const SNAV5_COLUMN = 6;
const SNAV5_OVERLAY_ROW = 5;

const MARKUP = /\{([a-z0-9-]*)([!~]*):([^}]*)\}/g;

function parseLine(line: string): Segment[] {
	const segments: Segment[] = [];
	let last = 0;
	for (const m of line.matchAll(MARKUP)) {
		if (m.index! > last) segments.push({text: line.slice(last, m.index), inverse: false, flash: false});
		segments.push({text: m[3], field: m[1] || undefined, inverse: m[2].includes('!'), flash: m[2].includes('~')});
		last = m.index! + m[0].length;
	}
	if (last < line.length) segments.push({text: line.slice(last), inverse: false, flash: false});
	return segments;
}

function visibleLength(line: string): number {
	return line.replace(MARKUP, '$3').length;
}

function parseBlock(block: string | undefined, width: number, rows: number, name: string, id: string): Segment[][] {
	if (block === undefined) return [];
	const lines = block.replace(/^\r?\n/, '').replace(/\r?\n\s*$/, '').split(/\r?\n/);
	if (lines.length > rows) throw new Error(`KlnScreen ${id}: ${name} has ${lines.length} rows, at most ${rows} fit`);
	return lines.map((line, i) => {
		const len = visibleLength(line);
		if (len > width) throw new Error(`KlnScreen ${id}: ${name} row ${i + 1} is ${len} characters, at most ${width} fit`);
		const segments = parseLine(line);
		if (len < width) segments.push({text: ' '.repeat(width - len), inverse: false, flash: false});
		return segments;
	});
}

/**
 * The blocks of the hand markup of `<KlnScreen>`: `{id:text}` fields, `!` inverse, `~` flashing. With only `left` or
 * only `right` the screen is cut in half and `status` is just the page name of that side.
 * @throws Error `KlnScreen <id>: ...` for a row that does not fit
 */
export function blocksFromMarkup(p: {left?: string; right?: string; full?: string; status?: string}, id: string): ScreenBlocks {
	const {left, right, full, status} = p;
	const crop = full === undefined && (left === undefined) !== (right === undefined) ? (left !== undefined ? 'left' : 'right') : undefined;

	// On a half screen the status line shows only that side's page name, in its place on the full line
	let statusLine = status;
	if (crop && status !== undefined) {
		const len = visibleLength(status);
		if (len > 5) throw new Error(`KlnScreen ${id}: on a half screen the status line is the page name, at most 5 characters`);
		statusLine = crop === 'left' ? status : ' '.repeat(23 - len) + status;
	}

	const leftRows = parseBlock(left, 11, 6, 'left', id);
	const rightRows = parseBlock(right, 11, 6, 'right', id);
	const fullRows = parseBlock(full, 23, status === undefined ? 7 : 6, 'full', id);
	const statusRows = parseBlock(statusLine, 23, 1, 'status', id);

	const blocks = full !== undefined ? [{rows: fullRows, cls: 'kln-full'}] : [
		{rows: leftRows, cls: 'kln-half kln-half-left'},
		// Always drawn on a split screen: its left border is the middle line
		{rows: rightRows, cls: 'kln-half kln-half-right'},
	];
	blocks.push({rows: statusRows, cls: 'kln-status'});
	return {crop, blocks: blocks.filter(b => b.rows.length > 0 || b.cls.includes('kln-half'))};
}

interface Cell {
	ch: string;
	field?: string;
	inverse: boolean;
	flash: boolean;
}

/** Consecutive cells with the same field, inverse and flash flags form one segment. */
function segmentsOf(cells: Cell[]): Segment[] {
	const segments: Segment[] = [];
	for (const cell of cells) {
		const last = segments[segments.length - 1];
		if (last && last.field === cell.field && last.inverse === cell.inverse && last.flash === cell.flash) {
			last.text += cell.ch;
		} else {
			segments.push({text: cell.ch, field: cell.field, inverse: cell.inverse, flash: cell.flash});
		}
	}
	return segments;
}

const blank = (): Cell => ({ch: ' ', inverse: false, flash: false});

/** Whether a cell of Super NAV 5 is drawn as text: in the left column, or in the rows of the msg indicator and range. */
const snav5Drawn = (row: number, col: number) => col < SNAV5_COLUMN || row >= SNAV5_OVERLAY_ROW;

/**
 * Checks that the cells of Super NAV 5 above the message indicator and the range, right of the left column, are blank,
 * and that every documented field has a cell elsewhere: the map is drawn there, not text, so a field there alone would
 * have no element to point at or link to.
 * @param where the start of the messages
 * @throws Error naming the first cell that is not a blank, or a documented field drawn nowhere
 */
function checkMapCells(c: ScreenCapture, documented: Set<string>, where: string): void {
	for (let row = 0; row < SNAV5_OVERLAY_ROW; row++) {
		const chars = Array.from(c.text[row]);
		for (let col = SNAV5_COLUMN; col < COLUMNS; col++) {
			if (chars[col] !== ' ' || c.mask[row][col] !== '.') {
				throw new Error(`${where}row ${row} column ${col} lies over the map but holds "${chars[col]}" with the mask "${c.mask[row][col]}"`);
			}
		}
	}
	for (const [id, parts] of c.fields) {
		if (documented.has(id) && !parts.some(p => snav5Drawn(p.row, p.from))) {
			throw new Error(`${where}the field ${id} lies only over the map above the message indicator and the range, so the site draws it nowhere`);
		}
	}
}

/**
 * The blocks of a generated screen. A field that is not `documented` is drawn as plain text. With `shownRows`, the screen
 * is an excerpt: the other rows are drawn blank, so that they hold no field, and the blocks carry the window that shows the
 * rows (see excerptWindow). On Super NAV 5 the part of a field that lies over the map above the message indicator and
 * the range is not drawn, as nothing but the map is there.
 * @param screen the screen's name for the messages
 * @throws Error on Super NAV 5, when a cell over the map is not a blank or a documented field lies only there (see
 * checkMapCells)
 */
export function blocksFromCapture(c: ScreenCapture, documented: Set<string>, screen?: string, shownRows?: RowRange): ScreenBlocks {
	const fieldAt = new Map<string, string>();
	for (const [id, parts] of c.fields) {
		if (!documented.has(id)) continue;
		for (const part of parts) for (let col = part.from; col < part.to; col++) fieldAt.set(`${part.row}:${col}`, id);
	}
	const rows = c.text.map(text => Array.from(text));
	const cell = (row: number, col: number): Cell => {
		if (shownRows && (row < shownRows.first || row > shownRows.last)) return blank();
		const attr = c.mask[row][col];
		return {
			ch: rows[row][col], field: fieldAt.get(`${row}:${col}`),
			inverse: attr === 'I' || attr === 'F', flash: attr === 'B' || attr === 'F',
		};
	};
	const rowOf = (row: number, from: number, to: number): Segment[] => {
		const cells: Cell[] = [];
		for (let col = from; col < to; col++) cells.push(cell(row, col));
		return segmentsOf(cells);
	};
	const rowsOf = (first: number, last: number, from: number, to: number): Segment[][] => {
		const out: Segment[][] = [];
		for (let row = first; row <= last; row++) out.push(rowOf(row, from, to));
		return out;
	};

	const crop = c.show === 'both' ? undefined : c.show;
	const excerpt = shownRows && excerptWindow(c, shownRows);
	const statusRow = (): Segment[] => {
		const cells: Cell[] = [];
		for (let col = 0; col < COLUMNS; col++) {
			const shown = crop === undefined || (crop === 'left' ? col < CROPPED_STATUS : col >= COLUMNS - CROPPED_STATUS);
			cells.push(shown ? cell(STATUS_ROW, col) : blank());
		}
		return segmentsOf(cells);
	};
	const status = {cls: 'kln-status', rows: c.status ? [statusRow()] : []};

	if (c.layout === 'super-nav-5') {
		checkMapCells(c, documented, `${screen ? `screen ${screen}: ` : ''}Super NAV 5: `);
		return {
			crop,
			blocks: [
				{cls: 'kln-snav5-left', rows: rowsOf(0, STATUS_ROW, 0, SNAV5_COLUMN)},
				{cls: 'kln-snav5-overlay', rows: rowsOf(SNAV5_OVERLAY_ROW, STATUS_ROW, SNAV5_COLUMN, COLUMNS)},
			],
		};
	}
	if (c.layout === 'full') {
		const last = c.status ? STATUS_ROW - 1 : STATUS_ROW;
		return {crop, window: excerpt, blocks: [{cls: 'kln-full', rows: rowsOf(0, last, 0, COLUMNS)}, status].filter(b => b.rows.length > 0)};
	}
	// A hidden half stays as an empty block: its left border is the middle line
	return {
		crop,
		window: excerpt,
		blocks: [
			{cls: 'kln-half kln-half-left', rows: crop === 'right' ? [] : rowsOf(0, STATUS_ROW - 1, 0, HALF)},
			{cls: 'kln-half kln-half-right', rows: crop === 'left' ? [] : rowsOf(0, STATUS_ROW - 1, RIGHT_OFFSET, COLUMNS)},
			status,
		].filter(b => b.rows.length > 0 || b.cls.includes('kln-half')),
	};
}

/** Rows of a capture, 0 to 6 from the top, both inclusive. Row 6 is the status line where the screen has one. */
export interface RowRange {
	first: number;
	last: number;
}

/** The part of the 100 screen pixels high stage that an excerpt shows, in screen pixels. */
export interface ExcerptWindow {
	top: number;
	height: number;
}

// The geometry of kln-screen.css: rows of 13 px from y = 3, the status line's border at y = 81, its text from y = 83
const ROW_HEIGHT = 13;
const TEXT_TOP = 3;
const STATUS_BORDER = 81;
const SCREEN_HEIGHT = 100;

/**
 * The rows that `<KlnScreen rows>` names: one row "3" or consecutive rows "1-2", numbered from 1 at the top line of the
 * page; on a split screen 7 is the status line, on a full page 1 to 7 are its seven rows.
 * @param screen the screen's name for the messages
 * @throws Error `KlnScreen screen="<screen>" rows="<value>": ...` for any other value, a row the screen does not have, or
 * a screen with a map
 */
export function parseRows(value: string, c: ScreenCapture, screen: string): RowRange {
	const fail = (message: string): never => {
		throw new Error(`KlnScreen screen="${screen}" rows="${value}": ${message}`);
	};
	if (c.layout === 'super-nav-5' || c.maps.length > 0 || c.mapFields.size > 0) {
		fail('a screen with a map is always shown whole, without rows');
	}
	const m = /^([1-9]\d*)(?:-([1-9]\d*))?$/.exec(value);
	if (m === null) fail('rows takes one row, e.g. "1", or consecutive rows from the upper to the lower, e.g. "1-2"');
	const first = Number(m![1]);
	const last = m![2] === undefined ? first : Number(m![2]);
	if (last < first) fail('a range runs from the upper row to the lower, e.g. "1-2"');
	const count = c.layout === 'split' && !c.status ? STATUS_ROW : STATUS_ROW + 1;
	const what = count === STATUS_ROW + 1 && c.layout === 'split' ? ', 7 is the status line' : '';
	if (last > count) fail(`the screen has the rows 1 to ${count}${what}`);
	return {first: first - 1, last: last - 1};
}

/**
 * The window onto the stage that shows the rows of an excerpt with the margins of the whole screen: 3 px above a row
 * of the page and 3 px below it, but never the line above the status line under the page rows. The status line alone
 * starts below that line.
 */
export function excerptWindow(c: ScreenCapture, rows: RowRange): ExcerptWindow {
	const isStatus = (row: number) => c.status && row === STATUS_ROW;
	const top = isStatus(rows.first) ? STATUS_BORDER + 1 : ROW_HEIGHT * rows.first;
	let bottom = isStatus(rows.last) ? SCREEN_HEIGHT : TEXT_TOP + ROW_HEIGHT * (rows.last + 1) + TEXT_TOP;
	if (c.status && rows.last < STATUS_ROW) bottom = Math.min(bottom, STATUS_BORDER);
	return {top, height: bottom - top};
}

/** The `documented` text fields of a capture that have a part on the rows. */
export function fieldsOnRows(c: ScreenCapture, documented: ReadonlySet<string>, rows: RowRange): Set<string> {
	return new Set([...c.fields]
		.filter(([id, parts]) => documented.has(id) && parts.some(p => p.row >= rows.first && p.row <= rows.last))
		.map(([id]) => id));
}

// The start tag of a field explanation as Field.astro writes it
const FIELD_DOC = /<div\b[^>]*\bclass="kln-field-doc"[^>]*>/g;
const DATA_FIELD = /\sdata-field="([^"]*)"/;

/**
 * The rendered field explanations (the HTML of the <Field> elements of a fields.mdx, one after the other) with only
 * those of the `shown` fields.
 * @param screen the screen's name for the messages
 * @throws Error when a shown field has no explanation in the HTML: the markup of Field.astro changed
 */
export function onlyFieldDocs(html: string, shown: ReadonlySet<string>, screen: string): string {
	const starts = [...html.matchAll(FIELD_DOC)];
	let out = html.slice(0, starts[0]?.index ?? html.length);
	const found = new Set<string>();
	starts.forEach((m, i) => {
		const id = DATA_FIELD.exec(m[0])?.[1];
		const end = starts[i + 1]?.index ?? html.length;
		if (id !== undefined && shown.has(id)) {
			found.add(id);
			out += html.slice(m.index, end);
		}
	});
	const missing = [...shown].filter(id => !found.has(id));
	if (missing.length > 0) {
		throw new Error(`screen ${screen}: the rendered explanations have none of the field ${missing.join(', ')}; the markup of Field.astro changed`);
	}
	return out;
}

const escapeHtml = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Built as a string: whitespace is significant on the screen, so no template formatting may leak into it.
function segmentHtml(s: Segment, documented: Set<string>): string {
	const text = escapeHtml(s.text);
	const isField = s.field !== undefined && documented.has(s.field);
	const cls = [s.inverse && 'kln-inv', s.flash && 'kln-flash', isField && 'kln-field'].filter(Boolean).join(' ');
	if (isField) return `<span class="${cls}" tabindex="0" data-field="${s.field}">${text}</span>`;
	return cls ? `<span class="${cls}">${text}</span>` : text;
}

/** The maps of the half pages or of Super NAV 5 as inline SVG, which go under the text. */
export type Maps = Partial<Record<MapSide, string>>;

const MAP_SIDES: MapSide[] = ['L', 'R', 'F'];
const MAP_CLASS = {L: 'kln-map kln-map-left', R: 'kln-map kln-map-right', F: 'kln-map kln-map-full'} as const;

// The group of a map element as the generator writes it (its data-draw is escaped, so it holds no ">")
const MAP_ELEMENT = /<g data-field="([^"]*)"([^>]*) data-box="(\d+) (\d+) (\d+) (\d+)">/;
const MAP_GROUP_TAG = /<g\b[^>]*>/g;

/** What the map fields of a screen must match: the screen's name for the messages and the map fields of its capture. */
export interface MapCheck {
	screen: string;
	mapFields: ReadonlyMap<string, MapSide>;
}

/**
 * The SVG of a map with each element of a `documented` field made a field like the text fields: focusable, with a
 * transparent hit area of its box as the first child, so that pointing anywhere in the box hits it.
 * @throws Error when a group of the SVG is not in the form the generator writes, or, with `check`, when a documented map
 * field of this side has no group. Either would silently leave elements unexplained.
 */
function mapFieldsHtml(svg: string, side: MapSide, documented: Set<string>, check?: MapCheck): {html: string; hasFields: boolean} {
	const where = `${check ? `screen ${check.screen}: ` : ''}map ${side}`;
	const seen = new Set<string>();
	let hasFields = false;
	const html = svg.replace(MAP_GROUP_TAG, tag => {
		const m = MAP_ELEMENT.exec(tag);
		if (m === null || m[0] !== tag) throw new Error(`${where} has an element the site cannot read, the generator's format changed: ${tag}`);
		const [group, field, rest, x, y, w, h] = m;
		seen.add(field);
		if (!documented.has(field)) return group;
		hasFields = true;
		return `<g class="kln-field" tabindex="0" role="img" data-field="${field}"${rest} data-box="${x} ${y} ${w} ${h}">` +
			`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent"/>`;
	});
	for (const [field, fieldSide] of check?.mapFields ?? []) {
		if (fieldSide === side && documented.has(field) && !seen.has(field)) {
			throw new Error(`${where} has no element of the map field ${field}`);
		}
	}
	return {html, hasFields};
}

/**
 * The inside of the stage of a screen. A field that is not `documented` is drawn as plain text, and so is an element of
 * a map. A map comes first, so that the text of its half, or of Super NAV 5, is drawn over it. A map with fields is a
 * labeled group, since its fields must stay reachable; one without is hidden from assistive technology.
 * @param check the screen's name and map fields; with it, a documented map field without an element in its map is an error
 * @throws Error see mapFieldsHtml
 */
export function screenHtml(b: ScreenBlocks, documented: Set<string>, maps: Maps = {}, check?: MapCheck): string {
	const mapHtml = MAP_SIDES
		.filter(side => maps[side] !== undefined)
		.map(side => {
			const {html, hasFields} = mapFieldsHtml(maps[side]!, side, documented, check);
			const access = hasFields ? 'role="group" aria-label="Map"' : 'aria-hidden="true"';
			return `<div class="${MAP_CLASS[side]}" ${access}>${html}</div>`;
		})
		.join('');
	return mapHtml + b.blocks
		.map(block => `<div class="${block.cls}">${block.rows.map(row =>
			`<span class="kln-row">${row.map(s => segmentHtml(s, documented)).join('')}</span>`).join('')}</div>`)
		.join('');
}
