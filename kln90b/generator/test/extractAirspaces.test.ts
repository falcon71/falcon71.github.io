import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {SITE} from '../lib/paths.ts';
import {extractAirspaces, serialize, summary} from '../navdata/extract-airspaces.mjs';

const FIXTURES = path.join(SITE, 'generator', 'test', 'fixtures', 'airspaces');
const CLASS_FILE = path.join(FIXTURES, 'Class_Airspace.geojson');
const BOUNDARY_FILE = path.join(FIXTURES, 'Airspace_Boundary.geojson');
const SEATTLE = {name: 'seattle', lat: 47.4490, lon: -122.3093, radiusNm: 250};
const DATE = '2026-10-22';

const temps: string[] = [];
afterEach(() => {
	for (const dir of temps.splice(0)) rmSync(dir, {recursive: true, force: true});
});

const run = (stats = {}) => extractAirspaces(CLASS_FILE, BOUNDARY_FILE, [SEATTLE], DATE, stats);
const named = (result: Awaited<ReturnType<typeof run>>, name: string, sector?: string) =>
	result.airspaces.filter(a => a.name === name && (sector === undefined || a.sector === sector));

describe('extractAirspaces', () => {
	it('keeps the class B shelves and the class C of the region and the low altitude Center, and nothing else', async () => {
		const result = await run();
		expect(result.date).toBe(DATE);
		expect(result.airspaces.map(a => `${a.kind} ${a.name} ${a.sector ?? '-'}`)).toEqual([
			'B SEATTLE CLASS B AREA A',
			'B SEATTLE CLASS B AREA B',
			'B TEST HOLE CLASS B HOLE',
			'B TEST MULTI CLASS B MULTI',
			'B TEST MULTI CLASS B MULTI',
			'C PORTLAND INTERNATIONAL AIRPORT CLASS C -',
			'center SEATTLE -',
		]);
		const center = result.airspaces.find(a => a.kind === 'center')!;
		expect(center.ident).toBe('ZSE');
		// not Atlanta, not the Mode C veil, not the high altitude Center, not Vancouver's control zone
		expect(/ATLANTA|MODE C|VANCOUVER/.test(result.airspaces.map(a => a.name).join('|'))).toBe(false);
		expect(result.airspaces.filter(a => a.kind === 'center')).toHaveLength(1);
	});

	it('reads the limits of the shelves', async () => {
		const result = await run();
		expect(named(result, 'SEATTLE CLASS B', 'AREA A')[0]).toMatchObject({
			kind: 'B', ident: 'SEA', lowerFt: 0, lowerRef: 'SFC', upperFt: 10000, upperRef: 'MSL',
		});
		expect(named(result, 'SEATTLE CLASS B', 'AREA B')[0]).toMatchObject({
			lowerFt: 1100, lowerRef: 'MSL', upperFt: 10000, upperRef: 'MSL',
		});
		expect(named(result, 'PORTLAND INTERNATIONAL AIRPORT CLASS C')[0]).toMatchObject({
			kind: 'C', ident: 'PDX', lowerFt: 0, lowerRef: 'SFC', upperFt: 4000, upperRef: 'MSL',
		});
	});

	it('gives a Center no upper limit and a lower limit at the surface', async () => {
		const center = (await run()).airspaces.find(a => a.kind === 'center')!;
		expect(center).toMatchObject({lowerFt: 0, lowerRef: 'SFC', upperFt: null, upperRef: null});
		expect('sector' in center).toBe(false);
	});

	it('writes the outer ring as latitude and longitude, rounded to five decimals and not closed', async () => {
		const polygon = named(await run(), 'SEATTLE CLASS B', 'AREA A')[0].polygon;
		expect(polygon[0]).toEqual([47.33545, -122.30707]);
		// the last vertex of the ring in the data repeats the first, the one before it does not
		expect(polygon[polygon.length - 1]).toEqual([47.33543, -122.30963]);
		expect(polygon[polygon.length - 1][0] === polygon[0][0] && polygon[polygon.length - 1][1] === polygon[0][1]).toBe(false);
	});

	it('makes one airspace of a polygon with a hole, from its outer ring only', async () => {
		const result = await run();
		const holed = named(result, 'TEST HOLE CLASS B');
		expect(holed).toHaveLength(1);
		// the hole is a square of five vertices and a closed ring; the outer ring is that of area A
		expect(holed[0].polygon).toEqual(named(result, 'SEATTLE CLASS B', 'AREA A')[0].polygon);
	});

	it('makes one airspace of each part of a multipolygon', async () => {
		const parts = named(await run(), 'TEST MULTI CLASS B');
		expect(parts).toHaveLength(2);
		const area = named(await run(), 'SEATTLE CLASS B', 'AREA A')[0].polygon;
		const shifted = area.map(([lat, lon]) => [lat, Math.round((lon + 0.5) * 1e5) / 1e5]);
		expect(parts.map(p => p.polygon)).toEqual(expect.arrayContaining([area, shifted]));
		expect(parts[0]).toMatchObject({lowerFt: 0, lowerRef: 'SFC', upperFt: 10000, upperRef: 'MSL'});
	});

	it('counts what it kept per kind', async () => {
		const stats: any = {};
		await run(stats);
		expect(stats.counts).toEqual({B: 5, C: 1, center: 1});
	});

	it('skips a feature with a limit it does not read, and counts it with the reason', async () => {
		const stats: any = {};
		const result = await run(stats);
		// the lower limit of one shelf is in meters, the upper limit code of another is unknown
		expect(stats.skipped).toMatchObject({
			'class B airspace with a lower limit the script does not read (LOWER_VAL 0, LOWER_UOM M, LOWER_CODE SFC)': 1,
			'class B airspace with an upper limit the script does not read (UPPER_VAL 10000, UPPER_UOM FT, UPPER_CODE XXX)': 1,
		});
		expect(result.airspaces.filter(a => a.sector === 'BADLOWER' || a.sector === 'BADUPPER')).toEqual([]);
	});

	it('skips a feature that has no polygon, and a ring that has no area, and counts them', async () => {
		const stats: any = {};
		const result = await run(stats);
		// no geometry at all, a line string, and a ring of two vertices
		expect(stats.skipped).toMatchObject({
			'class B airspace with a geometry that is not a polygon or a multipolygon': 2,
			'class B airspace with a ring of fewer than three vertices': 1,
		});
		expect(Object.keys(stats.skipped)).toHaveLength(4);
		expect(result.airspaces.filter(a => ['NOGEOMETRY', 'LINE', 'THINRING'].includes(a.sector ?? ''))).toEqual([]);
	});

	it('counts a feature that is no polygon wherever it is, and does not count one that lies outside every region', async () => {
		const stats: any = {};
		const nowhere = {name: 'nowhere', lat: 0, lon: 0, radiusNm: 10};
		await extractAirspaces(CLASS_FILE, BOUNDARY_FILE, [nowhere], DATE, stats);
		// the features without a polygon cannot say where they lie; the ones with unreadable limits lie in Seattle
		expect(stats.skipped).toEqual({
			'class B airspace with a geometry that is not a polygon or a multipolygon': 2,
			'class B airspace with a ring of fewer than three vertices': 1,
		});
	});

	it('stops with the file named when a file has no feature line', async () => {
		const dir = mkdtempSync(path.join(os.tmpdir(), 'airspaces-fixture-'));
		temps.push(dir);
		const empty = path.join(dir, 'Reformatted.geojson');
		writeFileSync(empty, '{ "type": "FeatureCollection",\n"features": [\n{ "type": "Feature", "properties": {} }\n]\n}\n');
		await expect(extractAirspaces(empty, BOUNDARY_FILE, [SEATTLE], DATE)).rejects.toThrow(/Reformatted\.geojson: no feature lines/);
		await expect(extractAirspaces(CLASS_FILE, empty, [SEATTLE], DATE)).rejects.toThrow(/Reformatted\.geojson: no feature lines/);
	});

	it('leaves out what lies outside every region', async () => {
		const nowhere = {name: 'nowhere', lat: 0, lon: 0, radiusNm: 10};
		const result = await extractAirspaces(CLASS_FILE, BOUNDARY_FILE, [nowhere], DATE);
		expect(result.airspaces).toEqual([]);
	});

	it('takes a feature whose ring surrounds the center of a region without a vertex near it', async () => {
		// no vertex of the Center lies within a mile of central Washington, but its ring contains it
		const inside = {name: 'inside', lat: 47.0, lon: -120.0, radiusNm: 1};
		const result = await extractAirspaces(CLASS_FILE, BOUNDARY_FILE, [inside], DATE);
		expect(result.airspaces.map(a => a.kind)).toEqual(['center']);
	});

	it('gives the same output when the files are read with CRLF line endings', async () => {
		const dir = mkdtempSync(path.join(os.tmpdir(), 'airspaces-fixture-'));
		temps.push(dir);
		const crlf = (source: string) => {
			const file = path.join(dir, path.basename(source));
			writeFileSync(file, readFileSync(source, 'utf8').replace(/\n/g, '\r\n'));
			return file;
		};
		const converted = await extractAirspaces(crlf(CLASS_FILE), crlf(BOUNDARY_FILE), [SEATTLE], DATE);
		expect(readFileSync(path.join(dir, 'Class_Airspace.geojson'), 'utf8')).toContain('\r\n');
		expect(serialize(converted)).toBe(serialize(await run()));
	});
});

describe('summary', () => {
	it('prints the counts and every skip with its reason, sorted by reason', async () => {
		const stats: any = {};
		const result = await run(stats);
		expect(summary('out.json', result, stats)).toBe([
			'Wrote out.json',
			'Date 2026-10-22',
			'Class B airspaces 5',
			'Class C airspaces 1',
			'Centers 1',
			'Skipped:',
			'  2 class B airspace with a geometry that is not a polygon or a multipolygon',
			'  1 class B airspace with a lower limit the script does not read (LOWER_VAL 0, LOWER_UOM M, LOWER_CODE SFC)',
			'  1 class B airspace with a ring of fewer than three vertices',
			'  1 class B airspace with an upper limit the script does not read (UPPER_VAL 10000, UPPER_UOM FT, UPPER_CODE XXX)',
		].join('\n'));
	});

	it('says that nothing was skipped', () => {
		const stats = {counts: {B: 0, C: 0, center: 0}, skipped: {}};
		expect(summary('out.json', {date: DATE, source: '', airspaces: []}, stats)).toMatch(/\nNothing skipped$/);
	});
});

describe('serialize', () => {
	it('indents the extract and ends it with a newline', async () => {
		const text = serialize(await run());
		expect(text.endsWith('}\n')).toBe(true);
		expect(JSON.parse(text)).toEqual(await run());
		expect(text).toContain('\n        [47.33545, -122.30707],\n');
		expect(text).toContain('\n      "name": "SEATTLE CLASS B",\n');
	});
});
