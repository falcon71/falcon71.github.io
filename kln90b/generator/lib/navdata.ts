import fs from 'node:fs';
import path from 'node:path';
import {
	AirportClass, BoundaryAltitudeType, BoundaryType, FacilityFrequencyType, FixTypeFlags, FlightPlan, ICAO, LegTurnDirection, LegType, RnavTypeFlags,
	RunwaySurfaceType, UnitType, VorType, type AirportFacility, type ApproachProcedure, type BoundaryFacility, type Facility,
	type FlightPlanLeg,
	type IcaoValue, type Procedure,
} from '@microsoft/msfs-sdk';
import {airspace} from '../../../vendor/kln90b/test/harness/navdata/airspaces';
import {approach, runwayFix, sid, star, withProcedures} from '../../../vendor/kln90b/test/harness/navdata/procedures';
import {airport, intersection, ndb, vor, type FrequencyOptions, type RunwayOptions} from '../harness-lgpl/builders.ts';
import type {Airspace, AirspaceExtract} from '../navdata/extract-airspaces.mjs';
import type {Approach, CifpExtract, CifpLeg, FixRef, Proc} from '../navdata/extract-cifp.mjs';
import type {NamedPoint} from './mapElements.ts';
import {SITE} from './paths.ts';

export type {AirspaceExtract, CifpExtract};

const NAVDATA = path.join(SITE, 'generator', 'navdata');
const EXTRACT_FILE = /^nasr-\d{4}-\d{2}-\d{2}\.json$/;
const CIFP_FILE = /^cifp-\d{4}\.json$/;
const AIRSPACE_FILE = /^airspaces-\d{4}-\d{2}-\d{2}\.json$/;

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
	centers: { artcc: string; frequencies: number[] }[];
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

let proceduresCache: CifpExtract | undefined;

/** The newest `generator/navdata/cifp-*.json`, the procedures of the extract's airports, read once. */
export function loadProcedures(): CifpExtract {
	if (proceduresCache === undefined) {
		const newest = fs.readdirSync(NAVDATA).filter(f => CIFP_FILE.test(f)).sort().pop();
		if (newest === undefined) throw new Error(`no cifp-*.json in ${NAVDATA}; run generator/navdata/extract-cifp.mjs`);
		proceduresCache = JSON.parse(fs.readFileSync(path.join(NAVDATA, newest), 'utf8')) as CifpExtract;
	}
	return proceduresCache;
}

let airspacesCache: AirspaceExtract | undefined;

/** The newest `generator/navdata/airspaces-*.json`, the class B and C airspace and the Centers of the extract's regions, read once. */
export function loadAirspaces(): AirspaceExtract {
	if (airspacesCache === undefined) {
		const newest = fs.readdirSync(NAVDATA).filter(f => AIRSPACE_FILE.test(f)).sort().pop();
		if (newest === undefined) throw new Error(`no airspaces-*.json in ${NAVDATA}; run generator/navdata/extract-airspaces.mjs`);
		airspacesCache = JSON.parse(fs.readFileSync(path.join(NAVDATA, newest), 'utf8')) as AirspaceExtract;
	}
	return airspacesCache;
}

const BOUNDARY_TYPES = {B: BoundaryType.ClassB, C: BoundaryType.ClassC, center: BoundaryType.Center} as const;

/** The reference of a limit in the extract: the surface counts as above ground level, and no upper limit is unlimited. */
function limitType(ref: string | null): BoundaryAltitudeType {
	switch (ref) {
		case 'SFC': case 'AGL': return BoundaryAltitudeType.AGL;
		case 'MSL': return BoundaryAltitudeType.MSL;
		case null: return BoundaryAltitudeType.Unlimited;
		default: throw new Error(`unknown altitude reference ${ref}`);
	}
}

/** One airspace of the extract; a Center speaks on the first frequency the NASR extract lists for its ARTCC. */
function boundaryOf(a: Airspace, x: NavdataExtract): BoundaryFacility {
	const type = BOUNDARY_TYPES[a.kind];
	let frequencyMHz: number | undefined;
	if (a.kind === 'center') {
		frequencyMHz = x.centers.find(c => c.artcc === a.ident)?.frequencies[0];
		if (frequencyMHz === undefined) throw new Error(`the Center ${a.name} (${a.ident}) has no frequency in the NASR extract`);
	}
	return airspace(a.name, type, a.polygon, {
		// With no upper limit, the height is not read
		minFt: a.lowerFt, maxFt: a.upperFt ?? 0, minType: limitType(a.lowerRef), maxType: limitType(a.upperRef),
		frequencyMHz, frequencyName: a.name,
	});
}

/** The airspaces of the extract as the harness's boundary search takes them. */
export function airspacesOf(a: AirspaceExtract, x: NavdataExtract): BoundaryFacility[] {
	return a.airspaces.map(b => boundaryOf(b, x));
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

/** A VOR of the NASR extract, or one the CIFP extract adds with the same values */
function vorOf(v: NavdataExtract['vors'][number]): Facility {
	// The sim stores the variation west positive; the extract has it east positive (KLNMagvar.ts in the instrument)
	return vor(v.ident, v.lat, v.lon, {
		name: v.name, frequencyMHz: v.mhz, magneticVariation: -v.declinationEast, region: v.region, type: VOR_TYPES[v.type],
	});
}

/** An NDB of the NASR extract, or one the CIFP extract adds with the same values and, if it is terminal, its airport */
function ndbOf(n: NavdataExtract['ndbs'][number] & { airport?: string }): Facility {
	return ndb(n.ident, n.lat, n.lon, {name: n.name, frequencyKHz: n.khz, region: n.region, airport: n.airport});
}

/**
 * The facilities of the extract, as the harness's navdata takes them. With the procedures of the CIFP extract, the
 * airports carry their SIDs, STARs and approaches as the simulator delivers them, and the facilities include what the
 * procedures fly to that the NASR extract lacks: terminal waypoints, the fixes and VORs outside the regions, and the
 * runway fixes.
 */
export function facilitiesOf(x: NavdataExtract, p?: CifpExtract): Facility[] {
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
	for (const v of x.vors) out.push(vorOf(v));
	for (const n of x.ndbs) out.push(ndbOf(n));
	for (const f of x.fixes) out.push(intersection(f.ident, f.lat, f.lon, {region: f.region}));
	return p === undefined ? out : withCifpProcedures(out, x, p);
}

/**
 * The approach types of the CIFP (the route type of the final approach) as the SDK names them, or undefined for a type
 * that is left out. A function, because `ApproachType` is a global of the sim that the harness sets up.
 */
function approachTypeOf(type: string): ApproachType | undefined {
	const types: Record<string, ApproachType> = {
		P: ApproachType.APPROACH_TYPE_GPS, R: ApproachType.APPROACH_TYPE_RNAV, H: ApproachType.APPROACH_TYPE_RNAV,
		I: ApproachType.APPROACH_TYPE_ILS, L: ApproachType.APPROACH_TYPE_LOCALIZER,
		B: ApproachType.APPROACH_TYPE_LOCALIZER_BACK_COURSE, D: ApproachType.APPROACH_TYPE_VORDME,
		V: ApproachType.APPROACH_TYPE_VOR, S: ApproachType.APPROACH_TYPE_VOR, N: ApproachType.APPROACH_TYPE_NDB,
		Q: ApproachType.APPROACH_TYPE_NDBDME, X: ApproachType.APPROACH_TYPE_LDA, U: ApproachType.APPROACH_TYPE_SDF,
	};
	return types[type];
}

const RNAV_LEVELS: Record<string, RnavTypeFlags> = {
	'LNAV': RnavTypeFlags.LNAV, 'LNAV/VNAV': RnavTypeFlags.LNAVVNAV, 'LP': RnavTypeFlags.LP, 'LPV': RnavTypeFlags.LPV,
};
const ROLES: Record<string, FixTypeFlags> = {IAF: FixTypeFlags.IAF, IF: FixTypeFlags.IF, FAF: FixTypeFlags.FAF, MAP: FixTypeFlags.MAP};
const TURNS: Record<string, LegTurnDirection> = {L: LegTurnDirection.Left, R: LegTurnDirection.Right};
/** The facility type of the ICAO by the kind of a fix reference; NASR files terminal waypoints as fixes */
const ICAO_TYPES: Record<string, string> = {fix: 'W', terminal: 'W', vor: 'V', ndb: 'N'};
const RUNWAY_PAIR = /^(\d\d)([LRCW]?)-(\d\d)([LRCW]?)$/;
const BOTH_PARALLELS = /^(\d\d)B$/;

/** The runway ends of an airport of the extract in the order of its runways: `14L-32R` has 14L and 32R */
function runwayEndsOf(a: NavdataExtract['airports'][number]): string[] {
	return a.runways.flatMap(r => {
		const pair = RUNWAY_PAIR.exec(r.designation);
		return pair === null ? [] : [pair[1] + pair[2], pair[3] + pair[4]];
	});
}

/**
 * The runways a runway transition of the CIFP is for. A transition for both parallels (`32B`) becomes one per runway end
 * of that number, as the maintainer saw the simulator deliver CHINS5 at KBFI; one for every runway (`ALL`) becomes one
 * per runway end of the airport, by the same logic.
 * @throws Error when the airport has no runway end the transition is for
 */
function runwaysOf(runway: string, ends: string[], apt: string): string[] {
	const both = BOTH_PARALLELS.exec(runway);
	const runways = runway === 'ALL' ? ends : both === null ? ends.filter(e => e === runway) : ends.filter(e => e.startsWith(both[1]));
	if (runways.length === 0) throw new Error(`${apt} has no runway for the runway transition ${runway}`);
	return runways;
}

const key = (...parts: string[]) => parts.join(' ');

/**
 * The facility of a waypoint of the CIFP extract; a VOR or NDB with the values its CIFP record gives, as the NASR ones.
 * @throws Error for a VOR or NDB without them, or a kind no facility has
 */
function facilityOf(w: CifpExtract['waypoints'][number], apt: string): Facility {
	const {ident, region, lat, lon, name} = w;
	switch (w.kind) {
		case 'terminal':
			return intersection(ident, lat, lon, {region, airport: w.airport});
		case 'fix':
			return intersection(ident, lat, lon, {region});
		case 'vor': {
			const {type, mhz, declinationEast} = w;
			if (name === undefined || type === undefined || mhz === undefined || declinationEast === undefined) {
				throw new Error(`${apt}: the VOR ${ident} ${region} of the CIFP extract has no name, type, frequency or declination`);
			}
			return vorOf({ident, region, lat, lon, name, type, mhz, declinationEast});
		}
		case 'ndb': {
			const {khz} = w;
			if (name === undefined || khz === undefined) throw new Error(`${apt}: the NDB ${ident} ${region} of the CIFP extract has no name or frequency`);
			return ndbOf({ident, region, lat, lon, name, khz, airport: w.airport});
		}
		default:
			throw new Error(`${apt}: no facility of the kind ${w.kind} (${ident})`);
	}
}

/** Turns the procedures of the CIFP extract into the SDK's, and makes the facilities their fixes need */
class ProcedureBuilder {
	private readonly nasr = new Map<string, Facility>();
	private readonly airports = new Map<string, AirportFacility>();
	private readonly waypoints = new Map<string, CifpExtract['waypoints'][number]>();
	/** The facilities made for the procedures, by ICAO */
	public readonly made = new Map<string, Facility>();

	public constructor(facilities: Facility[], waypoints: CifpExtract['waypoints']) {
		for (const f of facilities) {
			if (f.icaoStruct.type === 'A') this.airports.set(f.icaoStruct.ident, f as AirportFacility);
			else this.nasr.set(key(f.icaoStruct.type, f.icaoStruct.region, f.icaoStruct.ident), f);
		}
		for (const w of waypoints) this.waypoints.set(key(w.kind, w.region, w.airport ?? '', w.ident), w);
	}

	public airport(apt: AirportFacility, procedures: CifpExtract['airports'][number], ends: string[]): AirportFacility {
		const ident = apt.icaoStruct.ident;
		return withProcedures(apt, {
			departures: procedures.departures.map(p => this.procedure(sid, p, ident, ends)),
			arrivals: procedures.arrivals.map(p => this.procedure(star, p, ident, ends)),
			approaches: procedures.approaches.flatMap(a => this.approach(a, ident) ?? []),
		});
	}

	private procedure(build: typeof sid, p: Proc, apt: string, ends: string[]): Procedure {
		return build(p.name, {
			// Fresh legs for each runway: a leg is never shared between transitions
			runways: p.runways.flatMap(r => runwaysOf(r.runway, ends, apt).map(runway => ({runway, legs: this.legs(r.legs, apt)}))),
			common: this.legs(p.common, apt),
			transitions: p.transitions.map(t => ({name: t.name, legs: this.legs(t.legs, apt)})),
		});
	}

	private approach(a: Approach, apt: string): ApproachProcedure | null {
		const type = approachTypeOf(a.type);
		if (type === undefined) return null;
		const levels = a.rnav.reduce((flags, level) => {
			if (RNAV_LEVELS[level] === undefined) throw new Error(`${apt} ${a.ident}: no RNAV level ${level}`);
			return flags | RNAV_LEVELS[level];
		}, RnavTypeFlags.None);
		return approach({
			name: a.ident, type, runway: a.runway, suffix: a.suffix,
			// An RNAV approach without published levels (a circling one) is flown to LNAV
			rnav: a.type === 'R' && levels === RnavTypeFlags.None ? RnavTypeFlags.LNAV : levels,
			rnpAr: a.type === 'H',
			transitions: a.transitions.map(t => ({name: t.name, legs: this.legs(t.legs, apt)})),
			final: this.legs(a.final, apt), missed: this.legs(a.missed, apt),
		});
	}

	private legs(legs: CifpLeg[], apt: string): FlightPlanLeg[] {
		return legs.map(l => this.leg(l, apt));
	}

	/**
	 * A leg as the simulator delivers it. Courses and radials stay magnetic, as published. `rho` is the distance from the
	 * navaid in meters: the radius of an arc, the distance of a procedure turn's or a course's fix. The radius of an RF
	 * leg is left out with its center, since the unit refuses every procedure with an RF leg.
	 */
	private leg(l: CifpLeg, apt: string): FlightPlanLeg {
		const type = LegType[l.type as keyof typeof LegType];
		if (type === undefined) throw new Error(`${apt}: no SDK leg type for the path terminator ${l.type}`);
		return FlightPlan.createLeg({
			type,
			fixIcaoStruct: l.fix === undefined ? undefined : this.icaoOf(l.fix, apt),
			// The unit loads the navaid of an arc only (SidStar), so the recommended navaid of a CF or PI leg is no facility
			originIcaoStruct: l.navaid === undefined ? undefined : this.icaoOf(l.navaid, apt, l.type === 'AF'),
			course: l.courseMag, theta: l.thetaDeg,
			rho: l.rhoNm === undefined ? undefined : UnitType.NMILE.convertTo(l.rhoNm, UnitType.METER),
			turnDirection: l.turn === undefined ? undefined : TURNS[l.turn], flyOver: l.flyOver,
			fixTypeFlags: l.role === undefined ? undefined : ROLES[l.role],
		});
	}

	/**
	 * The ICAO of the facility a fix reference names. A fix, terminal waypoint, VOR or NDB is the NASR facility of its
	 * ident and region where there is one, whatever airport the reference names; only one that NASR lacks is made from
	 * the waypoints of the CIFP extract, a terminal one with its airport.
	 * @param make whether a facility that NASR lacks is added to the navdata; without, only its ICAO is returned
	 * @throws Error when neither has it
	 */
	private icaoOf(ref: FixRef, apt: string, make = true): IcaoValue {
		// A leg to the airport itself: the simulator delivers it without a fix, and the unit drops it
		if (ref.kind === 'airport') return ICAO.emptyValue();
		if (ref.kind === 'runway') {
			const owner = this.airports.get(ref.airport ?? apt);
			if (owner === undefined) throw new Error(`${apt}: the airport ${ref.airport ?? apt} of the runway ${ref.ident} is not in the NASR extract`);
			return this.once(runwayFix(owner, ref.ident.replace(/^RW/, '')));
		}
		const type = ICAO_TYPES[ref.kind];
		if (type === undefined) throw new Error(`${apt}: no fix kind ${ref.kind} (${ref.ident})`);
		const known = this.nasr.get(key(type, ref.region, ref.ident));
		if (known !== undefined) return known.icaoStruct;
		const w = this.waypoints.get(key(ref.kind, ref.region, ref.airport ?? '', ref.ident));
		if (w === undefined) {
			throw new Error(`${apt}: the ${ref.kind} ${ref.ident} ${ref.region}${ref.airport ? ` of ${ref.airport}` : ''} is in neither extract`);
		}
		const made = facilityOf(w, apt);
		return make ? this.once(made) : made.icaoStruct;
	}

	/** The facility made once for all procedures that use it */
	private once(f: Facility): IcaoValue {
		const uid = ICAO.getUid(f.icaoStruct);
		if (!this.made.has(uid)) this.made.set(uid, f);
		return this.made.get(uid)!.icaoStruct;
	}
}

function withCifpProcedures(facilities: Facility[], x: NavdataExtract, p: CifpExtract): Facility[] {
	const builder = new ProcedureBuilder(facilities, p.waypoints);
	const nasrAirports = new Map(x.airports.map(a => [a.ident, a]));
	const procedures = new Map(p.airports.map(a => [a.ident, a]));
	for (const ident of procedures.keys()) {
		if (!nasrAirports.has(ident)) throw new Error(`the CIFP extract ${p.cycle} has procedures of ${ident}, which the NASR extract ${x.cycle} lacks`);
	}
	const out = facilities.map(f => {
		const own = f.icaoStruct.type === 'A' ? procedures.get(f.icaoStruct.ident) : undefined;
		return own === undefined ? f : builder.airport(f as AirportFacility, own, runwayEndsOf(nasrAirports.get(own.ident)!));
	});
	return [...out, ...builder.made.values()];
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
