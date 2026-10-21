import {describe, expect, it} from 'vitest';
import {GeoPoint, MapProjection, UnitType} from '@microsoft/msfs-sdk';
import {bootUnit, settle} from '../../../vendor/kln90b/test/harness/boot';
import {canvasToAscii, downsampled} from '../../../vendor/kln90b/test/harness/render/canvas';
import {pointFrom} from '../../../vendor/kln90b/test/harness/flight/geo';
import {CanvasDrawContext, CoordinateCanvasDrawContext} from '../../../vendor/kln90b/kln90b/controls/Canvas';
import {adjustCourseIndicator} from '../api.ts';
import {captureScreen} from '../lib/capture.ts';
import {blocksOf, checkCoverage, FrameElements, recordMapElements, type MapElement} from '../lib/mapElements.ts';
import {facilitiesOf, loadExtract, place, pointNamesOf} from '../lib/navdata.ts';

/** NAV 5 20 NM south of KSEA with a Direct To KSEA, as screens/nav-5-ksea shows it. */
async function nav5DirectTo() {
	const unit = await bootUnit({position: pointFrom(place('KSEA'), 180, 20), defaultNavdata: false, facilities: facilitiesOf(loadExtract())});
	await settle(unit);
	await unit.panel.directTo('KSEA');
	await adjustCourseIndicator(unit);
	await unit.panel.selectPage('L', 'NAV 5');
	return unit;
}

const key = ([x, y]: [number, number]) => `${x},${y}`;

describe('the map elements of NAV 5', () => {
	it('are the drawing calls of the last frame, named after the places of the extract', async () => {
		await nav5DirectTo();
		const {elements} = await captureScreen(pointNamesOf(loadExtract()));
		const draws = elements.L!.map(e => e.draw);
		expect(draws).toContain('icon % KSEA');
		expect(draws.filter(d => /^icon \$ -?\d+\.\d{4},-?\d+\.\d{4}$/.test(d))).toHaveLength(1);
		// The Direct To from where the unit was to KSEA: the line and its arrowhead are one element
		expect(draws.filter(d => /^arrow -?\d+\.\d{4},-?\d+\.\d{4} KSEA$/.test(d))).toHaveLength(1);
		expect(elements.R).toBeUndefined();
	});

	it('own every lit pixel of the map once, and nothing else', async () => {
		await nav5DirectTo();
		const {canvases, elements} = await captureScreen(pointNamesOf(loadExtract()));
		const all = elements.L!.flatMap(e => e.pixels.map(key));
		expect(new Set(all).size).toBe(all.length);
		const blocks = downsampled(canvasToAscii(canvases.L!));
		const lit = blocks.split('\n').flatMap((row, y) => Array.from(row).flatMap((c, x) => c === '#' ? [key([x, y])] : []));
		expect(lit.length).toBeGreaterThan(0);
		expect([...all].sort()).toEqual([...lit].sort());
		expect(blocksOf(99, 78, elements.L!)).toBe(blocks);
		// The aircraft symbol is at the center of the map (49, 39)
		const aircraft = elements.L!.find(e => e.draw.startsWith('icon $'))!;
		expect(aircraft.pixels.every(([x, y]) => Math.abs(x - 49) <= 4 && Math.abs(y - 39) <= 4)).toBe(true);
	});

	it('writes a point that is no place of the names as lat,lon', async () => {
		await nav5DirectTo();
		const {elements} = await captureScreen();
		expect(elements.L!.map(e => e.draw)).toContain(`icon % ${place('KSEA').lat.toFixed(4)},${place('KSEA').lon.toFixed(4)}`);
	});
});

/** A canvas of the half page map (99 x 78 map pixels) and its pixel context. */
function halfPage() {
	const canvas = document.createElement('canvas');
	canvas.width = 396;
	canvas.height = 312;
	const ctx = canvas.getContext('2d')!;
	ctx.fillStyle = '#00D109';
	ctx.font = '28px KLN90BMap';
	ctx.textBaseline = 'top';
	return {canvas, ctx, pixel: new CanvasDrawContext(ctx, 99, 78)};
}

describe('recordMapElements', () => {
	it('records the outermost call only and keeps the frame that fill ended', () => {
		const {canvas, pixel} = halfPage();
		const recorder = recordMapElements();
		try {
			pixel.drawLine(10, 10, 20, 10);
			pixel.drawArrow(10, 10, 20, 10);
			pixel.drawIcon(50, 40, '$');
			expect(recorder.elementsOf(canvas)).toEqual([]);
			pixel.fill();
			// A frame that has not ended yet does not count
			pixel.drawLine(0, 70, 90, 70);
		} finally {
			recorder.stop();
		}
		const elements = recorder.elementsOf(canvas);
		expect(elements.map(e => e.draw)).toEqual(['plain at 10,10 20,10', 'arrowhead at 10,10 20,10', 'icon $ at 50,40']);
		expect(elements[0].pixels).toEqual(Array.from({length: 10}, (_, i) => [10 + i, 10]));
	});

	it('names the points of a coordinate call and describes every kind of call', () => {
		const {canvas, pixel} = halfPage();
		// North up, 20 NM from the center to the top, as NAV 5 sets it
		const projection = new MapProjection(99, 78);
		projection.set({target: new GeoPoint(47.45, -122.31), range: UnitType.NMILE.convertTo(20, UnitType.GA_RADIAN) * 2, rotation: 0});
		const geo = new CoordinateCanvasDrawContext(pixel, projection);
		const center = {lat: 47.45, lon: -122.31};
		const north = {lat: 47.6, lon: -122.31};
		const recorder = recordMapElements([{name: 'KSEA', lat: 47.45, lon: -122.31}, {name: 'SEA', lat: 47.45, lon: -122.31}]);
		try {
			geo.drawFlightplanArrow(center, north);
			geo.drawIcon(center, '%');
			geo.drawLabel(center, 'KSEA');
			geo.drawLine(new GeoPoint(47.3, -122.5), new GeoPoint(47.3, -122.1));
			geo.fill();
		} finally {
			recorder.stop();
		}
		expect(recorder.elementsOf(canvas).map(e => e.draw)).toEqual([
			'arrow KSEA 47.6000,-122.3100', 'icon % KSEA', 'label KSEA KSEA', 'plain 47.3000,-122.5000 47.3000,-122.1000',
		]);
	});

	it('draws as before and stops recording', () => {
		const {canvas, pixel} = halfPage();
		const recorder = recordMapElements();
		pixel.drawLine(10, 10, 20, 10);
		pixel.fill();
		recorder.stop();
		pixel.drawIcon(50, 40, '$');
		pixel.fill();
		expect(recorder.elementsOf(canvas).map(e => e.draw)).toEqual(['plain at 10,10 20,10']);
		expect(downsampled(canvasToAscii(canvas)).split('\n')[10].slice(10, 20)).toBe('#'.repeat(10));
		expect(CanvasDrawContext.prototype.drawLine.name).toBe('drawLine');
	});

	it('drops an element that lit nothing', () => {
		const {canvas, pixel} = halfPage();
		const recorder = recordMapElements();
		try {
			pixel.drawLine(200, 10, 300, 10);
			pixel.drawIcon(50, 40, '$');
			pixel.fill();
		} finally {
			recorder.stop();
		}
		expect(recorder.elementsOf(canvas).map(e => e.draw)).toEqual(['icon $ at 50,40']);
	});
});

const map = (...rows: string[]) => rows.join('\n') + '\n';

describe('FrameElements', () => {
	it('gives a pixel to the element that turned it on and takes it from its owner when it turns off', () => {
		const frame = new FrameElements(3, 2);
		frame.add('a', map('...', '...'), map('##.', '...'));
		frame.add('b', map('##.', '...'), map('###', '..#'));
		frame.add('c', map('###', '..#'), map('#.#', '...'));
		expect(frame.finish()).toEqual<MapElement[]>([{draw: 'a', pixels: [[0, 0]]}, {draw: 'b', pixels: [[2, 0]]}]);
	});

	it('numbers repeated descriptions after leaving out the elements without pixels', () => {
		const frame = new FrameElements(3, 1);
		frame.add('x', map('...'), map('...'));
		frame.add('x', map('...'), map('#..'));
		frame.add('y', map('#..'), map('##.'));
		frame.add('x', map('##.'), map('###'));
		expect(frame.finish().map(e => e.draw)).toEqual(['x', 'y', 'x #2']);
	});

	it('rejects a read of another size', () => {
		expect(() => new FrameElements(3, 1).add('x', map('....'), map('...'))).toThrow('3 x 1');
	});
});

describe('checkCoverage', () => {
	const elements: MapElement[] = [{draw: 'a', pixels: [[0, 0]]}, {draw: 'b', pixels: [[2, 1]]}];

	it('accepts elements that light exactly the pixels of the map', () => {
		expect(checkCoverage(map('#..', '..#'), elements)).toBeUndefined();
	});

	it('names a lit pixel no element lit and a dark pixel an element lit', () => {
		expect(() => checkCoverage(map('#.#', '..#'), elements)).toThrow('the map pixel 2,0 is lit');
		expect(() => checkCoverage(map('#..', '...'), elements)).toThrow('the map pixel 2,1 is dark');
	});
});
