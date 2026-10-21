// What the maps of NAV 5 and APT 3 draw, element by element. The unit draws a map through the two drawing contexts of
// Canvas.tsx; each outermost drawing call is one element, described in words and with the map pixels it lit, so that
// every element can be a field of its screen.
import {CanvasDrawContext, CoordinateCanvasDrawContext} from '../../../vendor/kln90b/kln90b/controls/Canvas';
import {ZOOM_FACTOR} from '../../../vendor/kln90b/kln90b/data/Constants';
import {canvasToAscii, downsampled} from '../../../vendor/kln90b/test/harness/render/canvas';

/** One drawing call of a map: its description (`icon % KSEA`) and the map pixels it lit, as [x, y] in row order. */
export interface MapElement {
	draw: string;
	pixels: [number, number][];
}

/** A place a point of a drawing call is named after when it has its coordinates. */
export interface NamedPoint {
	name: string;
	lat: number;
	lon: number;
}

interface LatLon {
	lat: number;
	lon: number;
}

const SAME_DEGREES = 1e-6;

/**
 * The elements of one frame of a map, from the map pixels before and after each element. A pixel that turns on belongs
 * to the element that turned it on; a pixel that turns off is taken from whichever element owned it.
 */
export class FrameElements {
	private readonly owner: Int32Array;
	private readonly draws: string[] = [];

	/** @param width the size of the map in map pixels */
	constructor(private readonly width: number, private readonly height: number) {
		this.owner = new Int32Array(width * height).fill(-1);
	}

	/**
	 * @param before the map before the element, as rows of `#` and `.` (the output of `downsampled(canvasToAscii(...))`)
	 * @param after the map after it
	 */
	add(draw: string, before: string, after: string): void {
		const [was, is] = [this.pixelsOf(before), this.pixelsOf(after)];
		const index = this.draws.push(draw) - 1;
		for (let i = 0; i < is.length; i++) {
			if (was[i] === is[i]) continue;
			this.owner[i] = is[i] === '#' ? index : -1;
		}
	}

	/**
	 * The elements in drawing order. An element without pixels is not visible and left out; a description that repeats
	 * gets ` #2`, ` #3`, so that the descriptions of a map are unique.
	 */
	finish(): MapElement[] {
		const pixels: [number, number][][] = this.draws.map(() => []);
		this.owner.forEach((element, i) => {
			if (element >= 0) pixels[element].push([i % this.width, Math.floor(i / this.width)]);
		});
		const seen = new Map<string, number>();
		const elements: MapElement[] = [];
		this.draws.forEach((draw, i) => {
			if (pixels[i].length === 0) return;
			const n = (seen.get(draw) ?? 0) + 1;
			seen.set(draw, n);
			elements.push({draw: n === 1 ? draw : `${draw} #${n}`, pixels: pixels[i]});
		});
		return elements;
	}

	private pixelsOf(blocks: string): string {
		const rows = blocks.replace(/\n$/, '').split('\n');
		if (rows.length !== this.height || rows.some(row => row.length !== this.width)) {
			throw new Error(`a map read is not ${this.width} x ${this.height} pixels`);
		}
		return rows.join('');
	}
}

/** The map pixels the elements lit, as rows of `#` and `.` like `downsampled`. */
export function blocksOf(width: number, height: number, elements: MapElement[]): string {
	const rows = Array.from({length: height}, () => Array<string>(width).fill('.'));
	for (const e of elements) for (const [x, y] of e.pixels) rows[y][x] = '#';
	return rows.map(row => row.join('')).join('\n') + '\n';
}

/**
 * Checks that the elements account for exactly the pixels of the map: a map that was drawn outside the recorded
 * calls, or cleared after its last frame, would otherwise get explanations for what it does not show.
 * @param blocks the map as `downsampled(canvasToAscii(canvas))` gives it
 * @throws Error naming the first pixel that differs
 */
export function checkCoverage(blocks: string, elements: MapElement[]): void {
	const rows = blocks.replace(/\n$/, '').split('\n');
	const drawn = blocksOf(rows[0].length, rows.length, elements).replace(/\n$/, '').split('\n');
	for (let y = 0; y < rows.length; y++) {
		const x = Array.from(rows[y]).findIndex((c, i) => c !== drawn[y][i]);
		if (x < 0) continue;
		throw new Error(rows[y][x] === '#'
			? `the map pixel ${x},${y} is lit, but no drawing call of the last frame lit it`
			: `the map pixel ${x},${y} is dark, but a drawing call of the last frame lit it`);
	}
}

type Describe = (name: (p: LatLon) => string, args: any[]) => string;

const geoPoints = (kind: string): Describe => (name, [from, to]) => `${kind} ${name(from)} ${name(to)}`;

// The public methods of the two contexts that draw, and how a call is described: the kind, then its arguments
const GEO_DRAWING: Record<string, Describe> = {
	drawLine: geoPoints('plain'),
	drawFlightplanLine: geoPoints('line'),
	drawFlightplanArrow: geoPoints('arrow'),
	drawArc: (name, [, from, to, dashed]) => `arc ${name(from)} ${name(to)}${dashed ? ' dashed' : ''}`,
	drawArcWithArrow: (name, [, from, to]) => `arc-arrow ${name(from)} ${name(to)}`,
	drawLabel: (name, [coord, text]) => `label ${text} ${name(coord)}`,
	drawIcon: (name, [coord, text]) => `icon ${text} ${name(coord)}`,
};
const PIXEL_DRAWING: Record<string, Describe> = {
	drawLine: (_, [x0, y0, x1, y1, dash]) => `plain at ${x0},${y0} ${x1},${y1}${dash ? ' dashed' : ''}`,
	drawArrow: (_, [x0, y0, x1, y1]) => `arrowhead at ${x0},${y0} ${x1},${y1}`,
	drawLabel: (_, [x, y, text]) => `label ${text} at ${x},${y}`,
	drawIcon: (_, [x, y, text]) => `icon ${text} at ${x},${y}`,
};
// The method that ends a frame (Nav5Page and Apt3MapPage call it after the last element), and the methods that are
// helpers of the drawing calls
const FRAME = 'fill';
const PIXEL_HELPERS = ['plot', 'plotLineLow', 'plotLineHigh', 'getTextPositionScore'];

/** The rendering context of a drawing context, and the size of its map in map pixels. */
function targetOf(context: object): {ctx: CanvasRenderingContext2D; width: number; height: number} {
	const pixel = (context instanceof CoordinateCanvasDrawContext ? (context as any).ctx : context) as CanvasDrawContext;
	return {ctx: (pixel as any).ctx, width: pixel.width, height: pixel.height};
}

function readBlocks(ctx: CanvasRenderingContext2D, width: number, height: number): string {
	const canvas = {width: width * ZOOM_FACTOR, height: height * ZOOM_FACTOR, getContext: () => ctx};
	return downsampled(canvasToAscii(canvas as unknown as HTMLCanvasElement));
}

export interface MapRecorder {
	/** The elements of the last frame drawn on a canvas while recording; none when no frame was finished. */
	elementsOf(canvas: HTMLCanvasElement): MapElement[];

	/** Stops recording; the drawing contexts draw as before. */
	stop(): void;
}

/**
 * Records the drawing calls of the maps until `stop`. The calls still draw, so the canvases are unchanged. Only the
 * outermost call is an element: a call of CoordinateCanvasDrawContext that draws through CanvasDrawContext is one
 * element. `fill()` ends a frame; the elements of a frame are kept once it ends, and the next call starts a new one.
 *
 * Points are named after the first entry of `names` they equal to 1e-6 degrees and written as `lat,lon` with 4
 * decimals otherwise; a call of CanvasDrawContext gives its pixel position (`icon $ at 49,58`).
 * @throws Error when a drawing context has a method this module does not know, which a new kln90b may have added
 */
export function recordMapElements(names: NamedPoint[] = []): MapRecorder {
	const name = (p: LatLon): string => {
		const found = names.find(n => Math.abs(p.lat - n.lat) < SAME_DEGREES && Math.abs(p.lon - n.lon) < SAME_DEGREES);
		return found?.name ?? `${p.lat.toFixed(4)},${p.lon.toFixed(4)}`;
	};
	const frames = new Map<object, {current: FrameElements | null; last: MapElement[] | null}>();
	const restore: (() => void)[] = [];
	let depth = 0;

	const frameOf = (ctx: object) => {
		let f = frames.get(ctx);
		if (f === undefined) frames.set(ctx, f = {current: null, last: null});
		return f;
	};

	const wrap = (proto: any, method: string, outermost: (self: object, args: any[], call: () => unknown) => unknown) => {
		const original = proto[method];
		proto[method] = function (this: object, ...args: any[]) {
			const call = () => original.apply(this, args);
			if (depth > 0) return call();
			depth++;
			try {
				return outermost(this, args, call);
			} finally {
				depth--;
			}
		};
		restore.push(() => proto[method] = original);
	};

	const install = (proto: any, drawing: Record<string, Describe>, helpers: string[]) => {
		const own = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor' && typeof proto[m] === 'function');
		const unknown = own.filter(m => !(m in drawing) && m !== FRAME && !helpers.includes(m));
		if (unknown.length > 0) {
			throw new Error(`${proto.constructor.name} has the methods ${unknown.join(', ')}, which mapElements.ts does not know; ` +
				'say there whether they draw');
		}
		for (const [method, describe] of Object.entries(drawing)) {
			wrap(proto, method, (self, args, call) => {
				const {ctx, width, height} = targetOf(self);
				const before = readBlocks(ctx, width, height);
				const result = call();
				const f = frameOf(ctx);
				f.current ??= new FrameElements(width, height);
				f.current.add(describe(name, args), before, readBlocks(ctx, width, height));
				return result;
			});
		}
		wrap(proto, FRAME, (self, _, call) => {
			const result = call();
			const f = frameOf(targetOf(self).ctx);
			f.last = f.current?.finish() ?? [];
			f.current = null;
			return result;
		});
	};

	try {
		install(CoordinateCanvasDrawContext.prototype, GEO_DRAWING, []);
		install(CanvasDrawContext.prototype, PIXEL_DRAWING, PIXEL_HELPERS);
	} catch (e) {
		for (const r of restore.reverse()) r();
		throw e;
	}

	return {
		elementsOf: canvas => frames.get(canvas.getContext('2d') as object)?.last ?? [],
		stop: () => {
			for (const r of restore.splice(0).reverse()) r();
		},
	};
}
