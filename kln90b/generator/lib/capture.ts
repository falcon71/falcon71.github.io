import type {Cell} from '../../../vendor/kln90b/test/harness/render/screen';
import {Screen} from '../../../vendor/kln90b/test/harness/render/screen';
import {blinkCycle} from '../../../vendor/kln90b/test/harness/render/blink';

export interface CapturedScreen {
	layout: 'split' | 'full';
	/** False only for a full page without status line (the welcome page) */
	status: boolean;
	cells: Cell[][];
	/** The map canvases of the visible half pages, as they are at the last tick of the cycle */
	canvases: {L?: HTMLCanvasElement; R?: HTMLCanvasElement};
}

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

type Inspection = Omit<CapturedScreen, 'cells'>;

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

/** What the unit shows now: the layout, whether there is a status line and the map canvases of the half pages. */
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
		if (full.querySelector('.super-nav5-left-controls') !== null) throw new Error('Super NAV 5 is not supported yet');
		return {layout: 'full', status, canvases: {}};
	}
	throw new Error('the unit shows no page: neither both half pages nor a full page are visible');
}

/** The 23x7 cells of the screen, text and mask together. */
function readGrid(): Cell[][] {
	const screen = Screen.read();
	const mask = screen.mask().split('\n');
	return screen.text().split('\n').map((row, r) => Array.from(row).map((ch, c) => ({ch, attr: mask[r][c] as Attr})));
}

/**
 * Reads the screen of the booted unit over one blink cycle (four display ticks) and merges the reads, so that a flashing
 * cell is marked whatever the phase was at the start.
 * @throws Error on Super NAV 5, which is a map and not a text grid, and on a cell that cannot be merged (see mergeCycle)
 */
export async function captureScreen(): Promise<CapturedScreen> {
	const container = document.getElementById('pageContainer');
	if (container === null) throw new Error('no #pageContainer; has the unit booted?');
	const states: Inspection[] = [];
	const reads = await blinkCycle(() => {
		states.push(inspect(container));
		return readGrid();
	});
	checkStable(states);
	return {...states[states.length - 1], cells: mergeCycle(reads)};
}
