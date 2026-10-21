import {describe, expect, it} from 'vitest';
import type {CellAttr, FieldPart, ScreenCapture} from './screenFile.ts';
import {mapToSvg} from '../../generator/lib/mapSvg.ts';
import {blocksFromCapture, blocksFromMarkup, screenHtml} from './screenHtml.ts';
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

const ROWS = 7;
const COLUMNS = 23;

/** A capture of blanks; the tests write into it. */
function capture(over: Partial<ScreenCapture> = {}, rows: Record<number, string> = {}): ScreenCapture {
	const text = Array.from({length: ROWS}, (_, row) => (rows[row] ?? '').padEnd(COLUMNS));
	const mask: CellAttr[][] = Array.from({length: ROWS}, () => Array.from({length: COLUMNS}, () => '.' as CellAttr));
	return {
		kln90b: '0'.repeat(40), title: 'Test page', show: 'both', layout: 'split', status: true,
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
