import {cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {SITE} from '../lib/paths.ts';
import {extract, parseCsv, serialize} from '../navdata/extract-nasr.mjs';

const FIXTURE = path.join(SITE, 'generator', 'test', 'fixtures', 'nasr');
const SEATTLE = {name: 'seattle', lat: 47.4490, lon: -122.3093, radiusNm: 250};
const MIAMI = {name: 'miami', lat: 25.79, lon: -80.29, radiusNm: 50};

const temps: string[] = [];
afterEach(() => {
	for (const dir of temps.splice(0)) rmSync(dir, {recursive: true, force: true});
});

/** A copy of the fixture folder, so that a test can damage a file. */
function copyFixture(): string {
	const dir = mkdtempSync(path.join(os.tmpdir(), 'nasr-fixture-'));
	temps.push(dir);
	cpSync(FIXTURE, dir, {recursive: true});
	return dir;
}

function edit(dir: string, file: string, change: (text: string) => string): void {
	const text = readFileSync(path.join(dir, file), 'utf8');
	const changed = change(text);
	expect(changed === text).toBe(false);
	writeFileSync(path.join(dir, file), changed);
}

describe('parseCsv', () => {
	it('keys the rows by the header and reads quoted commas and escaped quotes', () => {
		const rows = parseCsv('"A","B","C"\n"x, y","say ""hi""",3\n');
		expect(rows).toEqual([{A: 'x, y', B: 'say "hi"', C: '3'}]);
	});

	it('reads CRLF, line breaks inside quotes, empty fields and a missing final line break', () => {
		const rows = parseCsv('A,B,C\r\n"one\r\ntwo",,3\r\n\r\nx,y,z');
		expect(rows).toEqual([{A: 'one\r\ntwo', B: '', C: '3'}, {A: 'x', B: 'y', C: 'z'}]);
	});

	it('ignores a byte order mark and has no rows for a header alone', () => {
		expect(parseCsv('﻿A,B\n')).toEqual([]);
		expect(parseCsv('﻿A,B\n1,2')).toEqual([{A: '1', B: '2'}]);
	});

	it('does not treat a quote inside an unquoted field as the start of a quoted one', () => {
		expect(parseCsv('A,B\nsay "hi",2')).toEqual([{A: 'say "hi"', B: '2'}]);
	});
});

describe('extract', () => {
	const stats: any = {};
	const result = extract(FIXTURE, [SEATTLE], stats);
	const airport = (ident: string) => result.airports.find((a: any) => a.ident === ident)!;
	const vor = (ident: string) => result.vors.find((v: any) => v.ident === ident)!;

	it('names the cycle from the data', () => {
		expect(result.cycle).toBe('2026-10-01');
		expect(result.source).toBe('FAA NASR 28-day subscription (CSV), effective 2026-10-01');
		expect(result.regions).toEqual([SEATTLE]);
	});

	it('keeps public airports and heliports inside a region only', () => {
		expect(result.airports.map((a: any) => a.ident)).toEqual(['HEL1', 'SEA', 'SML']);
	});

	it('leaves out private airports, seaplane bases and airports outside the region', () => {
		const idents = result.airports.map((a: any) => a.ident);
		expect(idents.includes('PRV1')).toBe(false);
		expect(idents.includes('SPB1')).toBe(false);
		expect(idents.includes('MIA')).toBe(false);
	});

	it('includes what lies around any of the regions', () => {
		const both = extract(FIXTURE, [{...SEATTLE, radiusNm: 20}, MIAMI]);
		expect(both.airports.map((a: any) => a.ident)).toEqual(['HEL1', 'MIA', 'SEA']);
		expect(both.vors.map((v: any) => v.ident)).toContain('MIA');
	});

	it('reads the airport record', () => {
		expect(airport('SEA')).toMatchObject({
			name: 'SEATTLE-TACOMA INTL', city: 'SEATTLE', lat: 47.449, lon: -122.3093, elevationFt: 432.7,
			towered: true, heliport: false,
		});
		expect(airport('SML')).toMatchObject({name: 'SMALLTON, "THE FIELD" MUNI', towered: false});
		expect(airport('HEL1')).toMatchObject({heliport: true, towered: false});
	});

	it('names a runway as published, headed by the lower-numbered end, at the midpoint of its ends', () => {
		const sea = airport('SEA');
		expect(sea.runways.map((r: any) => r.designation)).toEqual(['16C-34C', '16L-34R']);
		const runway = sea.runways.find((r: any) => r.designation === '16L-34R')!;
		// the 34R end is listed first in the file, the heading is the one of 16L
		expect(runway.headingTrue).toBe(179);
		expect(runway.lat).toBeCloseTo(47.445, 6);
		expect(runway.lon).toBeCloseTo(-122.3076, 6);
		expect(runway).toMatchObject({lengthFt: 11901, surface: 'ASPH-G', lit: true});
		expect(sea.runways.find((r: any) => r.designation === '16C-34C')).toMatchObject({lit: false, surface: 'CONC'});
	});

	it('takes the midpoint along the great circle, not the average of the coordinates', () => {
		const dir = copyFixture();
		edit(dir, 'APT_RWY_END.csv', text => text
			.replace('"16L",179,47.46,-122.3076', '"16L",179,47.46,-122.4076')
			.replace('"34R",359,47.43,-122.3076', '"34R",359,47.43,-122.2076'));
		const runway = extract(dir, [SEATTLE]).airports.find((a: any) => a.ident === 'SEA')!.runways
			.find((r: any) => r.designation === '16L-34R')!;
		expect(runway.lon).toBeCloseTo(-122.3076, 3);
		// the great circle bulges toward the pole: further north than the plain average of 47.445
		expect(runway.lat).toBeGreaterThan(47.445);
		expect(runway.lat).toBeCloseTo(47.445, 3);
	});

	it('finds a missing alignment from the end positions and a missing position from what is known', () => {
		const small = airport('SML');
		// 18/36 has no alignment: from the end positions, 18 lies north of 36, so its bearing to 36 is south
		expect(small.runways.find((r: any) => r.designation === '18-36')).toMatchObject({headingTrue: 180, lit: true});
		// 09/27 has neither: the designation 09 and the airport's variation of 20 E
		const noInfo = small.runways.find((r: any) => r.designation === '09-27')!;
		expect(noInfo.headingTrue).toBe(110);
		expect(noInfo).toMatchObject({lat: 47.9, lon: -122, lit: false});
	});

	it('reads the heading of a water runway without alignment from its designation', () => {
		const dir = copyFixture();
		for (const file of ['APT_RWY.csv', 'APT_RWY_END.csv']) edit(dir, file, text => text.replace(/"09\/27"/g, '"09W/27W"').replace('"09",', '"09W",').replace('"27",', '"27W",'));
		const runway = extract(dir, [SEATTLE]).airports.find((a: any) => a.ident === 'SML')!.runways
			.find((r: any) => r.designation === '09W-27W')!;
		expect(runway.headingTrue).toBe(110);
	});

	it('keeps a heliport with its helipad runways', () => {
		const heliport = airport('HEL1');
		expect(heliport.runways).toHaveLength(1);
		expect(heliport.runways[0]).toMatchObject({designation: 'H1', lit: true});
	});

	it('attaches the frequencies of the airport once, sorted by use then frequency', () => {
		expect(airport('SEA').frequencies).toEqual([
			{use: 'APCH/P DEP/P', mhz: 119.2},
			{use: 'D-ATIS', mhz: 118},
			{use: 'GND/P', mhz: 121.7},
			{use: 'LCL/P', mhz: 119.9},
		]);
		expect(airport('SML').frequencies).toEqual([{use: 'CTAF', mhz: 122.9}]);
		// a heliport of that identifier is a different facility
		expect(airport('HEL1').frequencies).toEqual([]);
	});

	it('takes VORs of the three types and NDBs of both types, operational only', () => {
		expect(result.vors.map((v: any) => v.ident)).toEqual(['PAE', 'SEA', 'WW', 'YVR']);
		expect(result.ndbs.map((n: any) => n.ident)).toEqual(['KE', 'MK']);
	});

	it('reads the navaid records', () => {
		expect(vor('SEA')).toEqual({
			ident: 'SEA', name: 'SEATTLE', type: 'VORTAC', lat: 47.43537316, lon: -122.30961611, mhz: 116.8,
			declinationEast: 20, region: 'K1',
		});
		expect(vor('PAE').type).toBe('VOR/DME');
		expect(result.ndbs.find((n: any) => n.ident === 'KE')).toEqual({
			ident: 'KE', name: 'KENT', lat: 47.4, lon: -122.2, khz: 390, region: 'K1',
		});
	});

	it('reads east variation as positive, west as negative and a missing one as zero', () => {
		const miami = extract(FIXTURE, [MIAMI]);
		expect(miami.vors.find((v: any) => v.ident === 'MIA')!.declinationEast).toBe(-6);
		expect(vor('SEA').declinationEast).toBe(20);
		expect(vor('WW').declinationEast).toBe(0);
	});

	it('takes the region from the fixes of the ARTCC where the record has none, and K1 where there are none', () => {
		// ZSE has fixes of K1 (most) and K2 (one, outside the region)
		expect(vor('PAE').region).toBe('K1');
		// YVR has no ARTCC
		expect(vor('YVR').region).toBe('K1');
		// ZMA has only K7
		expect(extract(FIXTURE, [MIAMI]).vors.find((v: any) => v.ident === 'MIA')!.region).toBe('K7');
	});

	it('keeps the fixes inside a region with their own region, or the one of the ARTCC', () => {
		expect(result.fixes).toEqual([
			{ident: 'AAAAA', lat: 47.6, lon: -122.5, region: 'K1'},
			{ident: 'BUBBA', lat: 47.5, lon: -122.4, region: 'K1'},
			{ident: 'NOART', lat: 47.8, lon: -122.7, region: 'K1'},
			{ident: 'NOREG', lat: 47.7, lon: -122.6, region: 'K1'},
		]);
	});

	it('counts what it derived and what it could not use', () => {
		expect(stats).toMatchObject({
			counts: {airports: 3, vors: 4, ndbs: 2, fixes: 4},
			// the VORs PAE, SEA, WW, the NDBs KE, MK and the fix NOREG
			regionsFromArtcc: 6,
			// the VOR YVR and the fix NOART
			regionsDefaulted: 2,
		});
		expect(stats.skipped).toMatchObject({
			'VOR without magnetic variation (set to 0)': 1,
			'airport frequency that is not a plain number': 1,
		});
	});

	it('writes the same text for the same data, two-space indented', () => {
		const text = serialize(result);
		expect(text).toBe(serialize(extract(FIXTURE, [SEATTLE])));
		expect(text.startsWith('{\n  "cycle": "2026-10-01",\n')).toBe(true);
		expect(text.endsWith('}\n')).toBe(true);
	});

	it('sorts records by ident regardless of the order in the files', () => {
		const dir = copyFixture();
		edit(dir, 'FIX_BASE.csv', text => {
			const lines = text.trim().split('\n');
			return [lines[0], ...lines.slice(1).reverse()].join('\n');
		});
		expect(extract(dir, [SEATTLE]).fixes.map((f: any) => f.ident)).toEqual(['AAAAA', 'BUBBA', 'NOART', 'NOREG']);
	});

	it('names the file and every missing column', () => {
		const dir = copyFixture();
		edit(dir, 'NAV_BASE.csv', text => text.replace('"MAG_VARN",', '').replace('"MAG_VARN_HEMIS",', ''));
		expect(() => extract(dir, [SEATTLE])).toThrow('NAV_BASE.csv: missing columns MAG_VARN, MAG_VARN_HEMIS');
	});

	it('names a missing column of another file', () => {
		const dir = copyFixture();
		edit(dir, 'APT_RWY_END.csv', text => text.replace('"TRUE_ALIGNMENT",', ''));
		expect(() => extract(dir, [SEATTLE])).toThrow('APT_RWY_END.csv: missing column TRUE_ALIGNMENT');
	});

	it('names a missing file', () => {
		const dir = copyFixture();
		rmSync(path.join(dir, 'FRQ.csv'));
		expect(() => extract(dir, [SEATTLE])).toThrow('FRQ.csv: not found');
	});

	it('refuses files of different cycles', () => {
		const dir = copyFixture();
		edit(dir, 'FIX_BASE.csv', text => text.replace(/2026\/10\/01/g, '2026/09/03'));
		expect(() => extract(dir, [SEATTLE])).toThrow('FIX_BASE.csv: effective date 2026-09-03 differs from 2026-10-01');
	});
});
