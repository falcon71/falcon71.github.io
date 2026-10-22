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

function superNav5(answer: boolean, keepMessages = false, then?: (u: HeadlessUnit) => Promise<void>): ScreenDescription {
	return {
		title: 'Super NAV 5', show: 'both',
		boot: {position: POSITION, storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')])},
		steps: async u => {
			await moveAircraft(u, POSITION, {groundspeedKt: 120, trackTrue: 0});
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

	// One unit per test: pulling the right inner knob shows the direct-to window, the right cursor opens the menu
	const REFUSED = /^screen super-nav-5-smoke: Super NAV 5 with the right menu or the direct-to window is not supported yet$/;

	it('refuses Super NAV 5 with the direct-to window', async () => {
		await expect(generateScreen(screenDir(FIELDS), superNav5(true, false, u => u.panel.scan()))).rejects.toThrow(REFUSED);
	});

	it('refuses Super NAV 5 with the right menu', async () => {
		await expect(generateScreen(screenDir(FIELDS), superNav5(true, false, u => u.panel.cursor('R')))).rejects.toThrow(REFUSED);
	});

	it('shows the flashing msg over the map in row 5 from column 6 with keepMessages', async () => {
		const dir = screenDir(FIELDS);
		await generateScreen(dir, superNav5(false, true));
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.text[5].slice(6)).toBe('msg' + ' '.repeat(14));
		expect(file.mask[5].slice(6).join('')).toBe('FFF' + '.'.repeat(14));
	});
});
