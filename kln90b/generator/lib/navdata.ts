import fs from 'node:fs';
import path from 'node:path';
import {AirportClass, FacilityFrequencyType, RunwaySurfaceType, VorType, type Facility} from '@microsoft/msfs-sdk';
import {airport, intersection, ndb, vor, type FrequencyOptions, type RunwayOptions} from '../harness-lgpl/builders.ts';
import type {NamedPoint} from './mapElements.ts';
import {SITE} from './paths.ts';

const NAVDATA = path.join(SITE, 'generator', 'navdata');
const EXTRACT_FILE = /^nasr-\d{4}-\d{2}-\d{2}\.json$/;

/** The extract `generator/navdata/extract-nasr.mjs` writes; the format is described in `navdata/README.md`. */
export interface NavdataExtract {
	cycle: string;
	airports: {
		ident: string; faaId: string; name: string; city: string; lat: number; lon: number; elevationFt: number;
		towered: boolean; heliport: boolean;
		runways: { designation: string; headingTrue: number; lengthFt: number; surface: string; lit: boolean; lat: number; lon: number }[];
		frequencies: { use: string; mhz: number }[];
	}[];
	vors: { ident: string; name: string; type: string; lat: number; lon: number; mhz: number; declinationEast: number; region: string }[];
	ndbs: { ident: string; name: string; lat: number; lon: number; khz: number; region: string }[];
	fixes: { ident: string; lat: number; lon: number; region: string }[];
}

let extractCache: NavdataExtract | undefined;

/** The newest `generator/navdata/nasr-*.json`, read once. */
export function loadExtract(): NavdataExtract {
	if (extractCache === undefined) {
		const newest = fs.readdirSync(NAVDATA).filter(f => EXTRACT_FILE.test(f)).sort().pop();
		if (newest === undefined) throw new Error(`no nasr-*.json in ${NAVDATA}; run generator/navdata/extract-nasr.mjs`);
		extractCache = JSON.parse(fs.readFileSync(path.join(NAVDATA, newest), 'utf8')) as NavdataExtract;
	}
	return extractCache;
}

// The use text of a NASR frequency starts with the kind of service (`LCL/P`, `APCH/P DEP/P`, `D-ATIS`). Everything else
// the FAA files under an airport (procedure names, RCAG, class B/C, emergency, ramp control) is no frequency of the
// airport itself, and the unit shows only the services of these types.
const USE_TYPES: Record<string, { type: FacilityFrequencyType; name: string }> = {
	'LCL': {type: FacilityFrequencyType.Tower, name: 'TOWER'},
	'GND': {type: FacilityFrequencyType.Ground, name: 'GROUND'},
	'CD': {type: FacilityFrequencyType.Clearance, name: 'CLEARANCE'},
	'APCH': {type: FacilityFrequencyType.Approach, name: 'APPROACH'},
	'DEP': {type: FacilityFrequencyType.Departure, name: 'DEPARTURE'},
	'ATIS': {type: FacilityFrequencyType.ATIS, name: 'ATIS'},
	'D-ATIS': {type: FacilityFrequencyType.ATIS, name: 'ATIS'},
	'CTAF': {type: FacilityFrequencyType.CTAF, name: 'CTAF'},
	'UNICOM': {type: FacilityFrequencyType.Unicom, name: 'UNICOM'},
};

const COMM_BAND_MHZ = {min: 118, max: 136.975};

function frequenciesOf(list: { use: string; mhz: number }[]): FrequencyOptions[] {
	const out: FrequencyOptions[] = [];
	for (const f of list) {
		if (f.mhz < COMM_BAND_MHZ.min || f.mhz > COMM_BAND_MHZ.max) continue;
		const kind = USE_TYPES[f.use.split(/[ /]/)[0]];
		if (kind !== undefined) out.push({name: kind.name, type: kind.type, mhz: f.mhz});
	}
	return out;
}

// The first part of the NASR code (`ASPH-CONC`, `TURF-GRVL`) is the surface the unit reports.
const SURFACES: Record<string, RunwaySurfaceType> = {
	ASPH: RunwaySurfaceType.Asphalt, CONC: RunwaySurfaceType.Concrete, TURF: RunwaySurfaceType.Grass,
	GRAVEL: RunwaySurfaceType.Gravel, GRVL: RunwaySurfaceType.Gravel, DIRT: RunwaySurfaceType.Dirt,
	SAND: RunwaySurfaceType.Sand, WATER: RunwaySurfaceType.Water,
};
/** The sim's runway surface enum has no member for an unknown surface; 25 is the gap in it, which the SDK files under the unknown category. */
const UNKNOWN_SURFACE = 25 as RunwaySurfaceType;

function surfaceOf(code: string): RunwaySurfaceType {
	return SURFACES[code.split('-')[0]] ?? UNKNOWN_SURFACE;
}

const VOR_TYPES: Record<string, VorType> = {'VOR': VorType.VOR, 'VOR/DME': VorType.VORDME, 'VORTAC': VorType.VORTAC};

/** The facilities of the extract, as the harness's navdata takes them. */
export function facilitiesOf(x: NavdataExtract): Facility[] {
	const out: Facility[] = [];
	for (const a of x.airports) {
		const runways: RunwayOptions[] = a.runways.map(r => ({
			designation: r.designation, heading: r.headingTrue, lengthFt: r.lengthFt, surface: surfaceOf(r.surface), lit: r.lit,
			lat: r.lat, lon: r.lon,
		}));
		out.push(airport(a.ident, a.lat, a.lon, {
			name: a.name, city: a.city, elevationFt: a.elevationFt, towered: a.towered, runways,
			airportClass: a.heliport ? AirportClass.HeliportOnly : undefined, frequencies: frequenciesOf(a.frequencies),
		}));
	}
	for (const v of x.vors) {
		// The sim stores the variation west positive; the extract has it east positive (KLNMagvar.ts in the instrument)
		out.push(vor(v.ident, v.lat, v.lon, {
			name: v.name, frequencyMHz: v.mhz, magneticVariation: -v.declinationEast, region: v.region, type: VOR_TYPES[v.type],
		}));
	}
	for (const n of x.ndbs) out.push(ndb(n.ident, n.lat, n.lon, {name: n.name, frequencyKHz: n.khz, region: n.region}));
	for (const f of x.fixes) out.push(intersection(f.ident, f.lat, f.lon, {region: f.region}));
	return out;
}

/**
 * The position of an airport, VOR, NDB or fix of the extract, by the ident the unit shows (`KSEA`).
 * @throws Error when no place or more than one has the ident
 */
export function place(ident: string): { lat: number; lon: number } {
	return placeIn(loadExtract(), ident);
}

/** `place` in a given extract */
export function placeIn(x: NavdataExtract, ident: string): { lat: number; lon: number } {
	const found = [...x.airports, ...x.vors, ...x.ndbs, ...x.fixes].filter(p => p.ident === ident);
	if (found.length === 0) throw new Error(`no airport, VOR, NDB or fix ${ident} in the navdata extract ${x.cycle}`);
	if (found.length > 1) throw new Error(`${ident} is ambiguous in the navdata extract ${x.cycle}: ${found.length} places have it`);
	return {lat: found[0].lat, lon: found[0].lon};
}

/**
 * The facility of an airport, VOR, NDB or fix of the extract, by the ident the unit shows (`KSEA`), for
 * `savedFlightplan`.
 * @throws Error when no facility or more than one has the ident
 */
export function facility(ident: string): Facility {
	return facilityIn(loadExtract(), ident);
}

/** `facility` in a given extract */
export function facilityIn(x: NavdataExtract, ident: string): Facility {
	const found = facilitiesOf(x).filter(f => f.icaoStruct.ident === ident);
	if (found.length === 0) throw new Error(`no airport, VOR, NDB or fix ${ident} in the navdata extract ${x.cycle}`);
	if (found.length > 1) throw new Error(`${ident} is ambiguous in the navdata extract ${x.cycle}: ${found.length} facilities have it`);
	return found[0];
}

/**
 * The places of the extract by the ident the unit shows, for naming the points the maps draw: the airports first,
 * then the VORs, NDBs and fixes, so that a point that is both an airport and a VOR is named after the airport.
 */
export function pointNamesOf(x: NavdataExtract): NamedPoint[] {
	return [...x.airports, ...x.vors, ...x.ndbs, ...x.fixes].map(p => ({name: p.ident, lat: p.lat, lon: p.lon}));
}
