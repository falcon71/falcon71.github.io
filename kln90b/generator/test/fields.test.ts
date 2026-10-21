import {describe, expect, it} from 'vitest';
import {locateFields, locateMapFields, type FieldDef} from '../lib/fields.ts';

/** Pads every row to the 23 columns of the screen. */
function screen(...rows: string[]): string[] {
	for (const row of rows) if (row.length > 23) throw new Error(`test screen row "${row}" is longer than 23 characters`);
	const padded = rows.map(row => row.padEnd(23));
	while (padded.length < 7) padded.push(' '.repeat(23));
	return padded;
}

// Left half columns 0-10, middle line column 11, right half columns 12-22; row 6 is the status line.
const SPLIT = screen(
	'WPT  ABC   |',
	'           | SEATTLE',
	'DIS  45.2nm|',
	'           |  12.3nm',
	'           |',
	'           |',
	'ARR                 FPL',
);
// A full page: no middle line
const FULL = screen('0123456789ABCDEFGHIJKLM', '  HELLO WORLD', '', '', '', '', 'STATUS');

function locate(defs: FieldDef[], show: 'left' | 'right' | 'both' = 'both', text = SPLIT) {
	return locateFields(text, 'split', show, defs);
}

describe('locateFields', () => {
	it('finds a regex', () => {
		const fields = locate([{id: 'dis', find: /DIS +\S+nm/}]);
		expect(fields.get('dis')).toEqual([{row: 2, from: 0, to: 11}]);
	});

	it('returns absolute columns for a match in the right half', () => {
		expect(locate([{id: 'city', find: /SEATTLE/}]).get('city')).toEqual([{row: 1, from: 13, to: 20}]);
	});

	it('finds a regex in the status line', () => {
		expect(locate([{id: 'arr', find: /ARR/}]).get('arr')).toEqual([{row: 6, from: 0, to: 3}]);
	});

	it('does not cross the middle line', () => {
		// Row 2 reads "nm|" and then blanks only if the two halves are one string
		expect(() => locate([{id: 'x', find: /nm\|/}])).toThrow('field x: /nm\\|/ matches nothing');
		expect(() => locate([{id: 'x', find: /nm\s+\S/}])).toThrow('field x:');
	});

	it('does not cross rows', () => {
		expect(() => locate([{id: 'x', find: /ABC\s+SEATTLE/}])).toThrow('matches nothing');
	});

	it('rejects two matches', () => {
		// 'nm' appears in both halves
		expect(() => locate([{id: 'nm', find: /nm/}])).toThrow('field nm: /nm/ matches 2 times');
	});

	it('counts every match in a row', () => {
		expect(() => locate([{id: 'e', find: /E/}])).toThrow('matches 2 times');
	});

	it('searches the area a locator names', () => {
		expect(locate([{id: 'nm', find: {re: /nm/, area: 'R'}}]).get('nm')).toEqual([{row: 3, from: 18, to: 20}]);
	});

	it('restricts a regex to a row', () => {
		expect(locate([{id: 'nm', find: {re: /nm/, area: 'L', row: 2}}]).get('nm')).toEqual([{row: 2, from: 9, to: 11}]);
		expect(() => locate([{id: 'nm', find: {re: /nm/, area: 'L', row: 3}}])).toThrow('matches nothing');
	});

	it('does not search the status line for a regex that names a half', () => {
		expect(() => locate([{id: 'f', find: {re: /FPL/, area: 'L'}}])).toThrow('matches nothing');
	});

	it('keeps the flags of a regex and ignores its lastIndex', () => {
		const re = /seattle/gi;
		re.lastIndex = 15;
		expect(locate([{id: 'city', find: re}]).get('city')).toEqual([{row: 1, from: 13, to: 20}]);
		expect(re.lastIndex).toBe(15);
	});

	it('rejects a regex that matches the empty string', () => {
		expect(() => locate([{id: 'e', find: /x*/}])).toThrow('field e:');
	});

	it('covers a trimmed row', () => {
		expect(locate([{id: 'city', find: {area: 'R', row: 1}}]).get('city')).toEqual([{row: 1, from: 13, to: 20}]);
		expect(locate([{id: 'dis', find: {area: 'L', row: 2}}]).get('dis')).toEqual([{row: 2, from: 0, to: 11}]);
	});

	it('trims a row on the first and last non-blank cell of the half', () => {
		const text = screen('   X   Y   |   Z');
		expect(locate([{id: 'l', find: {area: 'L', row: 0}}], 'both', text).get('l')).toEqual([{row: 0, from: 3, to: 8}]);
		expect(locate([{id: 'r', find: {area: 'R', row: 0}}], 'both', text).get('r')).toEqual([{row: 0, from: 15, to: 16}]);
	});

	it('keeps explicit columns', () => {
		const fields = locate([{id: 'a', find: {area: 'L', row: 2, from: 5, to: 8}}, {id: 'b', find: {area: 'R', row: 4, from: 2, to: 4}}]);
		expect(fields.get('a')).toEqual([{row: 2, from: 5, to: 8}]);
		expect(fields.get('b')).toEqual([{row: 4, from: 14, to: 16}]);
	});

	it('keeps explicit columns of a blank row', () => {
		expect(locate([{id: 'a', find: {area: 'L', row: 5, from: 0, to: 3}}]).get('a')).toEqual([{row: 5, from: 0, to: 3}]);
	});

	it('takes the edge of the area for a missing column', () => {
		const fields = locate([{id: 'a', find: {area: 'R', row: 4, from: 4}}, {id: 'b', find: {area: 'L', row: 4, to: 4}}]);
		expect(fields.get('a')).toEqual([{row: 4, from: 16, to: 23}]);
		expect(fields.get('b')).toEqual([{row: 4, from: 0, to: 4}]);
	});

	it('rejects a blank row', () => {
		expect(() => locate([{id: 'blank', find: {area: 'L', row: 4}}])).toThrow('field blank: row 4 of area L is blank');
	});

	it('rejects columns outside the area', () => {
		expect(() => locate([{id: 'a', find: {area: 'L', row: 0, from: 5, to: 12}}])).toThrow('field a:');
		expect(() => locate([{id: 'a', find: {area: 'L', row: 0, from: 5, to: 5}}])).toThrow('field a:');
		expect(() => locate([{id: 'a', find: {area: 'L', row: 0, from: -1, to: 5}}])).toThrow('field a:');
		expect(() => locate([{id: 'a', find: {area: 'L', row: 0, from: 1.5, to: 5}}])).toThrow('field a:');
	});

	it('rejects a row outside the area', () => {
		expect(() => locate([{id: 'a', find: {area: 'L', row: 6}}])).toThrow('field a:');
		expect(() => locate([{id: 'a', find: {area: 'L', row: -1}}])).toThrow('field a:');
		expect(() => locate([{id: 'a', find: {area: 'R', row: 0.5}}])).toThrow('field a:');
		expect(() => locate([{id: 'a', find: {re: /SEATTLE/, area: 'R', row: 6}}])).toThrow('field a:');
	});

	it('needs a row for a place in a half', () => {
		expect(() => locate([{id: 'a', find: {area: 'L'}}])).toThrow('field a:');
	});

	it('needs an area for a row', () => {
		expect(() => locate([{id: 'a', find: {re: /SEATTLE/, row: 1}}])).toThrow('field a:');
	});

	it('addresses the status line as one row', () => {
		expect(locate([{id: 'arr', find: {area: 'S'}}]).get('arr')).toEqual([{row: 6, from: 0, to: 23}]);
		const text = screen('', '', '', '', '', '', '  MSG   ');
		expect(locate([{id: 'msg', find: {area: 'S'}}], 'both', text).get('msg')).toEqual([{row: 6, from: 2, to: 5}]);
		expect(locate([{id: 'fpl', find: {area: 'S', row: 0, from: 19, to: 22}}]).get('fpl')).toEqual([{row: 6, from: 19, to: 22}]);
		expect(() => locate([{id: 'a', find: {area: 'S', row: 1}}])).toThrow('field a:');
	});

	it('rejects overlap', () => {
		expect(() => locate([{id: 'a', find: {area: 'L', row: 2}}, {id: 'b', find: {area: 'L', row: 2, from: 10, to: 11}}]))
			.toThrow('field b: overlaps field a');
		expect(() => locate([{id: 'a', find: {area: 'L', row: 2, from: 4, to: 8}}, {id: 'b', find: {area: 'L', row: 2, from: 0, to: 5}}]))
			.toThrow('field b: overlaps field a');
	});

	it('accepts touching fields and fields on different rows', () => {
		const fields = locate([
			{id: 'a', find: {area: 'L', row: 2, from: 0, to: 5}}, {id: 'b', find: {area: 'L', row: 2, from: 5, to: 8}},
			{id: 'c', find: {area: 'L', row: 3, from: 0, to: 8}},
		]);
		expect([...fields.keys()]).toEqual(['a', 'b', 'c']);
	});

	it('rejects the overlap of two parts of one field', () => {
		expect(() => locate([{id: 'a', find: [{area: 'L', row: 2, from: 0, to: 5}, {area: 'L', row: 2, from: 4, to: 8}]}]))
			.toThrow('field a: overlaps itself');
	});

	it('rejects a hidden half', () => {
		expect(() => locate([{id: 'r', find: {area: 'R', row: 0}}], 'left')).toThrow('field r:');
		expect(() => locate([{id: 'l', find: {area: 'L', row: 0}}], 'right')).toThrow('field l:');
		expect(() => locate([{id: 'r', find: {re: /SEATTLE/, area: 'R'}}], 'left')).toThrow('field r:');
	});

	it('does not find a regex in a hidden half', () => {
		expect(() => locate([{id: 'city', find: /SEATTLE/}], 'left')).toThrow('field city: /SEATTLE/ matches nothing');
		expect(locate([{id: 'nm', find: /nm/}], 'left').get('nm')).toEqual([{row: 2, from: 9, to: 11}]);
		expect(locate([{id: 'nm', find: /nm/}], 'right').get('nm')).toEqual([{row: 3, from: 18, to: 20}]);
	});

	it('rejects a status field outside the page name on a cropped screen', () => {
		const text = screen('ABC        |', '', '', '', '', '', 'ARR   XYZ           FPL');
		expect(() => locate([{id: 's', find: {area: 'S', row: 0, from: 6, to: 9}}], 'left', text)).toThrow('field s:');
		expect(() => locate([{id: 's', find: {area: 'S', row: 0, from: 3, to: 6}}], 'left', text)).toThrow('field s:');
		expect(() => locate([{id: 's', find: {area: 'S', row: 0, from: 17, to: 20}}], 'right', text)).toThrow('field s:');
		expect(() => locate([{id: 's', find: /XYZ/}], 'left', text)).toThrow('field s:');
		expect(locate([{id: 's', find: {area: 'S', row: 0, from: 0, to: 5}}], 'left', text).get('s')).toEqual([{row: 6, from: 0, to: 5}]);
		expect(locate([{id: 's', find: {area: 'S', row: 0, from: 18, to: 23}}], 'right', text).get('s')).toEqual([{row: 6, from: 18, to: 23}]);
		expect(locate([{id: 's', find: /FPL/}], 'right', text).get('s')).toEqual([{row: 6, from: 20, to: 23}]);
	});

	it('accepts a status field anywhere on an uncropped screen', () => {
		const text = screen('', '', '', '', '', '', 'ARR   XYZ           FPL');
		expect(locate([{id: 's', find: /XYZ/}], 'both', text).get('s')).toEqual([{row: 6, from: 6, to: 9}]);
	});

	it('joins parts', () => {
		const fields = locate([{id: 'both', find: [/SEATTLE/, /DIS +\S+nm/, {area: 'L', row: 0, from: 5, to: 8}]}]);
		expect(fields.get('both')).toEqual([
			{row: 1, from: 13, to: 20}, {row: 2, from: 0, to: 11}, {row: 0, from: 5, to: 8},
		]);
	});

	it('names the field that fails in a joined field', () => {
		expect(() => locate([{id: 'j', find: [/SEATTLE/, /nothing/]}])).toThrow('field j: /nothing/ matches nothing');
	});

	it('keeps the order of the definitions', () => {
		const fields = locate([{id: 'z', find: /SEATTLE/}, {id: 'a', find: /DIS/}]);
		expect([...fields.keys()]).toEqual(['z', 'a']);
	});

	it('rejects bad and duplicate ids', () => {
		expect(() => locate([{id: 'Upper', find: /DIS/}])).toThrow('field Upper:');
		expect(() => locate([{id: 'has space', find: /DIS/}])).toThrow('field has space:');
		expect(() => locate([{id: '', find: /DIS/}])).toThrow('field :');
		expect(() => locate([{id: 'a-1', find: /DIS/}, {id: 'a-1', find: /SEATTLE/}])).toThrow('field a-1: is defined twice');
		expect(locate([{id: 'a-1', find: /DIS/}]).has('a-1')).toBe(true);
	});

	it('rejects an empty list of locators', () => {
		expect(() => locate([{id: 'a', find: []}])).toThrow('field a:');
	});

	it('rejects a text that is not 7 rows of 23 characters', () => {
		expect(() => locate([], 'both', SPLIT.slice(0, 6))).toThrow('7 rows');
		expect(() => locate([], 'both', [...SPLIT.slice(0, 6), 'short'])).toThrow('23');
	});

	describe('full layout', () => {
		const full = (defs: FieldDef[], status = true) => locateFields(FULL, 'full', 'both', defs, status);

		it('searches the page rows across 23 columns and the status line', () => {
			expect(full([{id: 'hello', find: /HELLO WORLD/}]).get('hello')).toEqual([{row: 1, from: 2, to: 13}]);
			expect(full([{id: 'st', find: /STATUS/}]).get('st')).toEqual([{row: 6, from: 0, to: 6}]);
		});

		it('matches across the column where the middle line would be', () => {
			expect(full([{id: 'm', find: /ABCDEFGH/}]).get('m')).toEqual([{row: 0, from: 10, to: 18}]);
		});

		it('covers a trimmed row and explicit columns of the page', () => {
			expect(full([{id: 'p', find: {area: 'F', row: 1}}]).get('p')).toEqual([{row: 1, from: 2, to: 13}]);
			expect(full([{id: 'p', find: {area: 'F', row: 0, from: 8, to: 20}}]).get('p')).toEqual([{row: 0, from: 8, to: 20}]);
		});

		it('rejects the halves', () => {
			expect(() => full([{id: 'l', find: {area: 'L', row: 0}}])).toThrow('field l:');
			expect(() => full([{id: 'r', find: {re: /HELLO/, area: 'R'}}])).toThrow('field r:');
		});

		it('rejects the page on a split layout', () => {
			expect(() => locate([{id: 'f', find: {area: 'F', row: 0}}])).toThrow('field f:');
		});

		it('ends the page above the status line', () => {
			expect(() => full([{id: 'f', find: {area: 'F', row: 6}}])).toThrow('field f:');
			expect(() => full([{id: 'f', find: {re: /STATUS/, area: 'F'}}])).toThrow('matches nothing');
		});

		it('gives a page without status line all seven rows and no status field', () => {
			expect(full([{id: 'st', find: {area: 'F', row: 6}}], false).get('st')).toEqual([{row: 6, from: 0, to: 6}]);
			expect(full([{id: 'st', find: /STATUS/}], false).get('st')).toEqual([{row: 6, from: 0, to: 6}]);
			expect(() => full([{id: 'st', find: {area: 'S'}}], false)).toThrow('field st:');
			expect(() => full([{id: 'st', find: {re: /STATUS/, area: 'S'}}], false)).toThrow('field st:');
		});
	});
});

// The descriptions of the elements of two maps, in drawing order
const LEFT = ['arrow 47.1000,-122.3000 KSEA', 'icon % KSEA', 'icon 1 KPDX', 'icon 2 KSEA', 'icon $ 47.1000,-122.3000'];
const RIGHT = ['plain KSEA KSEA', 'label 16L KSEA', 'label 34R KSEA', 'label 16C KSEA'];
const MAPS = {L: LEFT.map(draw => ({draw})), R: RIGHT.map(draw => ({draw}))};

describe('locateMapFields', () => {
	const ALL_RIGHT: FieldDef = {id: 'runways', find: {map: 'R', draw: /^(plain|label) /, many: true}};
	const LEFT_FIELDS: FieldDef[] = [
		{id: 'leg', find: {map: 'L', draw: /^arrow /}},
		{id: 'active', find: {map: 'L', draw: /^icon % /}},
		{id: 'numbers', find: {map: 'L', draw: /^icon \d /, many: true}},
		{id: 'aircraft', find: {map: 'L', draw: /^icon \$ /}},
	];

	it('gives every field its side and every element its field', () => {
		const found = locateMapFields([...LEFT_FIELDS, ALL_RIGHT], 'both', MAPS);
		expect([...found.sides]).toEqual([['leg', 'L'], ['active', 'L'], ['numbers', 'L'], ['aircraft', 'L'], ['runways', 'R']]);
		expect(found.owners.L).toEqual(['leg', 'active', 'numbers', 'numbers', 'aircraft']);
		expect(found.owners.R).toEqual(['runways', 'runways', 'runways', 'runways']);
	});

	it('joins the elements of several locators of one side', () => {
		const found = locateMapFields([...LEFT_FIELDS, {id: 'runway', find: [{map: 'R', draw: /^plain/}, {map: 'R', draw: /^label/, many: true}]}],
			'both', MAPS);
		expect(found.owners.R).toEqual(['runway', 'runway', 'runway', 'runway']);
	});

	it('requires exactly one element without many', () => {
		expect(() => locateMapFields([{id: 'n', find: {map: 'L', draw: /^icon \d /}}], 'left', MAPS))
			.toThrow('field n: /^icon \\d / matches 2 elements of map L: "icon 1 KPDX", "icon 2 KSEA"');
		expect(() => locateMapFields([{id: 'n', find: {map: 'L', draw: /^nothing/}}], 'left', MAPS))
			.toThrow('field n: /^nothing/ matches no element of map L');
		expect(() => locateMapFields([{id: 'n', find: {map: 'L', draw: /^nothing/, many: true}}], 'left', MAPS))
			.toThrow('field n: /^nothing/ matches no element of map L');
	});

	it('ignores the flags and lastIndex of a global regex', () => {
		const re = /^icon % /g;
		re.lastIndex = 3;
		const defs = LEFT_FIELDS.map(f => f.id === 'active' ? {id: 'active', find: {map: 'L' as const, draw: re}} : f);
		expect(locateMapFields(defs, 'left', MAPS).owners.L![1]).toBe('active');
		expect(re.lastIndex).toBe(3);
	});

	it('rejects a map side the screen does not show or that has no map', () => {
		expect(() => locateMapFields([ALL_RIGHT], 'left', MAPS)).toThrow('field runways: map R is not shown');
		expect(() => locateMapFields([...LEFT_FIELDS, ALL_RIGHT], 'both', {L: MAPS.L})).toThrow('field runways: there is no map R');
	});

	it('rejects a field with locators of both sides, and one mixing text and map locators', () => {
		expect(() => locateMapFields([{id: 'x', find: [{map: 'L', draw: /^arrow/}, {map: 'R', draw: /^plain/}]}], 'both', MAPS))
			.toThrow('field x: its map locators name both sides');
		expect(() => locateMapFields([{id: 'x', find: [{map: 'L', draw: /^arrow/}, /DIS/]}], 'both', MAPS))
			.toThrow('field x: mixes text and map locators');
		expect(() => locate([{id: 'x', find: [/DIS/, {map: 'L', draw: /^arrow/}]}])).toThrow('field x: mixes text and map locators');
	});

	it('fails on an element that belongs to no field, naming it', () => {
		const defs = LEFT_FIELDS.filter(f => f.id !== 'active');
		expect(() => locateMapFields(defs, 'left', MAPS)).toThrow('the element "icon % KSEA" of map L belongs to no field');
		expect(() => locateMapFields(defs.slice(1), 'left', MAPS))
			.toThrow('the elements "arrow 47.1000,-122.3000 KSEA", "icon % KSEA" of map L belong to no field');
	});

	it('checks only the maps the screen shows', () => {
		expect(locateMapFields(LEFT_FIELDS, 'left', MAPS).owners).toEqual({L: ['leg', 'active', 'numbers', 'numbers', 'aircraft']});
		expect(() => locateMapFields(LEFT_FIELDS, 'both', MAPS))
			.toThrow('the elements "plain KSEA KSEA", "label 16L KSEA", "label 34R KSEA", "label 16C KSEA" of map R belong to no field');
	});

	it('fails on an element that two fields claim, naming both', () => {
		const defs = [...LEFT_FIELDS, {id: 'icons', find: {map: 'L' as const, draw: /^icon /, many: true}}];
		expect(() => locateMapFields(defs, 'left', MAPS))
			.toThrow('field icons: the element "icon % KSEA" of map L belongs to the fields active and icons');
		const later: FieldDef[] = [...LEFT_FIELDS.slice(1), {id: 'leg', find: [{map: 'L', draw: /^arrow/}, {map: 'L', draw: /^icon % /}]}];
		expect(() => locateMapFields(later, 'left', MAPS)).toThrow('field leg: the element "icon % KSEA" of map L belongs to the fields active and leg');
		const itself: FieldDef[] = [...LEFT_FIELDS.slice(1), {id: 'leg', find: [{map: 'L', draw: /^arrow/}, {map: 'L', draw: /KSEA$/, many: true}]}];
		expect(() => locateMapFields(itself, 'left', MAPS))
			.toThrow('field leg: the element "arrow 47.1000,-122.3000 KSEA" of map L is claimed twice by the field');
	});

	it('rejects duplicate ids, across text and map fields', () => {
		expect(() => locateMapFields([...LEFT_FIELDS, {id: 'leg', find: {map: 'L', draw: /^icon %/}}], 'left', MAPS))
			.toThrow('field leg: is defined twice');
		expect(() => locate([{id: 'leg', find: /DIS/}, {id: 'leg', find: {map: 'L', draw: /^arrow/}}]))
			.toThrow('field leg: is defined twice');
		expect(() => locateMapFields([{id: 'leg', find: /DIS/}, ...LEFT_FIELDS], 'left', MAPS))
			.toThrow('field leg: is defined twice');
	});

	it('leaves the map fields to locateMapFields and the text fields to locateFields', () => {
		expect([...locate([{id: 'dis', find: /DIS/}, ...LEFT_FIELDS]).keys()]).toEqual(['dis']);
		expect([...locateMapFields([{id: 'dis', find: /DIS/}, ...LEFT_FIELDS], 'left', MAPS).sides.keys()])
			.toEqual(['leg', 'active', 'numbers', 'aircraft']);
	});

	it('accepts a screen without maps and without map fields', () => {
		expect(locateMapFields([{id: 'dis', find: /DIS/}], 'both', {})).toEqual({sides: new Map(), owners: {}});
	});
});
