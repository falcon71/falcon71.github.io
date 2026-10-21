import {expect, it} from 'vitest';
import {bootUnit, settle} from '../../../vendor/kln90b/test/harness/boot';
import {canvasToAscii} from '../../../vendor/kln90b/test/harness/render/canvas';
import {captureScreen} from '../lib/capture.ts';

async function bootAt(page: string) {
	const unit = await bootUnit({position: {lat: 47.45, lon: -122.31}});
	await settle(unit);
	await unit.panel.selectPage('L', page);
	return unit;
}

it('hands over the canvas of the map half and none for a text half', async () => {
	await bootAt('NAV 5');
	const {canvases, layout} = await captureScreen();
	expect(layout).toBe('split');
	expect(canvases.R).toBeUndefined();
	const map = canvases.L!;
	// One block of the map is 4 canvas pixels, so the half page map is 99 x 78 blocks
	expect([map.width, map.height]).toEqual([396, 312]);
	// The aircraft symbol is always drawn, in the middle of the map
	const lit = canvasToAscii(map).split('\n').flatMap((row, y) => Array.from(row, (c, x) => (c === '#' ? [x, y] : null)));
	expect(lit.some(p => p !== null && Math.abs(p[0] - 198) < 16 && Math.abs(p[1] - 156) < 16)).toBe(true);
});

it('hands over no canvas on a page without a map', async () => {
	await bootAt('NAV 1');
	expect((await captureScreen()).canvases).toEqual({L: undefined, R: undefined});
});
