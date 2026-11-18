import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {generateScreen, type ScreenDescription} from '../lib/generate.ts';
import {adjustCourseIndicator, facility, moveAircraft, place, pointFrom, savedFlightplan, showSuperNav5} from '../api.ts';
import {parseScreenFile} from '../../src/lib/screenFile.ts';
import type {FieldDef} from '../lib/fields.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

const temps: string[] = [];

/** An empty screen folder `<temp>/super-nav-5-smoke` with a placeholder explanation of each field. */
function screenDir(fields: FieldDef[]): string {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kln-screen-'));
	temps.push(root);
	const dir = path.join(root, 'super-nav-5-smoke');
	fs.mkdirSync(dir);
	fs.writeFileSync(path.join(dir, 'fields.mdx'), fields.map(f => `<Field id="${f.id}" title="${f.id}">x</Field>`).join('\n\n'));
	return dir;
}

afterEach(() => {
	for (const t of temps.splice(0)) fs.rmSync(t, {recursive: true, force: true});
});

const KSEA = place('KSEA');
const POSITION = pointFrom(KSEA, 180, 20);

// The left column of Super NAV 5, one field per row, the message indicator and range over the map, and the map
const FIELDS: FieldDef[] = [
	{id: 'distance', find: {re: /^ *\d+\.\d/, area: 'F', row: 0}},
	{id: 'ident', find: {re: /^KSEA/, area: 'F', row: 1}},
	{id: 'mode', find: {re: /^\S+/, area: 'F', row: 2}},
	{id: 'groundspeed', find: {re: /^ *\d+/, area: 'F', row: 3}},
	{id: 'field-1', find: {re: /^\S+/, area: 'F', row: 4}},
	{id: 'field-2', find: {re: /^\S+/, area: 'F', row: 5}},
	{id: 'field-3', find: {re: /^\S+/, area: 'F', row: 6}},
	{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
	{id: 'map', find: {map: 'F', draw: /./, many: true}},
];

function superNav5(answer: boolean, keepMessages = false, then?: (u: HeadlessUnit) => Promise<void>, from = POSITION): ScreenDescription {
	return {
		title: 'Super NAV 5', show: 'both',
		boot: {position: from, storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')])},
		steps: async u => {
			await moveAircraft(u, from, {groundspeedKt: 120, trackTrue: 0});
			await u.panel.directTo('KSEA');
			if (answer) await adjustCourseIndicator(u);
			await showSuperNav5(u);
			await then?.(u);
		},
		fields: FIELDS, keepMessages,
	};
}

describe('Super NAV 5', () => {
	it('writes the left column, the range and the full-page map', async () => {
		const dir = screenDir(FIELDS);
		await generateScreen(dir, superNav5(true));
		const text = fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8');
		expect(text).toContain('\nlayout super-nav-5\n');
		expect(text).toContain('\nmap F\n');
		const file = parseScreenFile(text);
		expect(file.show).toBe('both');
		expect(file.status).toBe(false);
		expect(file.maps).toEqual(['F']);
		expect(file.mapFields).toEqual(new Map([['map', 'F']]));
		// The left column in columns 0-5; the blank message indicator in row 5 and the range in row 6 from column 6
		expect(file.text).toEqual([
			'20.0 È                 ',
			'KSEA                   ',
			'Ê-Ë                    ',
			' 120 É                 ',
			'Ð0:10                  ',
			'Ó345°                  ',
			'Ö345° 40               ',
		]);
		expect(file.mask.every(row => row.every(attr => attr === '.'))).toBe(true);
		expect(file.fields.get('field-3')).toEqual([{row: 6, from: 0, to: 5}]);
		expect(file.fields.get('range')).toEqual([{row: 6, from: 6, to: 8}]);
		expect(fs.readdirSync(dir).filter(name => name.startsWith('map-'))).toEqual(['map-F.svg']);
		// The Direct To from where it was made, the active waypoint and its name, and the aircraft
		expect(fs.readFileSync(path.join(dir, 'map-F.svg'), 'utf8').match(/(?<=data-draw=")[^"]*/g)).toEqual([
			'arrow 47.1172,-122.3118 KSEA', 'icon @ KSEA', 'label KSEA KSEA', 'icon $ 47.1172,-122.3118',
		]);
	});

	it('rejects Super NAV 5 while ADJ NAV IND CRS is pending', async () => {
		const dir = screenDir(FIELDS);
		await expect(generateScreen(dir, superNav5(false))).rejects.toThrow(/^screen super-nav-5-smoke: a message is pending/);
		expect(fs.existsSync(path.join(dir, 'screen.txt'))).toBe(false);
	});

	// Pulling the right inner knob shows the direct-to window, the right cursor opens the menu; one unit per test.
	// The map at 40 NM is 1.2 pixels to the NM with the aircraft at 74,45; the menu covers the pixels from x 76 to the right
	// edge and from y 0 to 52, the window those from x 94 and from y 78
	const drawsOf = (dir: string) => fs.readFileSync(path.join(dir, 'map-F.svg'), 'utf8').match(/(?<=data-draw=")[^"]*/g);
	const readScreen = (dir: string) => parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
	const tail = (rows: string[], from: number, to: number) => rows.slice(from, to).map(r => Array.from(r).slice(15).join(''));

	const MENU_FIELDS: FieldDef[] = [
		...FIELDS.filter(f => f.id !== 'map'),
		{id: 'vor', find: {re: /VOR:\S+/, area: 'F', row: 0}},
		{id: 'ndb', find: {re: /NDB:\S+/, area: 'F', row: 1}},
		{id: 'apt', find: {re: /APT:\S+/, area: 'F', row: 2}},
		{id: 'orientation', find: {re: /\S+$/, area: 'F', row: 3}},
	];
	// The range is the last number before the window
	const WINDOW_FIELDS: FieldDef[] = [
		...FIELDS.filter(f => f.id !== 'map' && f.id !== 'range'),
		{id: 'range', find: {re: /(?<=° )\d+/, area: 'F', row: 6}},
		{id: 'window', find: {re: /.{6}$/, area: 'F', row: 6}},
	];

	it('writes the right menu in rows 0-3 from column 15, with the cursor, and keeps an element it covers in part', async () => {
		const fields: FieldDef[] = [...MENU_FIELDS, {id: 'map', find: {map: 'F', draw: /./, many: true}}];
		const dir = screenDir(fields);
		await generateScreen(dir, {...superNav5(true, false, u => u.panel.cursor('R')), fields});
		const file = readScreen(dir);
		expect(tail(file.text, 0, 4)).toEqual(['ÜVOR:OFF', 'ÝNDB:OFF', 'ŸAPT:OFF', ' 000° N^']);
		// The cursor is on the VOR entry only; the rest of the screen is as without the menu
		expect(tail(file.mask.map(r => r.join('')), 0, 4)).toEqual(['.....III', '........', '........', '........']);
		expect(file.text[5]).toBe('Ó345°                  ');
		expect(file.fields.get('vor')).toEqual([{row: 0, from: 16, to: 23}]);
		expect(file.fields.get('ndb')).toEqual([{row: 1, from: 16, to: 23}]);
		expect(file.fields.get('orientation')).toEqual([{row: 3, from: 21, to: 23}]);
		// The arrow of the Direct To reaches under the menu, where only a few pixels of it lie: it is still on the page
		expect(drawsOf(dir)).toEqual(['arrow 47.1172,-122.3118 KSEA', 'icon @ KSEA', 'label KSEA KSEA', 'icon $ 47.1172,-122.3118']);
	});

	it('leaves out the elements the menu hides entirely, so that no field has to explain them', async () => {
		const fields: FieldDef[] = [...MENU_FIELDS, {id: 'aircraft', find: {map: 'F', draw: /^icon \$/}}];
		const dir = screenDir(fields);
		// KSEA lies 30 NM east of the aircraft, under the menu: its icon, its label and the Direct To arrow are all under it
		await generateScreen(dir, {...superNav5(true, false, u => u.panel.cursor('R'), pointFrom(KSEA, 270, 30)), fields});
		expect(drawsOf(dir)).toEqual(['icon $ 47.4475,-123.0498']);
	});

	it('writes the direct-to window in row 6 from column 17 as inverse cells, and leaves out what it hides', async () => {
		const fields: FieldDef[] = [
			...WINDOW_FIELDS,
			{id: 'arrow', find: {map: 'F', draw: /^arrow /}},
			{id: 'label', find: {map: 'F', draw: /^label /}},
			{id: 'aircraft', find: {map: 'F', draw: /^icon \$/}},
		];
		const dir = screenDir(fields);
		// KSEA lies at the lower right of the map: its icon is under the window, its label just above it, so it stays
		await generateScreen(dir, {...superNav5(true, false, u => u.panel.scan(), pointFrom(KSEA, 315, 44)), fields});
		const file = readScreen(dir);
		expect(file.text[6]).toBe('Ö345° 40         KSEA  ');
		expect(file.mask[6].join('')).toBe('.................IIIIII');
		expect(file.fields.get('window')).toEqual([{row: 6, from: 17, to: 23}]);
		expect(file.fields.get('range')).toEqual([{row: 6, from: 6, to: 8}]);
		// No menu
		expect(file.text.slice(0, 4).every(row => row.slice(6).trim() === '')).toBe(true);
		expect(drawsOf(dir)).toEqual(['arrow 47.9649,-123.0848 KSEA', 'label KSEA KSEA', 'icon $ 47.9649,-123.0848']);
	});

	it('writes an empty direct-to window as six inverse blanks', async () => {
		const dir = screenDir([]);
		fs.writeFileSync(path.join(dir, 'fields.mdx'), ['window', 'aircraft'].map(id => `<Field id="${id}" title="${id}">x</Field>`).join('\n\n'));
		await generateScreen(dir, {
			title: 'Super NAV 5', show: 'both', boot: {position: POSITION},
			steps: async u => {
				await showSuperNav5(u);
				await u.panel.scan();
			},
			fields: [
				{id: 'window', find: {re: /.{6}$/, area: 'F', row: 6}},
				{id: 'aircraft', find: {map: 'F', draw: /^icon \$/}},
			],
		});
		const file = readScreen(dir);
		expect(file.text[6].slice(17)).toBe('      ');
		expect(file.mask[6].join('')).toBe('.................IIIIII');
		expect(file.fields.get('window')).toEqual([{row: 6, from: 17, to: 23}]);
	});

	it('shows the flashing msg over the map in row 5 from column 6 with keepMessages', async () => {
		const dir = screenDir(FIELDS);
		await generateScreen(dir, superNav5(false, true));
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.text[5].slice(6)).toBe('msg' + ' '.repeat(14));
		expect(file.mask[5].slice(6).join('')).toBe('FFF' + '.'.repeat(14));
	});
});
