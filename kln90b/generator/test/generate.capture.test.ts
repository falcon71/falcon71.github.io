import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {generateScreen, type ScreenDescription} from '../lib/generate.ts';
import {adjustCourseIndicator} from '../api.ts';
import {facility} from '../lib/navdata.ts';
import {savedFlightplan} from '../../../vendor/kln90b/test/harness/storage';
import {parseScreenFile} from '../../src/lib/screenFile.ts';

const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'nav-1-smoke');
const temps: string[] = [];

/** A copy of the fixture folder as `<temp>/nav-1-smoke`, so that the folder name is a valid screen id. */
function copyFixture(fieldsMdx?: string): string {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kln-screen-'));
	temps.push(root);
	const dir = path.join(root, 'nav-1-smoke');
	fs.cpSync(FIXTURE, dir, {recursive: true});
	if (fieldsMdx !== undefined) fs.writeFileSync(path.join(dir, 'fields.mdx'), fieldsMdx);
	return dir;
}

afterEach(() => {
	for (const t of temps.splice(0)) fs.rmSync(t, {recursive: true, force: true});
});

function nav1(overrides: Partial<ScreenDescription> = {}): ScreenDescription {
	return {
		title: 'NAV 1 page', show: 'left', boot: {position: {lat: 47.45, lon: -122.31}},
		steps: u => u.panel.selectPage('L', 'NAV 1'),
		fields: [{id: 'page', find: {area: 'S', row: 0, from: 0, to: 5}}, {id: 'dis', find: /DIS +\S+/}],
		...overrides,
	};
}

describe('generateScreen', () => {
	it('writes the screen file of a page', async () => {
		const dir = copyFixture();
		await generateScreen(dir, nav1());
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.show).toBe('left');
		expect(file.layout).toBe('split');
		expect(file.status).toBe(true);
		expect(file.title).toBe('NAV 1 page');
		expect(file.text[6].slice(0, 5)).toBe('NAV 1');
		expect(file.fields.get('page')).toEqual([{row: 6, from: 0, to: 5}]);
		expect(file.fields.get('dis')).toHaveLength(1);
		expect(file.kln90b).toMatch(/^[0-9a-f]{40}$/);
		expect(file.maps).toEqual([]);
	});

	it('reads the pending start-up message, so that the status line does not flash msg', async () => {
		const dir = copyFixture();
		await generateScreen(dir, nav1());
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.text[6].includes('msg')).toBe(false);
		expect(file.text[6].slice(0, 5)).toBe('NAV 1');
	});

	it('keeps the message pending with keepMessages, for a screen that shows it', async () => {
		const dir = copyFixture();
		await generateScreen(dir, nav1({keepMessages: true}));
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.text[6]).toContain('msg');
		expect(file.mask[6].slice(14, 17).join('')).toBe('FFF');
	});

	it('rejects a screen whose steps leave a message pending, unless keepMessages', async () => {
		// Activating the flight plan raises a message of its own, after the one of the start-up was read
		const plan = {boot: {position: {lat: 45.8, lon: -122.6}, storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')])}};
		const dir = copyFixture();
		await expect(generateScreen(dir, nav1(plan))).rejects.toThrow(/^screen nav-1-smoke: .*message.*pending.*readMessages.*keepMessages/);
		expect(fs.existsSync(path.join(dir, 'screen.txt'))).toBe(false);
	});

	it('shows no msg once adjustCourseIndicator has answered the message of the flight plan', async () => {
		const dir = copyFixture();
		const plan = {boot: {position: {lat: 45.8, lon: -122.6}, storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')])}};
		await generateScreen(dir, nav1({
			...plan, steps: async u => {
				await adjustCourseIndicator(u);
				await u.panel.selectPage('L', 'NAV 1');
			},
		}));
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.text[6].includes('msg')).toBe(false);
		expect(file.text[0]).toMatch(/^KPDX/);
	});

	it('accepts the pending message of a flight plan with keepMessages', async () => {
		const dir = copyFixture();
		const plan = {boot: {position: {lat: 45.8, lon: -122.6}, storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')])}};
		await generateScreen(dir, nav1({...plan, keepMessages: true}));
		expect(parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8')).text[6]).toContain('msg');
	});

	it('deletes a map file it did not write and keeps other files', async () => {
		const dir = copyFixture();
		fs.writeFileSync(path.join(dir, 'map-L.svg'), '<svg/>');
		await generateScreen(dir, nav1());
		expect(fs.existsSync(path.join(dir, 'map-L.svg'))).toBe(false);
		expect(fs.existsSync(path.join(dir, 'fields.mdx'))).toBe(true);
	});

	it('writes the map of a map page and lists its side, and deletes the other stale map', async () => {
		const dir = copyFixture('');
		fs.writeFileSync(path.join(dir, 'map-R.svg'), '<svg/>');
		await generateScreen(dir, nav1({title: 'NAV 5 page', steps: u => u.panel.selectPage('L', 'NAV 5'), fields: []}));
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.maps).toEqual(['L']);
		const svg = fs.readFileSync(path.join(dir, 'map-L.svg'), 'utf8');
		expect(svg).toContain('viewBox="0 0 99 78"');
		// The aircraft symbol is at the center of the map (49, 39)
		const runs = Array.from(svg.matchAll(/M(\d+) (\d+)h/g), m => [Number(m[1]), Number(m[2])]);
		expect(runs.some(([x, y]) => Math.abs(x - 49) <= 4 && Math.abs(y - 39) <= 4)).toBe(true);
		expect(fs.existsSync(path.join(dir, 'map-R.svg'))).toBe(false);
	});

	it('writes no map for a half the manual does not show', async () => {
		const dir = copyFixture('');
		await generateScreen(dir, nav1({show: 'right', steps: u => u.panel.selectPage('L', 'NAV 5'), fields: []}));
		expect(parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8')).maps).toEqual([]);
		expect(fs.existsSync(path.join(dir, 'map-L.svg'))).toBe(false);
	});

	it('rejects an explanation that a field lacks, naming the screen', async () => {
		const dir = copyFixture('<Field id="page" title="Page">x</Field>');
		await expect(generateScreen(dir, nav1())).rejects.toThrow(/^screen nav-1-smoke: .*no explanation: dis/);
		expect(fs.existsSync(path.join(dir, 'screen.txt'))).toBe(false);
	});

	it('rejects a missing fields.mdx and lists the ids it needs', async () => {
		const dir = copyFixture();
		fs.rmSync(path.join(dir, 'fields.mdx'));
		await expect(generateScreen(dir, nav1())).rejects.toThrow('fields.mdx is missing; it needs a <Field> for: page, dis');
	});

	it('names the screen and the field when a field matches nothing', async () => {
		const dir = copyFixture();
		const d = nav1({fields: [{id: 'page', find: {area: 'S', row: 0, from: 0, to: 5}}, {id: 'dis', find: /NOWHERE/}]});
		await expect(generateScreen(dir, d)).rejects.toThrow(/^screen nav-1-smoke: field dis: .*matches nothing/);
	});

	it('rejects a folder name that is not a screen id', async () => {
		const dir = path.join(copyFixture(), '..', 'Not_An_Id');
		fs.mkdirSync(dir);
		await expect(generateScreen(dir, nav1())).rejects.toThrow(/screen Not_An_Id: .*\[a-z0-9-\]/);
	});

	it('requires show both for a full page', async () => {
		const dir = copyFixture();
		const d = nav1({steps: u => u.panel.msg(), fields: []});
		await expect(generateScreen(dir, d)).rejects.toThrow(/^screen nav-1-smoke: .*full.*show both/);
	});

	it('writes a full page with show both', async () => {
		const dir = copyFixture('');
		await generateScreen(dir, nav1({show: 'both', steps: u => u.panel.msg(), fields: [], keepMessages: true}));
		expect(parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8')).layout).toBe('full');
	});
});
