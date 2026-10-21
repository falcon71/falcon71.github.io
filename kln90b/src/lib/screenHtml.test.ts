import {describe, expect, it} from 'vitest';
import type {CellAttr, FieldPart, ScreenCapture} from './screenFile.ts';
import {blocksFromCapture, blocksFromMarkup, screenHtml} from './screenHtml.ts';

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
		text, mask, fields: new Map<string, FieldPart[]>(), maps: [], ...over,
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
});
