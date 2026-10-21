import {describe, expect, it} from 'vitest';
import {
	AirportFacility, FacilityFrequencyType, RunwayLightingType, RunwaySurfaceCategory, RunwaySurfaceType, RunwayUtils,
	VorFacility,
} from '@microsoft/msfs-sdk';
import {facilitiesOf, facility, facilityIn, loadExtract, place, placeIn, type NavdataExtract} from '../lib/navdata.ts';

type Airport = NavdataExtract['airports'][number];

function apt(over: Partial<Airport> = {}): Airport {
	return {
		ident: 'KAAA', faaId: 'AAA', name: 'TEST FIELD', city: 'TESTVILLE', lat: 47.5, lon: -122.3, elevationFt: 100,
		towered: true, heliport: false,
		runways: [{designation: '16L-34R', headingTrue: 163, lengthFt: 8000, surface: 'ASPH-CONC', lit: true, lat: 47.51, lon: -122.31}],
		frequencies: [],
		...over,
	};
}

function extract(over: Partial<NavdataExtract> = {}): NavdataExtract {
	return {cycle: '2026-10-01', airports: [apt()], vors: [], ndbs: [], fixes: [], ...over};
}

function airportOf(x: NavdataExtract): AirportFacility {
	return facilitiesOf(x).find(f => f.icaoStruct.type === 'A') as AirportFacility;
}

describe('facilitiesOf', () => {
	it('turns a runway pair with letters into the SDK designation and designators', () => {
		const r = airportOf(extract()).runways[0];
		expect(r.designation).toBe('16-34');
		expect(r.designatorCharPrimary).toBe(RunwayDesignator.RUNWAY_DESIGNATOR_LEFT);
		expect(r.designatorCharSecondary).toBe(RunwayDesignator.RUNWAY_DESIGNATOR_RIGHT);
		expect(r.direction).toBe(163);
		expect(r.latitude).toBe(47.51);
		expect(r.longitude).toBe(-122.31);
		expect(r.lighting).toBe(RunwayLightingType.FullTime);
	});

	it('turns the letter C of a runway pair into the center designator on both ends', () => {
		const [r] = airportOf(extract({airports: [apt({
			runways: [{designation: '16C-34C', headingTrue: 163, lengthFt: 8000, surface: 'ASPH', lit: false, lat: 47.51, lon: -122.31}],
		})]})).runways;
		expect(r.designation).toBe('16-34');
		expect(r.designatorCharPrimary).toBe(RunwayDesignator.RUNWAY_DESIGNATOR_CENTER);
		expect(r.designatorCharSecondary).toBe(RunwayDesignator.RUNWAY_DESIGNATOR_CENTER);
	});

	it('keeps a helipad designation and a runway without letters', () => {
		const a = airportOf(extract({airports: [apt({
			runways: [
				{designation: 'H1', headingTrue: 0, lengthFt: 50, surface: 'ASPH', lit: false, lat: 47.5, lon: -122.3},
				{designation: '09-27', headingTrue: 90, lengthFt: 3000, surface: 'ASPH', lit: false, lat: 47.5, lon: -122.3},
			],
		})]}));
		expect(a.runways.map(r => r.designation)).toEqual(['H1', '09-27']);
		expect(a.runways[0].designatorCharPrimary).toBe(RunwayDesignator.RUNWAY_DESIGNATOR_NONE);
		expect(a.runways[1].designatorCharSecondary).toBe(RunwayDesignator.RUNWAY_DESIGNATOR_NONE);
		expect(a.runways[1].lighting).toBe(RunwayLightingType.None);
	});

	it('maps the surface by the first part of the NASR code', () => {
		const surfaces = (codes: string[]) => airportOf(extract({airports: [apt({
			runways: codes.map(surface => ({designation: '09-27', headingTrue: 90, lengthFt: 1000, surface, lit: false, lat: 1, lon: 1})),
		})]})).runways.map(r => r.surface);
		expect(surfaces(['ASPH', 'ASPH-CONC', 'CONC', 'TURF', 'TURF-GRVL', 'TURF-DIRT', 'GRAVEL', 'GRVL', 'DIRT', 'SAND', 'WATER'])).toEqual([
			RunwaySurfaceType.Asphalt, RunwaySurfaceType.Asphalt, RunwaySurfaceType.Concrete, RunwaySurfaceType.Grass,
			RunwaySurfaceType.Grass, RunwaySurfaceType.Grass, RunwaySurfaceType.Gravel, RunwaySurfaceType.Gravel,
			RunwaySurfaceType.Dirt, RunwaySurfaceType.Sand, RunwaySurfaceType.Water,
		]);
		const [unknown] = surfaces(['MATS']);
		expect(RunwayUtils.getSurfaceCategory(unknown)).toBe(RunwaySurfaceCategory.Unknown);
	});

	it('keeps the comm frequencies of a service, by the first word of the use', () => {
		const a = airportOf(extract({airports: [apt({
			frequencies: [
				{use: 'LCL/P', mhz: 119.9}, {use: 'GND/P', mhz: 121.9}, {use: 'CD/P', mhz: 128}, {use: 'APCH/P DEP/P', mhz: 120.1},
				{use: 'DEP/S', mhz: 123.9}, {use: 'D-ATIS', mhz: 118}, {use: 'ATIS', mhz: 135.0}, {use: 'CTAF', mhz: 122.9},
				{use: 'UNICOM', mhz: 122.95},
			],
		})]}));
		expect(a.frequencies.map(f => [f.type, f.freqMHz])).toEqual([
			[FacilityFrequencyType.Tower, 119.9], [FacilityFrequencyType.Ground, 121.9], [FacilityFrequencyType.Clearance, 128],
			[FacilityFrequencyType.Approach, 120.1], [FacilityFrequencyType.Departure, 123.9], [FacilityFrequencyType.ATIS, 118],
			[FacilityFrequencyType.ATIS, 135], [FacilityFrequencyType.CTAF, 122.9], [FacilityFrequencyType.Unicom, 122.95],
		]);
		expect(a.frequencies[0].name).toBe('TOWER');
		expect(a.frequencies[0].freqBCD16).toBe(0x1990);
	});

	it('drops what is no VHF comm frequency of a service', () => {
		const a = airportOf(extract({airports: [apt({
			frequencies: [
				{use: 'LCL/P', mhz: 257.6}, {use: 'SUMMA DP', mhz: 120.4}, {use: 'CLASS B', mhz: 119.2}, {use: 'RCO', mhz: 122.2},
				{use: 'EMERG', mhz: 121.5}, {use: 'CTAF', mhz: 117.975}, {use: 'CTAF', mhz: 137}, {use: 'GND/P', mhz: 121.7},
			],
		})]}));
		expect(a.frequencies.map(f => [f.type, f.freqMHz])).toEqual([[FacilityFrequencyType.Ground, 121.7]]);
	});

	it('stores the variation of a VOR west positive', () => {
		const vors = facilitiesOf(extract({vors: [
			{ident: 'AAA', name: 'A VOR', type: 'VORTAC', lat: 47, lon: -122, mhz: 112.8, declinationEast: 20, region: 'K1'},
		]})).filter(f => f.icaoStruct.type === 'V') as VorFacility[];
		expect(vors[0].magneticVariation).toBe(-20);
		expect(vors[0].freqMHz).toBe(112.8);
		expect(vors[0].icaoStruct.region).toBe('K1');
	});

	it('builds NDBs and fixes', () => {
		const out = facilitiesOf(extract({
			ndbs: [{ident: 'NB', name: 'NDB', lat: 47, lon: -122, khz: 350, region: 'K1'}],
			fixes: [{ident: 'ABCDE', lat: 47.1, lon: -122.1, region: 'K1'}],
		}));
		expect(out.map(f => f.icaoStruct.type).sort()).toEqual(['A', 'N', 'W']);
	});
});

describe('place', () => {
	it('finds an airport, a VOR, an NDB and a fix by ident', () => {
		const x = extract({
			vors: [{ident: 'VVV', name: 'V', type: 'VOR', lat: 1, lon: 2, mhz: 112.8, declinationEast: 0, region: 'K1'}],
			ndbs: [{ident: 'NN', name: 'N', lat: 3, lon: 4, khz: 350, region: 'K1'}],
			fixes: [{ident: 'FIXAA', lat: 5, lon: 6, region: 'K1'}],
		});
		expect(placeIn(x, 'KAAA')).toEqual({lat: 47.5, lon: -122.3});
		expect(placeIn(x, 'VVV')).toEqual({lat: 1, lon: 2});
		expect(placeIn(x, 'NN')).toEqual({lat: 3, lon: 4});
		expect(placeIn(x, 'FIXAA')).toEqual({lat: 5, lon: 6});
	});

	it('throws for an unknown ident', () => {
		expect(() => placeIn(extract(), 'KZZZ')).toThrow(/no airport, VOR, NDB or fix KZZZ/);
	});

	it('throws for an ident that two places have', () => {
		const x = extract({fixes: [{ident: 'KAAA', lat: 5, lon: 6, region: 'K1'}]});
		expect(() => placeIn(x, 'KAAA')).toThrow(/KAAA is ambiguous/);
	});

	it('finds KSEA in the extract', () => {
		const sea = loadExtract().airports.find(a => a.ident === 'KSEA')!;
		expect(place('KSEA')).toEqual({lat: sea.lat, lon: sea.lon});
		expect(place('KSEA').lat).toBeCloseTo(47.45, 1);
		expect(() => place('NOSUCH')).toThrow(/no airport/);
	});
});

describe('loadExtract', () => {
	it('reads the newest extract once', () => {
		expect(loadExtract()).toBe(loadExtract());
		expect(loadExtract().cycle).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});
});

describe('facility', () => {
	it('finds the facility of an airport and of a VOR by ident', () => {
		const x = extract({vors: [{ident: 'VVV', name: 'V', type: 'VOR', lat: 1, lon: 2, mhz: 112.8, declinationEast: 0, region: 'K1'}]});
		expect(facilityIn(x, 'KAAA')).toMatchObject({lat: 47.5, lon: -122.3, icaoStruct: {type: 'A', ident: 'KAAA'}});
		expect(facilityIn(x, 'VVV')).toMatchObject({lat: 1, lon: 2, icaoStruct: {type: 'V', ident: 'VVV'}});
	});

	it('throws for an unknown ident and for one that two facilities have', () => {
		expect(() => facilityIn(extract(), 'KZZZ')).toThrow(/no airport, VOR, NDB or fix KZZZ/);
		const x = extract({fixes: [{ident: 'KAAA', lat: 5, lon: 6, region: 'K1'}]});
		expect(() => facilityIn(x, 'KAAA')).toThrow(/KAAA is ambiguous/);
	});

	it('finds KPDX in the extract', () => {
		expect(facility('KPDX')).toMatchObject({icaoStruct: {ident: 'KPDX'}});
	});
});
