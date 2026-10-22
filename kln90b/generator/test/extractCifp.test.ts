import {readFileSync} from 'node:fs';
import path from 'node:path';
import {describe, expect, it} from 'vitest';
import type {NavdataExtract} from '../lib/navdata.ts';
import {SITE} from '../lib/paths.ts';
import {extractCifp, parseRecord, serialize} from '../navdata/extract-cifp.mjs';

const FIXTURE = path.join(SITE, 'generator', 'test', 'fixtures', 'cifp', 'FAACIFP18');
const CIFP = readFileSync(FIXTURE, 'utf8');
const line = (start: string) => CIFP.split('\n').find(l => l.startsWith(start))!;

const runway = (designation: string) => ({designation, headingTrue: 0, lengthFt: 5000, surface: 'ASPH', lit: true, lat: 0, lon: 0});
const airport = (ident: string, runways: string[]) => ({
	ident, faaId: ident.slice(1), name: ident, city: '', lat: 0, lon: 0, elevationFt: 0, towered: true, heliport: false,
	runways: runways.map(runway), frequencies: [],
});
const point = (ident: string) => ({ident, lat: 0, lon: 0, region: 'K1'});

/**
 * A NASR extract with what the fixture's procedures use inside the region: not LMT and OED, which lie outside it, and
 * of the terminal waypoints only DUANE, which NASR files as a fix.
 */
function nasr(): NavdataExtract {
	return {
		cycle: '2026-10-01',
		airports: [airport('KAWO', ['11-29', '16-34']), airport('KBFI', ['14L-32R', '14R-32L']),
			airport('KHIO', ['02-20', '13L-31R', '13R-31L']), airport('KYKM', ['04-22', '09-27'])],
		vors: ['BTG', 'PAE', 'PDT', 'UBG', 'YKM'].map(ident => ({...point(ident), name: ident, type: 'VORTAC', mhz: 116, declinationEast: 0})),
		ndbs: ['AW', 'PND'].map(ident => ({...point(ident), name: ident, khz: 356})),
		fixes: ['ARVAD', 'AUBRN', 'BRUKK', 'CHINS', 'CIDOG', 'CIDUG', 'DEDBE', 'DIGGN', 'DUANE', 'FAVDU', 'HUMPP', 'LOFAL',
			'MARRK', 'MOXEE', 'OCITY', 'PORTL', 'RADDY', 'SELAH', 'SUNED', 'TAGOR', 'TITON', 'USDAW', 'VAMPS', 'VANTZ', 'WIKIK',
			'WOODI'].map(point),
		centers: [],
	};
}

const fix = (ident: string) => ({ident, region: 'K1', kind: 'fix'});
const vor = (ident: string) => ({ident, region: 'K1', kind: 'vor'});

describe('parseRecord', () => {
	it('reads the RNAV levels of an approach continuation record, and no leg from it', () => {
		const continuation = line('SUSAP KBFIK1FR32LY R      020DUANEK1PC2');
		expect(continuation.slice(38, 40)).toBe('2W');
		expect(parseRecord(continuation)).toEqual({
			type: 'rnav', airport: 'KBFI', procedure: 'R32LY', routeType: 'R', transition: '',
			levels: ['LPV', 'LNAV/VNAV', 'LNAV'],
		});
		// the RNP AR continuation of H32LZ publishes no levels in these columns
		expect(parseRecord(line('SUSAP KBFIK1FH32LZ H      020DUANEK1PC2'))).toMatchObject({type: 'rnav', levels: []});
	});

	it('returns null for a continuation record of another application', () => {
		const continuation = line('SUSAP KBFIK1FR32LY R      020DUANEK1PC2');
		expect(parseRecord(continuation.slice(0, 39) + 'L' + continuation.slice(40))).toBeNull();
	});

	it('reads a procedure leg', () => {
		expect(parseRecord(line('SUSAP KBFIK1FR32LY R      030RW32L'))).toEqual({
			type: 'leg', airport: 'KBFI', subsection: 'F', procedure: 'R32LY', routeType: 'R', transition: '',
			fix: {ident: 'RW32L', region: 'K1', section: 'PG'}, description: 'GY M', turn: ' ', pathTerminator: 'TF',
		});
		expect(parseRecord(line('SUSAP KYKMK1FI27   ACIDOG 020'))).toEqual({
			type: 'leg', airport: 'KYKM', subsection: 'F', procedure: 'I27', routeType: 'A', transition: 'CIDOG',
			fix: {ident: 'FITIM', region: 'K1', section: 'PC'}, description: 'E   ', turn: 'R', pathTerminator: 'AF',
			navaid: {ident: 'YKM', region: 'K1', section: 'D '}, thetaDeg: 75, rhoNm: 13, courseMag: 337.8,
		});
	});

	it('reads the position of a terminal waypoint and of a VOR', () => {
		expect(parseRecord(line('SUSAP KBFIK1CDUANE'))).toEqual({
			type: 'point', section: 'PC', airport: 'KBFI', ident: 'DUANE', region: 'K1', lat: 47.442875, lon: -122.22891944,
		});
		expect(parseRecord(line('SUSAD        LMT '))).toEqual({
			type: 'point', section: 'D ', ident: 'LMT', region: 'K1', lat: 42.15314167, lon: -121.72752778,
			name: 'KLAMATH FALLS', vorType: 'VORTAC', mhz: 115.9, declinationEast: 17,
		});
	});

	it('reads the position of an NDB and of a terminal NDB', () => {
		expect(parseRecord(line('SUSADB       PND '))).toEqual({
			type: 'point', section: 'DB', ident: 'PND', region: 'K1', lat: 45.63026944, lon: -123.04581111, name: 'BANKS', khz: 356,
		});
		expect(parseRecord(line('SUSAPNKAWOK1 AW '))).toEqual({
			type: 'point', section: 'PN', airport: 'KAWO', ident: 'AW', region: 'K1', lat: 48.07611944, lon: -122.15391111,
			name: 'WATON', khz: 382,
		});
	});

	it('reads the type of a VOR from its class and a declination west as negative', () => {
		const lmt = line('SUSAD        LMT ');
		const changed = (type: string, decl: string) => parseRecord(lmt.slice(0, 28) + type + lmt.slice(29, 74) + decl + lmt.slice(79));
		expect(changed('D', 'W0040')).toMatchObject({vorType: 'VOR/DME', declinationEast: -4});
		expect(changed(' ', 'E0000')).toMatchObject({vorType: 'VOR', declinationEast: 0});
		expect(changed('X', 'T0000')).toMatchObject({vorType: null, declinationEast: null});
	});

	it('reads the cycle from the header', () => {
		expect(parseRecord(line('HDR01'))).toEqual({type: 'header', cycle: '2610'});
	});
});

describe('extractCifp', () => {
	const stats: any = {};
	const result = extractCifp(CIFP, nasr(), stats);
	const airportOf = (ident: string) => result.airports.find((a: any) => a.ident === ident)!;
	const waypoint = (ident: string) => result.waypoints.find((w: any) => w.ident === ident);

	it('names the cycle from the header', () => {
		expect(result.cycle).toBe('2610');
		expect(result.source).toBe('FAA CIFP (FAACIFP18), cycle 2610');
	});

	it('takes the airports of the NASR extract that have procedures in the CIFP', () => {
		expect(result.airports.map((a: any) => a.ident)).toEqual(['KAWO', 'KBFI', 'KHIO', 'KYKM']);
		const withoutHillsboro = nasr();
		withoutHillsboro.airports = withoutHillsboro.airports.filter(a => a.ident !== 'KHIO');
		expect(extractCifp(CIFP, withoutHillsboro).airports.map((a: any) => a.ident)).toEqual(['KAWO', 'KBFI', 'KYKM']);
	});

	it('reads YKM7 at KYKM: runway transitions and the common route, no en route transitions', () => {
		const departures = airportOf('KYKM').departures;
		expect(departures.map((d: any) => d.name)).toEqual(['YKM7']);
		const ykm7 = departures[0];
		expect(ykm7.runways).toEqual([
			{runway: '09', legs: [{type: 'CA', courseMag: 94}, {type: 'DF', fix: vor('YKM')}]},
			{runway: '22', legs: [{type: 'CA', courseMag: 224}, {type: 'DF', fix: vor('YKM'), turn: 'R'}]},
			{runway: '27', legs: [{type: 'CA', courseMag: 274}, {type: 'DF', fix: vor('YKM'), turn: 'R'}]},
		]);
		// the common route ends with the TF to TITON and its right turn; the CIFP has no hold there
		expect(ykm7.common).toEqual([{type: 'IF', fix: vor('YKM')}, {type: 'TF', fix: fix('TITON'), turn: 'R'}]);
		expect(ykm7.transitions).toEqual([]);
	});

	it('reads CHINS5 at KBFI: en route transitions, runway transitions for both parallels, ending at the airport', () => {
		const chins5 = airportOf('KBFI').arrivals.find((a: any) => a.name === 'CHINS5')!;
		expect(chins5.transitions.map((t: any) => t.name)).toEqual(['PDT', 'SUNED', 'YKM']);
		expect(chins5.transitions.find((t: any) => t.name === 'YKM')!.legs).toEqual([
			{type: 'IF', fix: vor('YKM')},
			{type: 'TF', fix: fix('CHINS')},
		]);
		expect(chins5.common).toEqual([]);
		expect(chins5.runways.map((r: any) => r.runway)).toEqual(['14B', '32B']);
		for (const r of chins5.runways) {
			const last = r.legs[r.legs.length - 1];
			expect(last.type).toBe('VM');
			expect(last.fix).toEqual({ident: 'KBFI', region: 'K1', kind: 'airport'});
		}
		expect(chins5.runways[0].legs).toEqual([
			{type: 'IF', fix: fix('CHINS')},
			{type: 'TF', fix: fix('RADDY')},
			{type: 'TF', fix: fix('HUMPP')},
			{type: 'TF', fix: fix('AUBRN'), flyOver: true},
			{type: 'VM', fix: {ident: 'KBFI', region: 'K1', kind: 'airport'}, courseMag: 343},
		]);
	});

	it('reads the RNAV (GPS) Y 32L: transitions with their IAF, the final approach to the MAP and the missed approach', () => {
		const r32ly = airportOf('KBFI').approaches.find((a: any) => a.ident === 'R32LY')!;
		expect(r32ly).toMatchObject({type: 'R', runway: '32L', suffix: 'Y', rnav: ['LPV', 'LNAV/VNAV', 'LNAV']});
		expect(r32ly.transitions.map((t: any) => t.name)).toEqual(['ARVAD', 'HUMPP', 'WOODI']);
		expect(r32ly.transitions.find((t: any) => t.name === 'HUMPP')!.legs).toEqual([
			{type: 'IF', fix: fix('HUMPP'), role: 'IAF'},
			{type: 'TF', fix: {ident: 'COVOG', region: 'K1', kind: 'terminal', airport: 'KBFI'}},
			{type: 'TF', fix: fix('AUBRN'), role: 'IF'},
		]);
		expect(r32ly.final).toEqual([
			{type: 'IF', fix: fix('AUBRN'), role: 'IF'},
			{type: 'TF', fix: {ident: 'DUANE', region: 'K1', kind: 'terminal', airport: 'KBFI'}, role: 'FAF'},
			{type: 'TF', fix: {ident: 'RW32L', region: 'K1', kind: 'runway', airport: 'KBFI'}, role: 'MAP', flyOver: true},
		]);
		expect(r32ly.missed).toEqual([
			{type: 'CA', courseMag: 315.3},
			{type: 'DF', fix: {ident: 'FEVAS', region: 'K1', kind: 'terminal', airport: 'KBFI'}},
			{type: 'TF', fix: {ident: 'GRRAM', region: 'K1', kind: 'terminal', airport: 'KBFI'}},
			{type: 'TF', fix: fix('LOFAL'), flyOver: true},
			{type: 'HM', fix: fix('LOFAL'), courseMag: 313.8, turn: 'R'},
		]);
	});

	it('reads the RNAV (RNP) Z 32L as type H', () => {
		const h32lz = airportOf('KBFI').approaches.find((a: any) => a.ident === 'H32LZ')!;
		expect(h32lz).toMatchObject({type: 'H', runway: '32L', suffix: 'Z', rnav: []});
		expect(airportOf('KBFI').approaches.map((a: any) => a.ident)).toEqual(['H32LZ', 'R14RY', 'R32LY']);
	});

	it('lists the RNAV levels as published: the RNAV (GPS) Y 14R has no LNAV, an ILS none at all', () => {
		expect(airportOf('KBFI').approaches.find((a: any) => a.ident === 'R14RY')!.rnav).toEqual(['LPV', 'LNAV/VNAV']);
		expect(airportOf('KYKM').approaches.find((a: any) => a.ident === 'I27')!.rnav).toEqual([]);
	});

	it('reads the last leg of a route part, column 41 B, as fly-over', () => {
		const ocity3 = airportOf('KHIO').arrivals.find((a: any) => a.name === 'OCITY3')!;
		const lmt = ocity3.transitions.find((t: any) => t.name === 'LMT')!.legs;
		expect(line('SUSAP KHIOK1EOCITY31LMT   050')[40]).toBe('B');
		expect(lmt[lmt.length - 1]).toEqual({type: 'TF', fix: fix('OCITY'), flyOver: true});
		expect(lmt[lmt.length - 2]).toEqual({type: 'TF', fix: fix('VANTZ')});
	});

	it('reads NDBs and terminal NDBs, which NASR has, as ndb; a terminal NDB keeps its airport', () => {
		const aw = {ident: 'AW', region: 'K1', kind: 'ndb', airport: 'KAWO'};
		const n34 = airportOf('KAWO').approaches.find((a: any) => a.ident === 'N34')!;
		expect(n34.transitions.find((t: any) => t.name === 'AW')!.legs).toEqual([
			{type: 'IF', fix: aw},
			{type: 'PI', fix: aw, navaid: aw, courseMag: 207.1, turn: 'L', rhoNm: 0, thetaDeg: 0, role: 'IAF'},
		]);
		const pnd = {ident: 'PND', region: 'K1', kind: 'ndb'};
		const ndbB = airportOf('KHIO').approaches.find((a: any) => a.ident === 'NDB-B')!;
		expect(ndbB).toMatchObject({type: 'N', runway: '', suffix: 'B'});
		expect(ndbB.transitions.find((t: any) => t.name === 'BTG')!.legs.slice(1, 3)).toEqual([
			{type: 'TF', fix: pnd},
			{type: 'PI', fix: pnd, navaid: pnd, courseMag: 261.8, turn: 'R', rhoNm: 0, thetaDeg: 0, role: 'IAF'},
		]);
		expect(waypoint('AW')).toBeUndefined();
		expect(waypoint('PND')).toBeUndefined();
	});

	it('takes an NDB and a terminal NDB that NASR lacks from their CIFP records', () => {
		const withoutNdbs = nasr();
		withoutNdbs.ndbs = [];
		const x = extractCifp(CIFP, withoutNdbs);
		expect(x.waypoints.filter((w: any) => w.kind === 'ndb')).toEqual([
			{ident: 'AW', region: 'K1', kind: 'ndb', airport: 'KAWO', lat: 48.07611944, lon: -122.15391111, name: 'WATON', khz: 382},
			{ident: 'PND', region: 'K1', kind: 'ndb', lat: 45.63026944, lon: -123.04581111, name: 'BANKS', khz: 356},
		]);
		expect(x.airports.find((a: any) => a.ident === 'KAWO')!.approaches.map((a: any) => a.ident)).toEqual(['N34']);
	});

	it('reads a circling approach: the route type of its final approach, no runway, the suffix of its ident', () => {
		const vorA = airportOf('KYKM').approaches.find((a: any) => a.ident === 'VOR-A')!;
		// the ident spells V, the final approach route is S: a VOR approach with DME
		expect(vorA).toMatchObject({type: 'S', runway: '', suffix: 'A'});
		expect(vorA.transitions[0].legs[2]).toEqual({
			type: 'PI', fix: vor('YKM'), navaid: vor('YKM'), courseMag: 139, turn: 'L', rhoNm: 0, thetaDeg: 0, role: 'IAF',
		});
		expect(vorA.final.map((l: any) => [l.type, l.fix.ident, l.navaid?.ident, l.role])).toEqual([
			['IF', 'EMAME', undefined, 'IF'], ['CF', 'YKM', 'YKM', 'FAF'], ['CF', 'JAMDA', 'YKM', 'MAP'],
		]);
		expect(vorA.missed.map((l: any) => [l.type, l.fix.ident])).toEqual([['FA', 'JAMDA'], ['CF', 'YKM'], ['HM', 'YKM']]);
	});

	it('keeps the arc navaid and drops a localizer, which no list of the extract can hold', () => {
		const i27 = airportOf('KYKM').approaches.find((a: any) => a.ident === 'I27')!;
		expect(i27).toMatchObject({type: 'I', runway: '27', suffix: ''});
		expect(i27.transitions.find((t: any) => t.name === 'CIDOG')!.legs[1]).toEqual({
			type: 'AF', fix: {ident: 'FITIM', region: 'K1', kind: 'terminal', airport: 'KYKM'}, navaid: vor('YKM'),
			courseMag: 337.8, turn: 'R', rhoNm: 13, thetaDeg: 75,
		});
		// the procedure turn of SELAH is flown off the localizer IYKM
		expect(i27.transitions.find((t: any) => t.name === 'SELAH')!.legs[3]).toEqual({
			type: 'PI', fix: {ident: 'XOWLO', region: 'K1', kind: 'terminal', airport: 'KYKM'}, courseMag: 139,
			turn: 'L', rhoNm: 9.9, thetaDeg: 94, role: 'IAF',
		});
		expect(stats.notes).toEqual({
			'navaid of a CF or PI leg that is a localizer, left out': 6,
			'navaid of a CF or PI leg that is a TACAN or DME without VOR, left out': 2,
		});
	});

	it('reads the vector SID KENT1, whose CF legs are flown off the TACAN TCM, which is no VOR', () => {
		expect(parseRecord(line('SUSAD        TCM '))).toEqual({
			type: 'point', section: 'D ', ident: 'TCM', region: 'K1', lat: 47.14766944, lon: -122.47503889, withoutVor: true,
		});
		const kent1 = airportOf('KBFI').departures.find((d: any) => d.name === 'KENT1')!;
		expect(kent1.runways.map((r: any) => r.runway)).toEqual(['14L', '14R']);
		expect(kent1.runways[0].legs).toEqual([
			{type: 'VI', courseMag: 137},
			{type: 'CF', fix: {ident: 'ZIGED', region: 'K1', kind: 'terminal', airport: 'KBFI'}, courseMag: 135.2, rhoNm: 17.8,
				thetaDeg: 37.3},
		]);
	});

	it('skips an arc around a station that is no VOR', () => {
		const skipStats: any = {};
		const arcAroundTcm = CIFP.replace(line('SUSAP KYKMK1FI27   ACIDOG 020'), line('SUSAP KYKMK1FI27   ACIDOG 020').replace('YKM K1', 'TCM K1'));
		const kykm = extractCifp(arcAroundTcm, nasr(), skipStats).airports.find((a: any) => a.ident === 'KYKM')!;
		expect(kykm.approaches.map((a: any) => a.ident)).toEqual(['VOR-A']);
		expect(skipStats.skipped).toEqual({'navaid TCM (K1, VOR) is a TACAN or DME without VOR': ['KYKM approach I27']});
	});

	it('takes a fix that NASR lacks from the CIFP, a terminal waypoint and a VOR outside the region alike', () => {
		expect(waypoint('ATULY')).toEqual({ident: 'ATULY', region: 'K1', kind: 'terminal', airport: 'KBFI', lat: 47.27227778, lon: -122.24447222});
		expect(waypoint('LMT')).toEqual({
			ident: 'LMT', region: 'K1', kind: 'vor', lat: 42.15314167, lon: -121.72752778, name: 'KLAMATH FALLS', type: 'VORTAC',
			mhz: 115.9, declinationEast: 17,
		});
		expect(waypoint('OED')).toMatchObject({kind: 'vor'});
		// what NASR has stays out: DUANE, a terminal waypoint of KBFI that NASR files as a fix, keeps its kind and airport
		expect(waypoint('DUANE')).toBeUndefined();
		const r32ly = airportOf('KBFI').approaches.find((a: any) => a.ident === 'R32LY')!;
		expect(r32ly.final[1].fix).toEqual({ident: 'DUANE', region: 'K1', kind: 'terminal', airport: 'KBFI'});
		expect(waypoint('TITON')).toBeUndefined();
		expect(waypoint('YKM')).toBeUndefined();
		const lmt = airportOf('KHIO').arrivals.find((a: any) => a.name === 'OCITY3')!.transitions.find((t: any) => t.name === 'LMT')!;
		expect(lmt.legs[0]).toEqual({type: 'IF', fix: vor('LMT')});
		expect(result.waypoints.map((w: any) => w.ident)).toEqual(['ATULY', 'BIGIO', 'CFVNT', 'COLMT', 'COVOG', 'EMAME', 'FEVAS',
			'FITIM', 'GRRAM', 'HAGEV', 'JACAL', 'JAMDA', 'LACKR', 'LEMNN', 'LMT', 'OCEZE', 'OED', 'OPISE', 'SAVOY', 'SEYOY', 'XOWLO',
			'ZIGED', 'ZITLU']);
	});

	it('matches a VOR of the NASR extract by ident and region', () => {
		const withLmt = (region: string) => {
			const data = nasr();
			data.vors.push({...point('LMT'), region, name: 'KLAMATH FALLS', type: 'VORTAC', mhz: 115.9, declinationEast: 0});
			return extractCifp(CIFP, data).waypoints.map((w: any) => w.ident);
		};
		expect(withLmt('K1').includes('LMT')).toBe(false);
		expect(withLmt('K7').includes('LMT')).toBe(true);
	});

	it('skips and names a procedure with a fix found nowhere, and keeps nothing of it', () => {
		const skipStats: any = {};
		const withoutLmt = extractCifp(CIFP.replace(line('SUSAD        LMT ') + '\n', ''), nasr(), skipStats);
		expect(withoutLmt.airports.find((a: any) => a.ident === 'KHIO')!.arrivals).toEqual([]);
		expect(skipStats.skipped).toEqual({'fix LMT (K1, VOR) is neither in the NASR extract nor in the CIFP': ['KHIO STAR OCITY3']});
		expect(withoutLmt.waypoints.map((w: any) => w.ident).includes('OED')).toBe(false);
		expect(stats.skipped).toEqual({});
	});

	it('skips a procedure that needs a VOR from the CIFP whose frequency it cannot read', () => {
		const skipStats: any = {};
		const lmt = line('SUSAD        LMT ');
		const x = extractCifp(CIFP.replace(lmt, lmt.slice(0, 22) + '115.9' + lmt.slice(27)), nasr(), skipStats);
		expect(x.airports.find((a: any) => a.ident === 'KHIO')!.arrivals).toEqual([]);
		expect(skipStats.skipped).toEqual({'fix LMT (K1, VOR) with a type, frequency or declination the extract cannot read': ['KHIO STAR OCITY3']});
	});

	it('counts what it extracted', () => {
		expect(stats.counts).toEqual({airports: 4, departures: 2, arrivals: 2, approaches: 7, waypoints: 23});
	});

	it('writes the same text for the same data, two-space indented', () => {
		const text = serialize(result);
		expect(text).toBe(serialize(extractCifp(CIFP, nasr())));
		expect(text.startsWith('{\n  "cycle": "2610",\n')).toBe(true);
		expect(text.endsWith('}\n')).toBe(true);
	});

	it('refuses a file without header', () => {
		expect(() => extractCifp(CIFP.replace(line('HDR01'), ''), nasr())).toThrow('no HDR01 record');
	});
});
