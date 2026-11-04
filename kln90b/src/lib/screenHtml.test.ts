import {describe, expect, it} from 'vitest';
import type {CellAttr, FieldPart, ScreenCapture} from './screenFile.ts';
import {mapToSvg} from '../../generator/lib/mapSvg.ts';
import {blocksFromCapture, blocksFromMarkup, excerptWindow, fieldsOnRows, onlyFieldDocs, parseRows, screenHtml} from './screenHtml.ts';
import {loadCapture} from './screens.ts';

// The NAV 1 markup of pages/nav.mdx, and the stage HTML that KlnScreen.astro built from it before the code moved here
const NAV_1_LEFT = `
{from:KPDX }{arrow:›}{to:KSEA }
{cdi:ηηηΚΑθηηηηη}
{dis:DIS  45.2nm}
{gs:GS    123kt}
{ete:ETE   0:21}
{brg:BRG    012°}
`;
const NAV_1_IDS = ['from', 'arrow', 'to', 'cdi', 'dis', 'gs', 'ete', 'brg', 'page'];
const NAV_1_HTML = '<div class="kln-half kln-half-left"><span class="kln-row"><span class="kln-field" tabindex="0" data-field="from">KPDX </span><span class="kln-field" tabindex="0" data-field="arrow">›</span><span class="kln-field" tabindex="0" data-field="to">KSEA </span></span><span class="kln-row"><span class="kln-field" tabindex="0" data-field="cdi">ηηηΚΑθηηηηη</span></span><span class="kln-row"><span class="kln-field" tabindex="0" data-field="dis">DIS  45.2nm</span></span><span class="kln-row"><span class="kln-field" tabindex="0" data-field="gs">GS    123kt</span></span><span class="kln-row"><span class="kln-field" tabindex="0" data-field="ete">ETE   0:21</span> </span><span class="kln-row"><span class="kln-field" tabindex="0" data-field="brg">BRG    012°</span></span></div><div class="kln-half kln-half-right"></div><div class="kln-status"><span class="kln-row"><span class="kln-field" tabindex="0" data-field="page">NAV 1</span>                  </span></div>';

// The stage HTML of the split screen of the test "a split screen", as the code gave it before Super NAV 5
const SPLIT_HTML = '<div class="kln-map kln-map-left" role="group" aria-label="Map"><svg viewBox="0 0 99 78"><g class="kln-field" tabindex="0" role="img" data-field="leg" data-draw="icon $" data-box="1 2 3 4"><rect x="1" y="2" width="3" height="4" fill="transparent"/><path d="M1 2h1v1h-1z"/></g></svg></div><div class="kln-map kln-map-right" aria-hidden="true"><svg viewBox="0 0 99 78"><g data-field="runway" data-draw="icon $" data-box="1 2 3 4"><path d="M1 2h1v1h-1z"/></g></svg></div><div class="kln-half kln-half-left"><span class="kln-row"><span class="kln-inv kln-flash">A</span>          </span><span class="kln-row">           </span><span class="kln-row"><span class="kln-field" tabindex="0" data-field="dis">DIS  45.2nm</span></span><span class="kln-row">           </span><span class="kln-row">           </span><span class="kln-row">           </span></div><div class="kln-half kln-half-right"><span class="kln-row"><span class="kln-field" tabindex="0" data-field="ident">KSEA</span>       </span><span class="kln-row">           </span><span class="kln-row">           </span><span class="kln-row">           </span><span class="kln-row">           </span><span class="kln-row">           </span></div><div class="kln-status"><span class="kln-row"><span class="kln-field" tabindex="0" data-field="page">NAV 5</span>      GPS    APT 3</span></div>';

const ROWS = 7;
const COLUMNS = 23;

/** A capture of blanks; the tests write into it. */
function capture(over: Partial<ScreenCapture> = {}, rows: Record<number, string> = {}): ScreenCapture {
	const text = Array.from({length: ROWS}, (_, row) => (rows[row] ?? '').padEnd(COLUMNS));
	const mask: CellAttr[][] = Array.from({length: ROWS}, () => Array.from({length: COLUMNS}, () => '.' as CellAttr));
	return {
		title: 'Test page', show: 'both', layout: 'split', status: true,
		text, mask, fields: new Map<string, FieldPart[]>(), mapFields: new Map(), maps: [], ...over,
	};
}

describe('blocksFromMarkup', () => {
	it('gives the HTML the component built before the code moved', () => {
		const blocks = blocksFromMarkup({left: NAV_1_LEFT, status: '{page:NAV 1}'}, 'nav-1');
		expect(blocks.crop).toBe('left');
		expect(screenHtml(blocks, new Set(NAV_1_IDS))).toBe(NAV_1_HTML);
	});

	it('names the screen when a row is too wide', () => {
		expect(() => blocksFromMarkup({left: '{a:123456789012}'}, 'nav-1')).toThrow(/KlnScreen nav-1: left row 1 is 12 characters/);
	});

	it('leaves a field without explanation as plain text', () => {
		const blocks = blocksFromMarkup({left: '{dis:DIS}'}, 'x');
		expect(screenHtml(blocks, new Set())).toContain('<span class="kln-row">DIS        </span>');
	});
});

describe('blocksFromCapture', () => {
	it('makes one segment of a field and marks its cells', () => {
		const c = capture({fields: new Map([['dis', [{row: 2, from: 0, to: 11}]]])}, {2: 'DIS  45.2nm'});
		const blocks = blocksFromCapture(c, new Set(['dis']));
		const left = blocks.blocks[0];
		expect(left.cls).toBe('kln-half kln-half-left');
		expect(left.rows[2]).toEqual([{text: 'DIS  45.2nm', field: 'dis', inverse: false, flash: false}]);
	});

	it('draws a flashing inverse cell as inverse and flashing, and the other flags alone', () => {
		const c = capture({}, {0: 'ABCD'});
		c.mask[0][0] = 'F';
		c.mask[0][1] = 'I';
		c.mask[0][2] = 'B';
		const row = blocksFromCapture(c, new Set()).blocks[0].rows[0];
		expect(row).toEqual([
			{text: 'A', field: undefined, inverse: true, flash: true},
			{text: 'B', field: undefined, inverse: true, flash: false},
			{text: 'C', field: undefined, inverse: false, flash: true},
			{text: 'D' + ' '.repeat(7), field: undefined, inverse: false, flash: false},
		]);
	});

	it('splits at the middle line and takes the right half from column 12', () => {
		const c = capture({}, {0: 'LEFT       |RIGHT      '});
		const {blocks} = blocksFromCapture(c, new Set());
		expect(blocks.map(b => b.cls)).toEqual(['kln-half kln-half-left', 'kln-half kln-half-right', 'kln-status']);
		expect(blocks[0].rows).toHaveLength(6);
		expect(blocks[0].rows[0].map(s => s.text).join('')).toBe('LEFT       ');
		expect(blocks[1].rows[0].map(s => s.text).join('')).toBe('RIGHT      ');
		expect(blocks[2].rows).toHaveLength(1);
	});

	it('keeps the field of a field part on the right half with its own columns', () => {
		const c = capture({fields: new Map([['ident', [{row: 0, from: 12, to: 16}]]])}, {0: '           |KSEA'});
		const right = blocksFromCapture(c, new Set(['ident'])).blocks[1];
		expect(right.rows[0][0]).toEqual({text: 'KSEA', field: 'ident', inverse: false, flash: false});
	});

	it('leaves a field without explanation plain and merges it with its neighbors', () => {
		const c = capture({fields: new Map([['dis', [{row: 0, from: 0, to: 3}]]])}, {0: 'DIS'});
		const row = blocksFromCapture(c, new Set()).blocks[0].rows[0];
		expect(row).toEqual([{text: 'DIS' + ' '.repeat(8), field: undefined, inverse: false, flash: false}]);
	});

	it('crops the status line of the left half to its first 5 columns', () => {
		const c = capture({show: 'left'}, {6: 'NAV 1X     GPS      MSG'});
		const {crop, blocks} = blocksFromCapture(c, new Set());
		expect(crop).toBe('left');
		const status = blocks[blocks.length - 1].rows[0].map(s => s.text).join('');
		expect(status).toBe('NAV 1' + ' '.repeat(18));
	});

	it('crops the status line of the right half to its last 5 columns', () => {
		const c = capture({show: 'right'}, {6: 'APT 1      GPS   XAPT 1'});
		const {crop, blocks} = blocksFromCapture(c, new Set());
		expect(crop).toBe('right');
		const status = blocks[blocks.length - 1].rows[0].map(s => s.text).join('');
		expect(status).toBe(' '.repeat(18) + 'APT 1');
	});

	it('shows the whole screen when both halves are shown', () => {
		expect(blocksFromCapture(capture(), new Set()).crop).toBeUndefined();
	});

	it('draws a full page as one block of 6 rows and the status line, or 7 rows without a status line', () => {
		const withStatus = blocksFromCapture(capture({layout: 'full'}), new Set()).blocks;
		expect(withStatus.map(b => [b.cls, b.rows.length])).toEqual([['kln-full', 6], ['kln-status', 1]]);
		const without = blocksFromCapture(capture({layout: 'full', status: false}), new Set()).blocks;
		expect(without.map(b => [b.cls, b.rows.length])).toEqual([['kln-full', 7]]);
	});
});

describe('screenHtml', () => {
	it('wraps a documented field in a focusable span and escapes the text', () => {
		const c = capture({fields: new Map([['a', [{row: 0, from: 0, to: 3}]]])}, {0: 'A<&'});
		const html = screenHtml(blocksFromCapture(c, new Set(['a'])), new Set(['a']));
		expect(html).toContain('<span class="kln-field" tabindex="0" data-field="a">A&lt;&amp;</span>');
	});

	it('gives a flashing inverse field both classes', () => {
		const c = capture({fields: new Map([['a', [{row: 0, from: 0, to: 1}]]])}, {0: 'A'});
		c.mask[0][0] = 'F';
		const html = screenHtml(blocksFromCapture(c, new Set(['a'])), new Set(['a']));
		expect(html).toContain('class="kln-inv kln-flash kln-field" tabindex="0" data-field="a">A</span>');
	});

	it('puts the map of a side before the blocks, so that the text is drawn over it', () => {
		const html = screenHtml(blocksFromCapture(capture({show: 'left'}), new Set()), new Set(), {L: '<svg>L</svg>'});
		expect(html.startsWith('<div class="kln-map kln-map-left" aria-hidden="true"><svg>L</svg></div><div class="kln-half kln-half-left">')).toBe(true);
		expect(html).not.toContain('kln-map-right');
	});

	it('puts a map on each side where both have one', () => {
		const html = screenHtml(blocksFromCapture(capture(), new Set()), new Set(), {L: '<svg>L</svg>', R: '<svg>R</svg>'});
		expect(html.indexOf('kln-map-left')).toBeLessThan(html.indexOf('kln-map-right'));
		expect(html.indexOf('kln-map-right')).toBeLessThan(html.indexOf('kln-half-left'));
	});

	it('draws no map without one', () => {
		expect(screenHtml(blocksFromCapture(capture(), new Set()), new Set())).not.toContain('kln-map');
	});
});

describe('map fields', () => {
	const SVG = [
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99 78" fill="currentColor">',
		'<g data-field="leg" data-draw="arrow 47.1,-122.3 KSEA" data-box="47 23 7 12">',
		'<path d="M50 23h1v1h-1z"/>',
		'</g>',
		'<g data-field="aircraft" data-draw="icon $ 47.1,-122.3" data-box="47 36 5 6">',
		'<path d="M49 36h1v1h-1z"/>',
		'</g>',
		'</svg>',
	].join('\n') + '\n';
	const html = (documented: string[]) => {
		const c = capture({show: 'left', maps: ['L'], mapFields: new Map([['leg', 'L'], ['aircraft', 'L']])}, {5: 'NAV 5'});
		return screenHtml(blocksFromCapture(c, new Set(documented)), new Set(documented), {L: SVG});
	};
	/** The `<g>` of a field, from its tag to its end */
	const groupOf = (out: string, field: string) => out.match(new RegExp(`<g [^>]*data-field="${field}"[^>]*>.*?</g>`, 's'))![0];

	it('makes a documented map element a field with a hit area of its box', () => {
		expect(groupOf(html(['leg']), 'leg')).toBe(
			'<g class="kln-field" tabindex="0" role="img" data-field="leg" data-draw="arrow 47.1,-122.3 KSEA" data-box="47 23 7 12">' +
			'<rect x="47" y="23" width="7" height="12" fill="transparent"/>\n<path d="M50 23h1v1h-1z"/>\n</g>');
	});

	it('leaves an element without explanation as it was drawn', () => {
		expect(groupOf(html(['leg']), 'aircraft')).toBe(
			'<g data-field="aircraft" data-draw="icon $ 47.1,-122.3" data-box="47 36 5 6">\n<path d="M49 36h1v1h-1z"/>\n</g>');
	});

	it('leaves every element plain when none is documented', () => {
		expect(html([])).not.toMatch(/kln-field|tabindex|<rect/);
	});

	it('does not hide a map with fields from assistive technology, and still hides one without', () => {
		expect(html(['leg'])).toContain('<div class="kln-map kln-map-left" role="group" aria-label="Map">');
		expect(html(['leg'])).not.toContain('aria-hidden');
		expect(html([])).toContain('<div class="kln-map kln-map-left" aria-hidden="true">');
	});

	describe('against the generator', () => {
		const withMap = (svg: string, documented: string[], mapFields: [string, 'L' | 'R'][], check = true) => {
			const c = capture({show: 'left', maps: ['L'], mapFields: new Map(mapFields)}, {5: 'NAV 5'});
			return screenHtml(blocksFromCapture(c, new Set(documented)), new Set(documented), {L: svg},
				check ? {screen: 'test-screen', mapFields: c.mapFields} : undefined);
		};

		it('makes the elements of the SVG the generator writes fields', () => {
			const svg = mapToSvg(99, 78, [
				{field: 'leg', draw: 'arrow 47.1,-122.3 "KSEA"', pixels: [[50, 23], [50, 24], [48, 25]]},
				{field: 'aircraft', draw: 'icon $ 47.1,-122.3', pixels: [[49, 36], [47, 39]]},
			]);
			const out = withMap(svg, ['leg', 'aircraft'], [['leg', 'L'], ['aircraft', 'L']]);
			expect(out).toContain('data-field="leg" data-draw="arrow 47.1,-122.3 &quot;KSEA&quot;" data-box="48 23 3 3"><rect x="48" y="23" width="3" height="3"');
			expect(out).toContain('data-field="aircraft" data-draw="icon $ 47.1,-122.3" data-box="47 36 3 4"><rect x="47" y="36" width="3" height="4"');
		});

		it('makes the elements of the committed map of NAV 5 fields', () => {
			const {capture: nav5, maps} = loadCapture('nav-5-ksea');
			const documented = new Set(nav5.mapFields.keys());
			const out = screenHtml(blocksFromCapture(nav5, documented), documented, maps, {screen: 'nav-5-ksea', mapFields: nav5.mapFields});
			for (const id of nav5.mapFields.keys()) expect(out).toMatch(new RegExp(`<g class="kln-field" tabindex="0" role="img" data-field="${id}"`));
		});

		it('names the screen and the element when a group is not in the form the generator writes', () => {
			const svg = '<svg><g data-box="1 2 3 4" data-field="leg"><path d="M1 2h1v1h-1z"/></g></svg>';
			expect(() => withMap(svg, ['leg'], [['leg', 'L']]))
				.toThrow("screen test-screen: map L has an element the site cannot read, the generator's format changed: <g data-box=\"1 2 3 4\" data-field=\"leg\">");
		});

		it('rejects an unreadable group of a field that is not documented as well', () => {
			expect(() => withMap('<svg><g data-field="leg" data-box="1.5 2 3 4"></g></svg>', [], [['leg', 'L']])).toThrow(/cannot read/);
		});

		it('names the screen and the field when a documented map field has no element in its map', () => {
			const svg = mapToSvg(99, 78, [{field: 'leg', draw: 'arrow', pixels: [[50, 23]]}]);
			expect(() => withMap(svg, ['leg', 'aircraft'], [['leg', 'L'], ['aircraft', 'L']]))
				.toThrow('screen test-screen: map L has no element of the map field aircraft');
		});

		it('does not ask for the element of an undocumented map field or of the other map', () => {
			const svg = mapToSvg(99, 78, [{field: 'leg', draw: 'arrow', pixels: [[50, 23]]}]);
			expect(() => withMap(svg, ['leg'], [['leg', 'L'], ['aircraft', 'L']])).not.toThrow();
			expect(() => withMap(svg, ['leg', 'runway'], [['leg', 'L'], ['runway', 'R']])).not.toThrow();
		});

		it('checks nothing about the fields without a check, but still reads every group', () => {
			const svg = mapToSvg(99, 78, [{field: 'leg', draw: 'arrow', pixels: [[50, 23]]}]);
			expect(() => withMap(svg, ['leg', 'aircraft'], [['leg', 'L'], ['aircraft', 'L']], false)).not.toThrow();
			expect(() => withMap('<svg><g data-field="x"></g></svg>', [], [], false)).toThrow(/^map L has an element/);
		});
	});

	it('draws the text layers after the map', () => {
		const out = html(['leg']);
		expect(out.indexOf('kln-map-left')).toBeLessThan(out.indexOf('kln-half-left'));
		expect(out.lastIndexOf('</svg>')).toBeLessThan(out.indexOf('kln-half-left'));
	});
});

describe('a split screen', () => {
	it('gives the HTML it gave before Super NAV 5', () => {
		const svg = (field: string) => `<svg viewBox="0 0 99 78"><g data-field="${field}" data-draw="icon $" data-box="1 2 3 4"><path d="M1 2h1v1h-1z"/></g></svg>`;
		const c = capture({
			fields: new Map([['dis', [{row: 2, from: 0, to: 11}]], ['ident', [{row: 0, from: 12, to: 16}]], ['page', [{row: 6, from: 0, to: 5}]]]),
			mapFields: new Map([['leg', 'L'], ['runway', 'R']]), maps: ['L', 'R'],
		}, {0: 'A          |KSEA', 2: 'DIS  45.2nm', 6: 'NAV 5      GPS    APT 3'});
		c.mask[0][0] = 'F';
		const documented = new Set(['dis', 'ident', 'page', 'leg']);
		const out = screenHtml(blocksFromCapture(c, documented), documented, {L: svg('leg'), R: svg('runway')}, {screen: 's', mapFields: c.mapFields});
		expect(out).toBe(SPLIT_HTML);
	});
});

describe('Super NAV 5', () => {
	// The left column in columns 0-5, the blank message indicator in row 5 and the range in row 6 from column 6
	const TEXT = {
		0: '20.0 È', 1: 'KSEA', 2: 'Ê-Ë', 3: ' 120 É', 4: 'Ð0:10', 5: 'Ó345°', 6: 'Ö345° 40',
	};
	const FIELDS = new Map([['ident', [{row: 1, from: 0, to: 4}]], ['field-3', [{row: 6, from: 0, to: 5}]], ['range', [{row: 6, from: 6, to: 8}]]]);
	const SVG = '<svg viewBox="0 0 148 91"><g data-field="map" data-draw="icon $" data-box="70 40 5 6"><path d="M70 40h1v1h-1z"/></g></svg>';
	const superNav5 = (over: Partial<ScreenCapture> = {}, rows: Record<number, string> = TEXT) =>
		capture({layout: 'super-nav-5', status: false, fields: FIELDS, mapFields: new Map([['map', 'F']]), maps: ['F'], ...over}, rows);
	const html = (documented: string[], c = superNav5()) =>
		screenHtml(blocksFromCapture(c, new Set(documented)), new Set(documented), {F: SVG}, {screen: 's', mapFields: c.mapFields});
	const text = (rows: {text: string}[][]) => rows.map(row => row.map(s => s.text).join(''));

	it('draws the left column and, over the map, the message indicator and the range, without status line', () => {
		const {crop, blocks} = blocksFromCapture(superNav5(), new Set());
		expect(crop).toBeUndefined();
		expect(blocks.map(b => b.cls)).toEqual(['kln-snav5-left', 'kln-snav5-overlay']);
		expect(text(blocks[0].rows)).toEqual(['20.0 È', 'KSEA  ', 'Ê-Ë   ', ' 120 É', 'Ð0:10 ', 'Ó345°', 'Ö345° '].map(r => r.padEnd(6)));
		expect(text(blocks[1].rows)).toEqual([' '.repeat(17), '40' + ' '.repeat(15)]);
	});

	it('puts the field of the range in the overlay and the fields of the left column in the column', () => {
		const out = html(['ident', 'field-3', 'range']);
		const left = out.match(/<div class="kln-snav5-left">.*?<\/div>/)![0];
		const overlay = out.match(/<div class="kln-snav5-overlay">.*?<\/div>/)![0];
		expect(left).toContain('<span class="kln-field" tabindex="0" data-field="ident">KSEA</span>');
		expect(left).toContain('<span class="kln-field" tabindex="0" data-field="field-3">Ö345°</span>');
		expect(overlay).toBe('<div class="kln-snav5-overlay"><span class="kln-row">' + ' '.repeat(17) + '</span>' +
			'<span class="kln-row"><span class="kln-field" tabindex="0" data-field="range">40</span>' + ' '.repeat(15) + '</span></div>');
	});

	it('draws the full-page map first, so that the text is drawn over it', () => {
		const out = html([]);
		expect(out.startsWith('<div class="kln-map kln-map-full" aria-hidden="true"><svg viewBox="0 0 148 91">')).toBe(true);
		expect(out.indexOf('</svg></div><div class="kln-snav5-left">')).toBeGreaterThan(0);
		expect(out.indexOf('kln-snav5-left')).toBeLessThan(out.indexOf('kln-snav5-overlay'));
		expect(out).not.toMatch(/kln-map-left|kln-map-right|kln-half|kln-status/);
	});

	it('makes the documented elements of the map fields, in a labeled group', () => {
		const out = html(['map']);
		expect(out).toContain('<div class="kln-map kln-map-full" role="group" aria-label="Map"><svg viewBox="0 0 148 91">' +
			'<g class="kln-field" tabindex="0" role="img" data-field="map" data-draw="icon $" data-box="70 40 5 6">' +
			'<rect x="70" y="40" width="5" height="6" fill="transparent"/><path d="M70 40h1v1h-1z"/></g></svg></div>');
	});

	it('names the full-page map when a documented map field has no element in it', () => {
		const c = superNav5({mapFields: new Map([['map', 'F'], ['aircraft', 'F']])});
		expect(() => html(['map', 'aircraft'], c)).toThrow('screen s: map F has no element of the map field aircraft');
	});

	it('splits a field that runs from the left column over the map into a part in each', () => {
		const c = superNav5({fields: new Map([['bottom', [{row: 6, from: 0, to: 8}]]])});
		const out = html(['bottom'], c);
		expect(out).toContain('<span class="kln-row"><span class="kln-field" tabindex="0" data-field="bottom">Ö345° </span></span></div>');
		expect(out).toContain('<span class="kln-row"><span class="kln-field" tabindex="0" data-field="bottom">40</span>' + ' '.repeat(15) + '</span></div>');
	});

	it('draws nothing of a field part over the map above the overlay, where only the map is', () => {
		const c = superNav5({fields: new Map([['top', [{row: 0, from: 0, to: 12}]]])});
		const out = html(['top'], c);
		expect(out.match(/data-field="top"/g)).toHaveLength(1);
		expect(out).toContain('<span class="kln-field" tabindex="0" data-field="top">20.0 È</span></span>');
	});

	it('rejects a documented field that lies only over the map above the overlay, which the site would draw nowhere', () => {
		const c = superNav5({fields: new Map([['hidden', [{row: 1, from: 6, to: 10}, {row: 4, from: 20, to: 23}]]])});
		expect(() => blocksFromCapture(c, new Set(['hidden']), 'nav-s'))
			.toThrow('screen nav-s: Super NAV 5: the field hidden lies only over the map above the message indicator and the range, so the site draws it nowhere');
		expect(() => blocksFromCapture(c, new Set())).not.toThrow();
	});

	it('draws a documented field that lies only in the row of the message indicator, right of the left column', () => {
		const c = superNav5({fields: new Map([['indicator', [{row: 5, from: 6, to: 9}]]])});
		expect(() => blocksFromCapture(c, new Set(['indicator']), 'nav-s')).not.toThrow();
		const overlay = html(['indicator'], c).match(/<div class="kln-snav5-overlay">.*?<\/div>/)![0];
		expect(overlay).toBe('<div class="kln-snav5-overlay"><span class="kln-row"><span class="kln-field" tabindex="0" data-field="indicator">   </span>' +
			' '.repeat(14) + '</span><span class="kln-row">' + '40' + ' '.repeat(15) + '</span></div>');
	});

	it('names the screen when it rejects text over the map', () => {
		expect(() => blocksFromCapture(superNav5({}, {...TEXT, 0: '20.0 È   Y'}), new Set(), 'nav-s'))
			.toThrow('screen nav-s: Super NAV 5: row 0 column 9 lies over the map but holds "Y" with the mask "."');
	});

	it('rejects text over the map above the overlay, which the site would not draw', () => {
		expect(() => blocksFromCapture(superNav5({}, {...TEXT, 2: 'Ê-Ë   X'}), new Set()))
			.toThrow('Super NAV 5: row 2 column 6 lies over the map but holds "X" with the mask "."');
		const c = superNav5();
		c.mask[4][22] = 'I';
		expect(() => blocksFromCapture(c, new Set())).toThrow('Super NAV 5: row 4 column 22 lies over the map but holds " " with the mask "I"');
	});
});

describe('an excerpt of some rows', () => {
	const text = (row: {text: string}[]) => row.map(s => s.text).join('');

	describe('parseRows', () => {
		it('reads one row and a range, numbered from 1, as rows from 0', () => {
			expect(parseRows('1', capture(), 'apt-1')).toEqual({first: 0, last: 0});
			expect(parseRows('2-4', capture(), 'apt-1')).toEqual({first: 1, last: 3});
			expect(parseRows('3-3', capture(), 'apt-1')).toEqual({first: 2, last: 2});
		});

		it('takes 7 for the status line of a split screen', () => {
			expect(parseRows('7', capture(), 'apt-7')).toEqual({first: 6, last: 6});
			expect(parseRows('6-7', capture(), 'apt-7')).toEqual({first: 5, last: 6});
		});

		it('takes the seventh row of a full page, with or without a status line', () => {
			expect(parseRows('1-7', capture({layout: 'full'}), 'set-1')).toEqual({first: 0, last: 6});
			expect(parseRows('7', capture({layout: 'full', status: false}), 'welcome')).toEqual({first: 6, last: 6});
		});

		it('names the screen and the value of anything that is not a row or a range', () => {
			for (const value of ['', '0', '01', '1-', '-2', '1,2', '1 - 2', ' 1', 'a', '1-2-3', '1.5', 'status']) {
				expect(() => parseRows(value, capture(), 'apt-1'), value)
					.toThrow(`KlnScreen screen="apt-1" rows="${value}": rows takes one row, e.g. "1", or consecutive rows`);
			}
		});

		it('rejects a range from the lower row to the upper', () => {
			expect(() => parseRows('3-2', capture(), 'apt-1'))
				.toThrow('KlnScreen screen="apt-1" rows="3-2": a range runs from the upper row to the lower');
		});

		it('rejects a row below the screen', () => {
			expect(() => parseRows('8', capture(), 'apt-1'))
				.toThrow('KlnScreen screen="apt-1" rows="8": the screen has the rows 1 to 7, 7 is the status line');
			expect(() => parseRows('6-8', capture({layout: 'full'}), 'set-1'))
				.toThrow('KlnScreen screen="set-1" rows="6-8": the screen has the rows 1 to 7');
			expect(() => parseRows('7', capture({status: false}), 'odd'))
				.toThrow('KlnScreen screen="odd" rows="7": the screen has the rows 1 to 6');
		});

		it('rejects a screen with a map, a map field or Super NAV 5', () => {
			const message = 'KlnScreen screen="nav-5" rows="1": a screen with a map is always shown whole, without rows';
			expect(() => parseRows('1', capture({maps: ['L']}), 'nav-5')).toThrow(message);
			expect(() => parseRows('1', capture({mapFields: new Map([['leg', 'R']])}), 'nav-5')).toThrow(message);
			expect(() => parseRows('1', capture({layout: 'super-nav-5', status: false}), 'nav-5')).toThrow(message);
		});
	});

	describe('fieldsOnRows', () => {
		const c = capture({
			fields: new Map([
				['ident', [{row: 0, from: 13, to: 17}]],
				['rank', [{row: 0, from: 19, to: 23}]],
				['name', [{row: 1, from: 12, to: 23}]],
				['both', [{row: 2, from: 0, to: 3}, {row: 3, from: 0, to: 3}]],
				['page', [{row: 6, from: 18, to: 23}]],
			]),
		});
		const all = new Set(['ident', 'rank', 'name', 'both', 'page']);

		it('keeps the documented fields with a part on the rows', () => {
			expect(fieldsOnRows(c, all, {first: 0, last: 0})).toEqual(new Set(['ident', 'rank']));
			expect(fieldsOnRows(c, all, {first: 0, last: 1})).toEqual(new Set(['ident', 'rank', 'name']));
		});

		it('keeps a field with a part on the rows and another outside them', () => {
			expect(fieldsOnRows(c, all, {first: 3, last: 3})).toEqual(new Set(['both']));
		});

		it('keeps the field of the status line for row 7 alone', () => {
			expect(fieldsOnRows(c, all, {first: 6, last: 6})).toEqual(new Set(['page']));
		});

		it('leaves out a field on the rows without explanation', () => {
			expect(fieldsOnRows(c, new Set(['rank']), {first: 0, last: 1})).toEqual(new Set(['rank']));
		});
	});

	describe('blocksFromCapture', () => {
		const c = capture({
			show: 'right',
			fields: new Map([['ident', [{row: 0, from: 12, to: 16}]], ['name', [{row: 1, from: 12, to: 23}]], ['page', [{row: 6, from: 18, to: 23}]]]),
		}, {0: 'PRESENT POS|KRNT  nr 2', 1: '           |RENTON MUNI', 6: 'NAV 2|enr-leg    |APT 1'});
		c.mask[0][18] = 'B';
		c.mask[1][12] = 'B';
		const documented = new Set(['ident', 'name', 'page']);

		it('draws the rows and blanks the others, keeping the crop and the size of the blocks', () => {
			const {crop, blocks} = blocksFromCapture(c, documented, 'apt-1', {first: 0, last: 0});
			expect(crop).toBe('right');
			expect(blocks.map(b => [b.cls, b.rows.length])).toEqual([['kln-half kln-half-left', 0], ['kln-half kln-half-right', 6], ['kln-status', 1]]);
			const right = blocks[1].rows;
			expect(right[0]).toEqual([
				{text: 'KRNT', field: 'ident', inverse: false, flash: false},
				{text: '  ', field: undefined, inverse: false, flash: false},
				{text: 'n', field: undefined, inverse: false, flash: true},
				{text: 'r 2 ', field: undefined, inverse: false, flash: false},
			]);
			// The name, flashing in its first cell, is on a hidden row: blank, without field or flash
			expect(right[1]).toEqual([{text: ' '.repeat(11), field: undefined, inverse: false, flash: false}]);
			expect(blocks[2].rows[0]).toEqual([{text: ' '.repeat(23), field: undefined, inverse: false, flash: false}]);
		});

		it('draws the status line alone as row 7', () => {
			const {blocks} = blocksFromCapture(c, documented, 'apt-1', {first: 6, last: 6});
			expect(blocks[1].rows.every(row => text(row) === ' '.repeat(11))).toBe(true);
			expect(blocks[2].rows[0]).toEqual([
				{text: ' '.repeat(18), field: undefined, inverse: false, flash: false},
				{text: 'APT 1', field: 'page', inverse: false, flash: false},
			]);
		});

		it('carries the window of the rows, and none for the whole screen', () => {
			expect(blocksFromCapture(c, documented, 'apt-1', {first: 0, last: 1}).window).toEqual({top: 0, height: 32});
			expect(blocksFromCapture(c, documented, 'apt-1').window).toBeUndefined();
		});

		it('blanks the hidden rows of a full page', () => {
			const full = capture({layout: 'full', status: false}, {0: 'WELCOME', 6: 'LAST ROW'});
			const [block] = blocksFromCapture(full, new Set(), 'welcome', {first: 6, last: 6}).blocks;
			expect(block.rows.map(text)).toEqual([...Array(6).fill(' '.repeat(23)), 'LAST ROW'.padEnd(23)]);
		});
	});

	describe('excerptWindow', () => {
		// The rows of the page are 13 px from y = 3; the line above the status line is at y = 81, the screen 100 px high
		it('keeps 3 px above and below rows of the page', () => {
			expect(excerptWindow(capture(), {first: 0, last: 0})).toEqual({top: 0, height: 19});
			expect(excerptWindow(capture(), {first: 2, last: 3})).toEqual({top: 26, height: 32});
		});

		it('stops at the line above the status line under the bottom row of the page', () => {
			expect(excerptWindow(capture(), {first: 5, last: 5})).toEqual({top: 65, height: 16});
			expect(excerptWindow(capture({layout: 'full'}), {first: 4, last: 5})).toEqual({top: 52, height: 29});
		});

		it('shows the status line alone without the line above it, down to the bottom of the screen', () => {
			expect(excerptWindow(capture(), {first: 6, last: 6})).toEqual({top: 82, height: 18});
		});

		it('shows the line above the status line between a row of the page and the status line', () => {
			expect(excerptWindow(capture(), {first: 5, last: 6})).toEqual({top: 65, height: 35});
			expect(excerptWindow(capture(), {first: 0, last: 6})).toEqual({top: 0, height: 100});
		});

		it('takes the seventh row of a page without status line as a row of the page', () => {
			expect(excerptWindow(capture({layout: 'full', status: false}), {first: 6, last: 6})).toEqual({top: 78, height: 19});
		});
	});

	describe('onlyFieldDocs', () => {
		const doc = (id: string, body: string) =>
			`<div class="kln-field-doc" data-field="${id}" data-title="T ${id}"><dt>T ${id}</dt><dd>${body}</dd></div>`;
		const ident = doc('ident', '<p>The <abbr class="kln-term">ident</abbr>.</p>');
		const rank = doc('rank', '<div><p>nested</p></div>');
		const name = doc('name', 'x');
		const html = `\n${ident}\n${rank}\n${name}\n`;

		it('keeps the explanations of the shown fields with everything inside them', () => {
			expect(onlyFieldDocs(html, new Set(['rank']), 'apt-1')).toBe(`\n${rank}\n`);
			expect(onlyFieldDocs(html, new Set(['ident', 'name']), 'apt-1')).toBe(`\n${ident}\n${name}\n`);
		});

		it('keeps everything when all are shown, and only the text before the first when none is', () => {
			expect(onlyFieldDocs(html, new Set(['ident', 'rank', 'name']), 'apt-1')).toBe(html);
			expect(onlyFieldDocs(html, new Set(), 'apt-1')).toBe('\n');
		});

		it('reads an explanation with the attributes the dev server adds', () => {
			const dev = '<div class="kln-field-doc" data-field="rank" data-title="Rank" data-astro-source-file="Field.astro"><dt>Rank</dt></div>';
			expect(onlyFieldDocs(ident + dev, new Set(['rank']), 'apt-1')).toBe(dev);
		});

		it('names the screen and the field when a shown field has no explanation in the HTML', () => {
			expect(() => onlyFieldDocs(html, new Set(['rank', 'surface']), 'apt-1'))
				.toThrow('screen apt-1: the rendered explanations have none of the field surface');
		});
	});

	it('draws only the fields on the rows as fields, against the committed screen apt-1-nearest', () => {
		const {capture: nearest} = loadCapture('apt-1-nearest');
		const documented = new Set(nearest.fields.keys());
		const rows = parseRows('1', nearest, 'apt-1-nearest');
		const shown = fieldsOnRows(nearest, documented, rows);
		expect(shown).toEqual(new Set(['ident', 'rank']));
		const html = screenHtml(blocksFromCapture(nearest, shown, 'apt-1-nearest', rows), shown);
		expect([...html.matchAll(/data-field="([^"]+)"/g)].map(m => m[1])).toEqual(['ident', 'rank']);
		expect(html).toContain('KRNT');
		expect(html).not.toContain('RENTON');
	});
});
