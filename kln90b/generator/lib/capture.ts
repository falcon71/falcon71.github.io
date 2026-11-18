import type {Cell} from '../../../vendor/kln90b/test/harness/render/screen';
import {readRows, Screen} from '../../../vendor/kln90b/test/harness/render/screen';
import {blinkCycle} from '../../../vendor/kln90b/test/harness/render/blink';
import type {Layout, MapSide} from '../../src/lib/screenFile.ts';
import type {MapElement, MapRecorder} from './mapElements.ts';

export interface CapturedScreen {
	layout: Layout;
	/** False only for a full page without status line (the welcome page) and for Super NAV 5 */
	status: boolean;
	cells: Cell[][];
	/** The map canvases of the visible half pages or of Super NAV 5, as they are at the last tick of the cycle */
	canvases: Partial<Record<MapSide, HTMLCanvasElement>>;
	/**
	 * The elements of the last frame each canvas finished while the recorder ran, in drawing order. On Super NAV 5 without
	 * the elements that the menu or the window hides entirely (see `coverOf`).
	 */
	elements: Partial<Record<MapSide, MapElement[]>>;
	/** The map pixels of the full-page map that the opaque menu and window of Super NAV 5 cover; empty on every other page */
	covered: PixelRect[];
}

/** A rectangle of map pixels: x and y from the top left of the map, `w` x `h` pixels. */
export interface PixelRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

const MAP_SIDES: MapSide[] = ['L', 'R', 'F'];

type Attr = Cell['attr'];

/**
 * The attribute a cell shows over one blink cycle, from the set of attributes it had on the reads: flashing text with
 * inverse is a flashing inverse cell, as the Blink control makes it (an inverse span that gets `blink` on the blink
 * tick, so it reads I, I, I, B).
 */
function merged(seen: Set<Attr>): Attr {
	const has = (a: Attr) => seen.has(a);
	if (has('B') && (has('I') || has('F'))) return 'F';
	if (has('B')) return 'B';
	if (has('F') || (has('I') && has('.'))) return 'F';
	return has('I') ? 'I' : '.';
}

/**
 * Merges the reads of one blink cycle into one grid. The characters are those of the last read (a clock may tick during
 * the cycle). A cell that is not the same on every read flashes: the set of attributes it showed says how (B alone is
 * flashing text, B with I or F and I with normal text are a flashing inverse cell, F).
 * @param reads the grids of the four ticks of `blinkCycle`, indexed `[tick][row][column]`
 * @throws Error when the reads differ in size
 */
export function mergeCycle(reads: Cell[][][]): Cell[][] {
	if (reads.length === 0) throw new Error('mergeCycle needs at least one read');
	const last = reads[reads.length - 1];
	for (const read of reads) {
		const same = read.length === last.length && read.every((row, r) => row.length === last[r].length);
		if (!same) throw new Error('mergeCycle: the reads of one cycle differ in size');
	}
	return last.map((row, r) => row.map((cell, c) => ({
		ch: cell.ch,
		attr: merged(new Set(reads.map(read => read[r][c].attr))),
	})));
}

function visible(container: Element, selector: string): Element | null {
	const el = container.querySelector(selector);
	return el !== null && el.closest('.d-none') === null ? el : null;
}

type Inspection = Omit<CapturedScreen, 'cells' | 'elements' | 'covered'>;

/**
 * Checks that the layout and the status line were the same on every tick of the cycle; reads of two different pages
 * would otherwise merge into a screen that never existed.
 * @throws Error `the screen changed during the blink cycle: layout split → full`
 */
export function checkStable(inspections: Pick<Inspection, 'layout' | 'status'>[]): void {
	const first = inspections[0];
	for (const key of ['layout', 'status'] as const) {
		const other = inspections.find(i => i[key] !== first[key]);
		if (other) throw new Error(`the screen changed during the blink cycle: ${key} ${first[key]} → ${other[key]}`);
	}
}

/**
 * What the unit shows now: the layout, whether there is a status line and the map canvases of the half pages or of
 * Super NAV 5.
 */
function inspect(container: Element): Inspection {
	const left = visible(container, '.left-page');
	const right = visible(container, '.right-page');
	const full = visible(container, '.full-page');
	const status = visible(container, '.statusline') !== null;
	if (left && right) {
		const canvas = (half: Element) => half.querySelector('canvas') ?? undefined;
		return {layout: 'split', status, canvases: {L: canvas(left), R: canvas(right)}};
	}
	if (full) {
		if (full.querySelector('.super-nav5-left-controls') === null) return {layout: 'full', status, canvases: {}};
		return {layout: 'super-nav-5', status, canvases: {F: full.querySelector('canvas.canvas-fullpage') ?? undefined}};
	}
	throw new Error('the unit shows no page: neither both half pages nor a full page are visible');
}

const ROWS = 7;
const COLUMNS = 23;
// Super NAV 5: the left column is six cells wide; the message indicator and the range are its last two rows, drawn over
// the map from column 6 (KLN90B.scss: .super-nav5-mgs-range sits 6 unit pixels right of column 6, and so must the site)
const SUPER_NAV5_COLUMN = 6;
const SUPER_NAV5_OVERLAY_ROW = 5;

// The right menu of Super NAV 5 sits in rows 0-3, the last 8 columns, the direct-to window in row 6, the last 6 columns
// (KLN90B.scss: .super-nav5-right-controls-parent, .super-nav5-directto-window)
const MENU = {row: 0, column: 15, rows: 4, width: 8};
const WINDOW = {row: 6, column: 17, width: 6};
// The map starts 59 unit pixels right of the first text column (the left column is 6 characters of 9 pixels and 5 pixels
// wide, its text starts 4 pixels in, the map 63), at the top of row 0
const MAP_LEFT = 59;
const CHAR_WIDTH = 9;
const CHAR_HEIGHT = 13;
const MAP_WIDTH = 148;
const MAP_HEIGHT = 91;

const blank = (): Cell => ({ch: ' ', attr: '.'});
const isBlank = (row: Cell[]) => row.every(c => c.ch === ' ' && c.attr === '.');

/**
 * A row of `width` cells. Trailing normal blanks past the edge are dropped, as the harness's Screen does; a visible cell
 * there would be cut off, so it throws.
 */
function fit(row: Cell[] | undefined, width: number, where: string): Cell[] {
	const r = [...(row ?? [])];
	while (r.length > width && r[r.length - 1].ch === ' ' && r[r.length - 1].attr === '.') r.pop();
	if (r.length > width) {
		throw new Error(`Super NAV 5: ${where} is ${r.length} cells wide, more than ${width}: "${r.map(c => c.ch).join('')}"`);
	}
	return [...r, ...Array.from({length: width - r.length}, blank)];
}

/** A row past the first `max` with anything in it is not on the screen, so it throws. */
function checkRows(rows: Cell[][], max: number, where: string): void {
	const extra = rows.slice(max).find(row => !isBlank(row));
	if (extra) throw new Error(`Super NAV 5: ${where} has a row past its ${max}: "${extra.map(c => c.ch).join('')}"`);
}

/**
 * The 23x7 cells of Super NAV 5, read from the DOM the way the harness's SuperNav5.read reads its text, but with the
 * attributes of the cells: the left column (`.super-nav5-left-controls` without the message indicator and the range)
 * in columns 0-5 of rows 0-6, the message indicator (`msg` or blanks) and the range (`.super-nav5-mgs-range`) from
 * column 6 in rows 5 and 6, the right menu (`.super-nav5-right-controls-parent`, when open) in rows 0-3 from column 15
 * and the direct-to window (`.super-nav5-directto-window`, when open) in row 6 from column 17. Every other cell is the
 * map, blank here.
 */
function readSuperNav5(container: Element): Cell[][] {
	const left = visible(container, '.super-nav5-left-controls')!.cloneNode(true) as Element;
	const overlayEl = left.querySelector('.super-nav5-mgs-range');
	if (overlayEl === null) throw new Error('Super NAV 5: the left column has no message indicator and range');
	overlayEl.remove();
	const column = readRows(left);
	const overlay = readRows(overlayEl);
	checkRows(column, ROWS, 'the left column');
	checkRows(overlay, ROWS - SUPER_NAV5_OVERLAY_ROW, 'the message indicator and range');
	const width = COLUMNS - SUPER_NAV5_COLUMN;
	const grid = Array.from({length: ROWS}, (_, r) => {
		const over = r >= SUPER_NAV5_OVERLAY_ROW ? overlay[r - SUPER_NAV5_OVERLAY_ROW] : [];
		return [...fit(column[r], SUPER_NAV5_COLUMN, `left column row ${r}`), ...fit(over, width, `row ${r} over the map`)];
	});
	// The menu and the window are opaque: they replace what lies beneath, which is the map (and blank cells of the overlay)
	const menu = visible(container, '.super-nav5-right-controls-parent');
	if (menu !== null) {
		const rows = readRows(menu);
		checkRows(rows, MENU.rows, 'the right menu');
		for (let r = 0; r < MENU.rows; r++) {
			grid[MENU.row + r].splice(MENU.column, MENU.width, ...fit(rows[r], MENU.width, `menu row ${r}`));
		}
	}
	const scan = visible(container, '.super-nav5-directto-window');
	if (scan !== null) {
		const rows = readRows(scan);
		checkRows(rows, 1, 'the direct-to window');
		const cells = fit(rows[0], WINDOW.width, 'the direct-to window');
		const taken = grid[WINDOW.row].slice(WINDOW.column, WINDOW.column + WINDOW.width);
		if (!isBlank(taken)) {
			throw new Error(`Super NAV 5: the direct-to window covers text over the map: "${taken.map(c => c.ch).join('')}"`);
		}
		grid[WINDOW.row].splice(WINDOW.column, WINDOW.width, ...cells);
	}
	return grid;
}

/** The map pixels the cells of a rectangle of the text grid cover, one more pixel row below `extra` for a border line */
function cellsToPixels(row: number, column: number, rows: number, width: number, extra = 0): PixelRect {
	const x = CHAR_WIDTH * column - MAP_LEFT;
	return {x, y: CHAR_HEIGHT * row, w: Math.min(CHAR_WIDTH * width, MAP_WIDTH - x), h: Math.min(CHAR_HEIGHT * rows + extra, MAP_HEIGHT - CHAR_HEIGHT * row)};
}

/**
 * The map pixels of Super NAV 5 that its opaque menu and window cover, from the merged cells: the menu is open when
 * any cell of its rectangle is not a normal blank (it always shows its labels), the window when any cell of its row
 * is not (it is inverse even when empty). The menu's bottom border line is one pixel row below its four rows.
 */
export function coverOf(cells: Cell[][]): PixelRect[] {
	const used = (row: number, column: number, rows: number, width: number) => Array.from({length: rows}, (_, r) =>
		cells[row + r].slice(column, column + width)).some(cs => !isBlank(cs));
	const covered: PixelRect[] = [];
	if (used(MENU.row, MENU.column, MENU.rows, MENU.width)) covered.push(cellsToPixels(MENU.row, MENU.column, MENU.rows, MENU.width, 1));
	if (used(WINDOW.row, WINDOW.column, 1, WINDOW.width)) covered.push(cellsToPixels(WINDOW.row, WINDOW.column, 1, WINDOW.width));
	return covered;
}

/** Whether the pixel is under one of the rectangles. */
export function isCovered(rects: readonly PixelRect[], x: number, y: number): boolean {
	return rects.some(r => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
}

/** The 23x7 cells of the screen, text and mask together. */
function readGrid(container: Element, layout: Layout): Cell[][] {
	if (layout === 'super-nav-5') return readSuperNav5(container);
	const screen = Screen.read();
	const mask = screen.mask().split('\n');
	return screen.text().split('\n').map((row, r) => Array.from(row).map((ch, c) => ({ch, attr: mask[r][c] as Attr})));
}

/**
 * Reads the screen of the booted unit over one blink cycle (four display ticks) and merges the reads, so that a flashing
 * cell is marked whatever the phase was at the start.
 * @param recorder the recorder of the map elements, which the caller starts before the page opens and stops after the
 * capture: a map does not always redraw on every tick (APT 3 draws once, when its page opens), so recording only
 * during the cycle could miss its last frame. Without one, `elements` is empty.
 * @throws Error on a cell that cannot be merged (see mergeCycle) and on Super NAV 5 text that does not fit its places
 */
export async function captureScreen(recorder?: MapRecorder): Promise<CapturedScreen> {
	const container = document.getElementById('pageContainer');
	if (container === null) throw new Error('no #pageContainer; has the unit booted?');
	const states: Inspection[] = [];
	const reads = await blinkCycle(() => {
		const state = inspect(container);
		states.push(state);
		return readGrid(container, state.layout);
	});
	checkStable(states);
	const last = states[states.length - 1];
	const cells = mergeCycle(reads);
	const covered = last.layout === 'super-nav-5' ? coverOf(cells) : [];
	const elements: CapturedScreen['elements'] = {};
	for (const side of MAP_SIDES) {
		const canvas = last.canvases[side];
		if (canvas === undefined || recorder === undefined) continue;
		// The pilot cannot see an element that the menu or window hides entirely, so it needs no field
		elements[side] = recorder.elementsOf(canvas)
			.filter(e => side !== 'F' || !e.pixels.every(([x, y]) => isCovered(covered, x, y)));
	}
	return {...last, elements, covered, cells};
}
