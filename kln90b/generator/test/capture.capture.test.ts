import {describe, expect, it} from 'vitest';
import {bootUnit, settle} from '../../../vendor/kln90b/test/harness/boot';
import {canvasToAscii} from '../../../vendor/kln90b/test/harness/render/canvas';
import {captureScreen, readSuperNav5} from '../lib/capture.ts';

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

describe('readSuperNav5', () => {
	/** The DOM of Super NAV 5: a seven-row left column, the overlay (message indicator and range) and the window. */
	function dom(overlay: string, window?: string): Element {
		const root = document.createElement('div');
		root.innerHTML = `<div class="super-nav5-left-controls"><span>${['a', 'b', 'c', 'd', 'e', 'f', 'g'].join('<br>')}</span>` +
			`<span class="super-nav5-mgs-range"><span>   </span><br>${overlay}</span></div>` +
			(window === undefined ? '' : `<span class="super-nav5-directto-window inverted">${window}</span>`);
		return root;
	}

	it('puts the window into row 6 from column 17', () => {
		const grid = readSuperNav5(dom('40', 'KSEA  '));
		expect(grid[6].map(c => c.ch).join('')).toBe('g     40         KSEA  ');
		expect(grid[6].slice(17).map(c => c.attr).join('')).toBe('IIIIII');
	});

	it('throws when the overlay holds text where the window goes, rather than overwriting it', () => {
		const text = ' '.repeat(11) + 'Z';
		expect(() => readSuperNav5(dom(text, 'KSEA  '))).toThrow('the direct-to window covers text over the map: "Z     "');
		// Without a window the same overlay is read as it is
		expect(readSuperNav5(dom(text))[6][17].ch).toBe('Z');
	});
});
