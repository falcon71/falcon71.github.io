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
	/** The elements of the last frame each canvas finished while the recorder ran, in drawing order */
	elements: Partial<Record<MapSide, MapElement[]>>;
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

type Inspection = Omit<CapturedScreen, 'cells' | 'elements'>;

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
		if (visible(full, '.super-nav5-right-controls-parent') !== null || visible(full, '.super-nav5-directto-window') !== null) {
			throw new Error('Super NAV 5 with the right menu or the direct-to window is not supported yet');
		}
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
 * column 6 in rows 5 and 6. Every other cell is the map, blank here.
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
	return Array.from({length: ROWS}, (_, r) => {
		const over = r >= SUPER_NAV5_OVERLAY_ROW ? overlay[r - SUPER_NAV5_OVERLAY_ROW] : [];
		return [...fit(column[r], SUPER_NAV5_COLUMN, `left column row ${r}`), ...fit(over, width, `row ${r} over the map`)];
	});
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
 * @throws Error on Super NAV 5 with its right menu or its direct-to window, and on a cell that cannot be merged (see
 * mergeCycle)
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
	const elements: CapturedScreen['elements'] = {};
	for (const side of MAP_SIDES) {
		const canvas = last.canvases[side];
		if (canvas !== undefined && recorder !== undefined) elements[side] = recorder.elementsOf(canvas);
	}
	return {...last, elements, cells: mergeCycle(reads)};
}
