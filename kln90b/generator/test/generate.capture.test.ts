import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {generateScreen, type ScreenDescription} from '../lib/generate.ts';
import {adjustCourseIndicator} from '../api.ts';
import {facility, place} from '../lib/navdata.ts';
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
		expect(file.maps).toEqual([]);
	});

	it('starts the unit at its last position, so that no start-up message is pending', async () => {
		const dir = copyFixture();
		await generateScreen(dir, nav1());
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.text[6].includes('msg')).toBe(false);
		expect(file.text[6].slice(0, 5)).toBe('NAV 1');
	});

	it('keeps the last position a screen stores itself, which stages the message of a moved unit', async () => {
		const dir = copyFixture();
		await generateScreen(dir, nav1({
			boot: {position: {lat: 47.45, lon: -122.31}, storage: {lastLatitude: 0, lastLongitude: 0}}, keepMessages: true,
		}));
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.text[6]).toContain('msg');
		expect(file.mask[6].slice(14, 17).join('')).toBe('FFF');
	});

	it('rejects a screen whose steps leave a message pending, unless keepMessages', async () => {
		// Activating the flight plan raises a message of its own; the unit started at its last position and raised none
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

	// NAV 5 without a flight plan or Direct To draws only the aircraft
	const AIRCRAFT_MDX = '<Field id="aircraft" title="Aircraft">x</Field>';
	const nav5 = (overrides: Partial<ScreenDescription> = {}) => nav1({
		title: 'NAV 5 page', steps: u => u.panel.selectPage('L', 'NAV 5'),
		fields: [{id: 'aircraft', find: {map: 'L', draw: /^icon \$ /}}], ...overrides,
	});

	it('writes the map of a map page and lists its side, and deletes the other stale map', async () => {
		const dir = copyFixture(AIRCRAFT_MDX);
		fs.writeFileSync(path.join(dir, 'map-R.svg'), '<svg/>');
		await generateScreen(dir, nav5());
		const file = parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8'));
		expect(file.maps).toEqual(['L']);
		const svg = fs.readFileSync(path.join(dir, 'map-L.svg'), 'utf8');
		expect(svg).toContain('viewBox="0 0 99 78"');
		// The aircraft symbol is at the center of the map (49, 39)
		const runs = Array.from(svg.matchAll(/M(\d+) (\d+)h/g), m => [Number(m[1]), Number(m[2])]);
		expect(runs.some(([x, y]) => Math.abs(x - 49) <= 4 && Math.abs(y - 39) <= 4)).toBe(true);
		expect(fs.existsSync(path.join(dir, 'map-R.svg'))).toBe(false);
	});

	it('writes the map fields and one group per element with its field', async () => {
		const dir = copyFixture(AIRCRAFT_MDX);
		await generateScreen(dir, nav5());
		const text = fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8');
		expect(parseScreenFile(text).mapFields).toEqual(new Map([['aircraft', 'L']]));
		expect(text).toContain('\nmapfield aircraft L\nmap L\n');
		const svg = fs.readFileSync(path.join(dir, 'map-L.svg'), 'utf8');
		const groups = Array.from(svg.matchAll(/<g data-field="([^"]*)" data-draw="([^"]*)" data-box="(\d+) (\d+) (\d+) (\d+)">/g));
		expect(groups.map(g => g[1])).toEqual(['aircraft']);
		expect(groups[0][2]).toMatch(/^icon \$ 47\.4500,-122\.3100$/);
		const [x, y, w, h] = groups[0].slice(3).map(Number);
		expect(Math.abs(x + w / 2 - 49.5) <= 1 && Math.abs(y + h / 2 - 39.5) <= 1).toBe(true);
	});

	it('fails on a map element that belongs to no field, naming the screen and the element', async () => {
		const dir = copyFixture('');
		await expect(generateScreen(dir, nav5({fields: []})))
			.rejects.toThrow(/^screen nav-1-smoke: the element "icon \$ 47\.4500,-122\.3100" of map L belongs to no field$/);
		expect(fs.existsSync(path.join(dir, 'screen.txt'))).toBe(false);
		expect(fs.existsSync(path.join(dir, 'map-L.svg'))).toBe(false);
	});

	it('requires an explanation of a map field', async () => {
		const dir = copyFixture('');
		await expect(generateScreen(dir, nav5())).rejects.toThrow(/^screen nav-1-smoke: .*no explanation: aircraft/);
	});

	it('records a map that draws only once, when its page opens (APT 3)', async () => {
		const dir = copyFixture('<Field id="runways" title="Runways">x</Field>');
		await generateScreen(dir, nav1({
			title: 'APT 3 page', show: 'right', boot: {position: place('KSEA')},
			steps: async u => {
				await u.panel.selectPage('R', 'APT 1');
				await u.panel.cursor('R');
				await u.panel.enterIdent('R', 'KSEA');
				await u.panel.cursor('R');
				await u.panel.selectPage('R', 'APT 3');
			},
			fields: [{id: 'runways', find: {map: 'R', draw: /^(plain|label) /, many: true}}],
		}));
		expect(parseScreenFile(fs.readFileSync(path.join(dir, 'screen.txt'), 'utf8')).mapFields).toEqual(new Map([['runways', 'R']]));
		const draws = Array.from(fs.readFileSync(path.join(dir, 'map-R.svg'), 'utf8').matchAll(/data-draw="([^"]*)"/g), m => m[1]);
		// KSEA's three parallel runways: one line each, and the designator at each end
		expect(draws.filter(d => d.startsWith('plain '))).toHaveLength(3);
		expect(draws.filter(d => d.startsWith('label ')).map(d => d.split(' ')[1]).sort()).toEqual(['16C', '16L', '16R', '34C', '34L', '34R']);
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
