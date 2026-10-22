import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

/**
 * Extracts the SIDs, STARs and approaches of the airports of the NASR extract from the FAA's CIFP (ARINC 424, the file
 * FAACIFP18) into a neutral JSON file. Usage: node generator/navdata/extract-cifp.mjs <FAACIFP18>
 * The format is described in README.md. The coding stays as the CIFP publishes it: runway transitions keep `32B` and
 * `ALL`, and legs to the airport keep their fix. Turning the extract into the unit's procedures is navdata.ts's job.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NASR_FILE = /^nasr-\d{4}-\d{2}-\d{2}\.json$/;

/** The kind of a fix by the section and subsection of its record. */
const FIX_KINDS = {'PA': 'airport', 'PG': 'runway', 'PC': 'terminal', 'EA': 'fix', 'D ': 'vor', 'DB': 'ndb', 'PN': 'ndb'};
/** How the summary and the skip reasons name a section. */
const SECTION_NAMES = {'PA': 'airport', 'PG': 'runway', 'PC': 'terminal waypoint', 'EA': 'en route waypoint',
	'D ': 'VOR', 'DB': 'NDB', 'PN': 'terminal NDB', 'PI': 'localizer'};

/** The legs whose recommended navaid the extract keeps: the arc's center and the radial or bearing of the others. */
const NAVAID_LEGS = new Set(['AF', 'CF', 'PI']);

/**
 * The part of a SID or STAR each route type (column 20) fills. SIDs: 1, 4 and T (vector SID) runway transition, 2 and 5
 * common route, 3, 6 and V (vector SID) en route transition. STARs: 1 and 4 en route transition, 2 and 5 common route,
 * 3 and 6 runway transition. Any other route type (engine out SIDs, profile descents) skips its procedure.
 */
const ROUTE_PARTS = {
	D: {'1': 'runways', '4': 'runways', 'T': 'runways', '2': 'common', '5': 'common', '3': 'transitions', '6': 'transitions',
		'V': 'transitions'},
	E: {'1': 'transitions', '4': 'transitions', '2': 'common', '5': 'common', '3': 'runways', '6': 'runways'},
};
const PROCEDURE_KINDS = {D: 'SID', E: 'STAR', F: 'approach'};

/** Waypoint description column 43: the role of the fix in an approach. */
const ROLES = {A: 'IAF', C: 'IAF', D: 'IAF', B: 'IF', I: 'IF', F: 'FAF', M: 'MAP'};

/** Coordinates as the data publishes them are accurate to about a centimeter, more digits are noise. */
const round8 = value => Math.round(value * 1e8) / 1e8;

/** Code point order, independent of the locale, so the output is the same on every machine. */
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;

/** "N47263435" or "W122134411": degrees, minutes, seconds and hundredths; null for anything else. */
function coordinate(text) {
	const m = /^([NSEW])(\d{2,3})(\d{2})(\d{4})$/.exec(text);
	if (m === null) return null;
	const value = Number(m[2]) + Number(m[3]) / 60 + Number(m[4]) / 100 / 3600;
	return round8(m[1] === 'S' || m[1] === 'W' ? -value : value);
}

/**
 * A fixed-point field: blank is absent, digits are the value with `decimals` implied decimals, anything else (a true
 * course "123T", say) is NaN, which makes the extract skip the procedure.
 */
function fixed(text, decimals) {
	if (text.trim() === '') return undefined;
	return /^\d+$/.test(text) ? Number(text) / 10 ** decimals : NaN;
}

/**
 * @typedef {{ident: string, region: string, section: string}} RecordFix
 * @typedef {object} LegRecord
 * @property {'leg'} type
 * @property {string} airport
 * @property {'D' | 'E' | 'F'} subsection
 * @property {string} procedure
 * @property {string} routeType
 * @property {string} transition
 * @property {RecordFix} [fix]
 * @property {string} description the waypoint description, columns 40 to 43
 * @property {string} turn column 44
 * @property {string} pathTerminator
 * @property {RecordFix} [navaid]
 * @property {number} [arcRadiusNm]
 * @property {number} [thetaDeg]
 * @property {number} [rhoNm]
 * @property {number} [courseMag]
 * @typedef {object} PointRecord
 * @property {'point'} type
 * @property {string} section
 * @property {string} [airport]
 * @property {string} ident
 * @property {string} region
 * @property {number} lat
 * @property {number} lon
 * @property {true} [withoutVor] a TACAN or DME of section D, at the position of its DME
 * @typedef {object} RnavRecord the levels of service an approach continuation record of application W authorizes
 * @property {'rnav'} type
 * @property {string} airport
 * @property {string} procedure
 * @property {string} routeType
 * @property {string} transition
 * @property {string[]} levels as published: 'LPV' or 'LP', 'LNAV/VNAV', 'LNAV'
 * @typedef {{type: 'header', cycle: string}} HeaderRecord
 * @typedef {LegRecord | RnavRecord | PointRecord | HeaderRecord} CifpRecord
 */

/**
 * Reads one record of the CIFP. Columns are 1-based in the comments and ARINC 424, 0-based in the code. A continuation
 * record never becomes a leg: an approach's continuation of application W gives its RNAV levels, every other one null,
 * as does every record the extract does not use.
 * @param {string} line
 * @returns {CifpRecord | null}
 */
export function parseRecord(line) {
	if (line.startsWith('HDR01')) return {type: 'header', cycle: line.slice(35, 39)};
	if (line[0] !== 'S') return null;
	const section = line.slice(4, 6);

	// Airport procedures: section P, subsection D, E or F in column 13, continuation number in column 39
	if (section === 'P ' && 'DEF'.includes(line[12])) {
		if (line[38] !== '0' && line[38] !== '1') {
			if (line[12] !== 'F' || line[39] !== 'W') return null;
			// Three fields of eleven columns from column 41 (LPV or LP, LNAV/VNAV, LNAV), each A (authorized) or N (not)
			// and the level. An RNP AR approach publishes its RNP values in other columns and leaves these blank.
			const levels = [line.slice(40, 51), line.slice(51, 62), line.slice(62, 73)]
				.filter(field => field[0] === 'A').map(field => field.slice(1).trim());
			return {type: 'rnav', airport: line.slice(6, 10).trim(), procedure: line.slice(13, 19).trim(), routeType: line[19],
				transition: line.slice(20, 25).trim(), levels};
		}
		/** @type {LegRecord} */
		const record = {
			type: 'leg',
			airport: line.slice(6, 10).trim(),
			subsection: /** @type {'D' | 'E' | 'F'} */ (line[12]),
			procedure: line.slice(13, 19).trim(),
			routeType: line[19],
			transition: line.slice(20, 25).trim(),
			description: line.slice(39, 43),
			turn: line[43],
			pathTerminator: line.slice(47, 49),
		};
		const fixIdent = line.slice(29, 34).trim();
		if (fixIdent !== '') record.fix = {ident: fixIdent, region: line.slice(34, 36), section: line.slice(36, 38)};
		const navaidIdent = line.slice(50, 54).trim();
		if (navaidIdent !== '') record.navaid = {ident: navaidIdent, region: line.slice(54, 56), section: line.slice(78, 80)};
		const values = {
			arcRadiusNm: fixed(line.slice(56, 62), 3),
			thetaDeg: fixed(line.slice(62, 66), 1),
			rhoNm: fixed(line.slice(66, 70), 1),
			courseMag: fixed(line.slice(70, 74), 1),
		};
		for (const [key, value] of Object.entries(values)) if (value !== undefined) record[key] = value;
		return record;
	}

	// Waypoints and navaids: the ident from column 14, the region in 20-21, the continuation number in 22, the position
	// in 33-51. Terminal waypoints (P, subsection C in column 13) and terminal NDBs (PN) carry their airport in 7-10.
	let point;
	if (section === 'EA') point = {section, ident: line.slice(13, 18).trim()};
	else if (section === 'P ' && line[12] === 'C') point = {section: 'PC', airport: line.slice(6, 10).trim(), ident: line.slice(13, 18).trim()};
	else if (section === 'D ' || section === 'DB') point = {section, ident: line.slice(13, 17).trim()};
	else if (section === 'PN') point = {section, airport: line.slice(6, 10).trim(), ident: line.slice(13, 17).trim()};
	else return null;
	if (line[21] !== '0' && line[21] !== '1') return null;
	const lat = coordinate(line.slice(32, 41));
	const lon = coordinate(line.slice(41, 51));
	if (lat !== null && lon !== null) return {type: 'point', ...point, region: line.slice(19, 21), lat, lon};
	// A TACAN or DME without VOR has its position in the DME columns 56-74 only
	const dmeLat = coordinate(line.slice(55, 64));
	const dmeLon = coordinate(line.slice(64, 74));
	if (section !== 'D ' || dmeLat === null || dmeLon === null) return null;
	return {type: 'point', ...point, region: line.slice(19, 21), lat: dmeLat, lon: dmeLon, withoutVor: true};
}

/**
 * The extract. README.md describes the fields.
 * @typedef {{ident: string, region: string, kind: string, airport?: string}} FixRef
 * @typedef {object} CifpLeg
 * @property {string} type
 * @property {FixRef} [fix]
 * @property {FixRef} [navaid]
 * @property {number} [courseMag]
 * @property {number} [arcRadiusNm]
 * @property {number} [thetaDeg]
 * @property {number} [rhoNm]
 * @property {'L' | 'R'} [turn]
 * @property {boolean} [flyOver]
 * @property {'IAF' | 'IF' | 'FAF' | 'MAP'} [role]
 * @typedef {{name: string, legs: CifpLeg[]}} Transition
 * @typedef {{name: string, runways: {runway: string, legs: CifpLeg[]}[], common: CifpLeg[], transitions: Transition[]}} Proc
 * @typedef {object} Approach
 * @property {string} ident
 * @property {string} type
 * @property {string} runway
 * @property {string} suffix
 * @property {string[]} rnav the RNAV levels the approach is authorized for, as published ('LPV', 'LNAV/VNAV', 'LNAV')
 * @property {Transition[]} transitions
 * @property {CifpLeg[]} final
 * @property {CifpLeg[]} missed
 * @typedef {{ident: string, departures: Proc[], arrivals: Proc[], approaches: Approach[]}} CifpAirport
 * @typedef {{ident: string, region: string, kind: string, airport?: string, lat: number, lon: number}} Waypoint
 * @typedef {{cycle: string, source: string, airports: CifpAirport[], waypoints: Waypoint[]}} CifpExtract
 * @typedef {object} CifpStats
 * @property {{airports: number, departures: number, arrivals: number, approaches: number, waypoints: number}} counts
 * @property {Record<string, string[]>} skipped the procedures skipped, by reason
 * @property {Record<string, number>} notes what the extract left out of a procedure it kept, by reason
 */

/**
 * Extracts the procedures of the NASR extract's airports from the text of FAACIFP18.
 * @param {string} cifpText
 * @param {import('../lib/navdata.ts').NavdataExtract} nasr
 * @param {Partial<CifpStats>} [stats] filled with what the summary prints
 * @returns {CifpExtract}
 */
export function extractCifp(cifpText, nasr, stats = {}) {
	const skipped = stats.skipped = {};
	const notes = stats.notes = {};
	const note = reason => notes[reason] = (notes[reason] ?? 0) + 1;

	const airportIdents = new Set(nasr.airports.map(a => a.ident));
	let cycle;
	/** @type {Map<string, PointRecord>} */
	const points = new Map();
	const pointKey = (section, ident, region, airport) => `${section}|${ident}|${region}|${airport ?? ''}`;
	// airport -> procedure -> part (route type and transition) -> legs, each in file order
	/** @type {Map<string, Map<string, Map<string, LegRecord[]>>>} */
	const procedures = new Map();
	// airport and approach -> the RNAV levels of the first W continuation of its final approach
	/** @type {Map<string, string[]>} */
	const rnavLevels = new Map();

	for (const line of cifpText.split(/\r?\n/)) {
		const record = parseRecord(line);
		if (record === null) continue;
		if (record.type === 'header') {
			cycle = record.cycle;
		} else if (record.type === 'point') {
			const key = pointKey(record.section, record.ident, record.region, record.airport);
			if (!points.has(key)) points.set(key, record);
		} else if (record.type === 'rnav') {
			const key = `${record.airport}|${record.procedure}`;
			if (record.routeType !== 'A' && !rnavLevels.has(key)) rnavLevels.set(key, record.levels);
		} else if (airportIdents.has(record.airport)) {
			const ofAirport = procedures.get(record.airport) ?? new Map();
			procedures.set(record.airport, ofAirport);
			const procedureKey = `${record.subsection}|${record.procedure}`;
			const parts = ofAirport.get(procedureKey) ?? new Map();
			ofAirport.set(procedureKey, parts);
			const partKey = `${record.routeType}|${record.transition}`;
			parts.set(partKey, [...(parts.get(partKey) ?? []), record]);
		}
	}
	if (cycle === undefined) throw new Error('no HDR01 record: not a CIFP file');

	const nasrKeys = new Set([
		...nasr.fixes.map(f => `fix|${f.ident}|${f.region}`),
		...nasr.vors.map(v => `vor|${v.ident}|${v.region}`),
		...nasr.ndbs.map(n => `ndb|${n.ident}|${n.region}`),
	]);
	const runwayEnds = new Map(nasr.airports.map(a => [a.ident, new Set(a.runways.flatMap(r => r.designation.split('-')))]));

	/**
	 * The reference to a fix of a leg of the airport, and the waypoint to add where NASR lacks it, or the reason it
	 * cannot be resolved.
	 * @returns {{ref: FixRef, waypoint?: Waypoint} | {reason: string}}
	 */
	const resolve = (fix, airport) => {
		const kind = FIX_KINDS[fix.section];
		const name = `${fix.ident} (${fix.region}, ${SECTION_NAMES[fix.section] ?? `section "${fix.section}"`})`;
		if (kind === undefined) return {reason: `fix ${name} of a kind the extract does not know`};
		if (kind === 'airport') {
			return airportIdents.has(fix.ident) ? {ref: {ident: fix.ident, region: fix.region, kind}}
				: {reason: `airport ${fix.ident} is not in the NASR extract`};
		}
		if (kind === 'runway') {
			return runwayEnds.get(airport)?.has(fix.ident.replace(/^RW/, ''))
				? {ref: {ident: fix.ident, region: fix.region, kind, airport}}
				: {reason: `runway ${fix.ident} is not a runway of ${airport} in the NASR extract`};
		}
		// A terminal waypoint or NDB belongs to the airport whose procedure names it
		const ofAirport = fix.section === 'PC' || fix.section === 'PN' ? airport : undefined;
		/** @type {FixRef} */
		const ref = {ident: fix.ident, region: fix.region, kind};
		if (ofAirport !== undefined) ref.airport = ofAirport;
		// NASR files terminal waypoints as fixes, without their airport: the reference keeps it, the lookup does not
		const nasrKind = kind === 'terminal' ? 'fix' : kind;
		if (nasrKeys.has(`${nasrKind}|${fix.ident}|${fix.region}`)) return {ref};
		// The CIFP files terminal waypoints and NDBs under their airport
		const point = points.get(pointKey(fix.section, fix.ident, fix.region, ofAirport));
		if (point === undefined) return {reason: `fix ${name} is neither in the NASR extract nor in the CIFP`};
		if (point.withoutVor) return {reason: `fix ${name} is a TACAN or DME without VOR`};
		return {ref, waypoint: {...ref, lat: point.lat, lon: point.lon}};
	};

	/** @type {Map<string, Waypoint>} */
	const waypoints = new Map();

	/**
	 * The legs of one part of a procedure, or the reason it cannot be used.
	 * @param {LegRecord[]} records
	 * @param {Waypoint[]} found collects the waypoints the legs need from the CIFP
	 */
	const buildLegs = (records, airport, found) => {
		/** @type {CifpLeg[]} */
		const legs = [];
		for (const r of records) {
			/** @type {CifpLeg} */
			const leg = {type: r.pathTerminator};
			if (r.fix !== undefined) {
				const resolved = resolve(r.fix, airport);
				if ('reason' in resolved) return {reason: resolved.reason};
				leg.fix = resolved.ref;
				if (resolved.waypoint !== undefined) found.push(resolved.waypoint);
			}
			if (r.navaid !== undefined && NAVAID_LEGS.has(r.pathTerminator)) {
				// Neither the NASR extract nor this one has localizers, TACANs or DMEs. The unit reads the navaid of an AF
				// leg only, as a VOR, so a CF or PI leg goes without; an arc around one of them skips its procedure.
				const station = r.navaid.section === 'PI' ? 'a localizer'
					: points.get(pointKey(r.navaid.section, r.navaid.ident, r.navaid.region))?.withoutVor ? 'a TACAN or DME without VOR'
						: undefined;
				if (station !== undefined && r.pathTerminator !== 'AF') {
					note(`navaid of a CF or PI leg that is ${station}, left out`);
				} else {
					const resolved = resolve(r.navaid, airport);
					if ('reason' in resolved) return {reason: resolved.reason.replace(/^fix /, 'navaid ')};
					leg.navaid = resolved.ref;
					if (resolved.waypoint !== undefined) found.push(resolved.waypoint);
				}
			}
			for (const key of ['courseMag', 'arcRadiusNm', 'thetaDeg', 'rhoNm']) {
				if (r[key] === undefined) continue;
				if (Number.isNaN(r[key])) return {reason: `leg with a ${key} the extract cannot read`};
				leg[key] = r[key];
			}
			if (r.turn === 'L' || r.turn === 'R') leg.turn = r.turn;
			// column 41: Y fly-over, B fly-over at the end of a route part
			if (r.description[1] === 'Y' || r.description[1] === 'B') leg.flyOver = true;
			const role = ROLES[r.description[3]];
			if (role !== undefined) leg.role = role;
			legs.push(leg);
		}
		return {legs};
	};

	/** A SID or STAR, or the reason it cannot be used. */
	const buildProcedure = (subsection, name, parts, airport, found) => {
		/** @type {Proc} */
		const procedure = {name, runways: [], common: [], transitions: []};
		for (const [key, records] of parts) {
			const [routeType, transition] = key.split('|');
			const part = ROUTE_PARTS[subsection][routeType];
			if (part === undefined) return {reason: `${PROCEDURE_KINDS[subsection]} of route type "${routeType}"`};
			const built = buildLegs(records, airport, found);
			if ('reason' in built) return built;
			if (part === 'common') procedure.common.push(...built.legs);
			else if (part === 'runways') procedure.runways.push({runway: transition.replace(/^RW/, ''), legs: built.legs});
			else procedure.transitions.push({name: transition, legs: built.legs});
		}
		procedure.runways.sort((x, y) => compare(x.runway, y.runway));
		procedure.transitions.sort((x, y) => compare(x.name, y.name));
		return {procedure};
	};

	/** An approach, or the reason it cannot be used. */
	const buildApproach = (ident, parts, airport, found) => {
		/** @type {Transition[]} */
		const transitions = [];
		/** @type {LegRecord[]} */
		const finalRecords = [];
		const finalTypes = new Set();
		for (const [key, records] of parts) {
			const [routeType, transition] = key.split('|');
			if (routeType === 'A') {
				const built = buildLegs(records, airport, found);
				if ('reason' in built) return built;
				transitions.push({name: transition, legs: built.legs});
			} else {
				finalTypes.add(routeType);
				finalRecords.push(...records);
			}
		}
		if (finalTypes.size !== 1) return {reason: `approach with ${finalTypes.size === 0 ? 'no' : 'more than one'} final approach route type`};
		const built = buildLegs(finalRecords, airport, found);
		if ('reason' in built) return built;
		// The missed approach starts after the MAP (column 43 M), or failing that at the leg column 42 marks as its first
		let missedFrom = finalRecords.findIndex(r => r.description[3] === 'M') + 1;
		if (missedFrom === 0) {
			missedFrom = finalRecords.findIndex(r => r.description[2] === 'M');
			if (missedFrom === -1) {
				note('approach without a missed approach');
				missedFrom = finalRecords.length;
			}
		}
		// R32LY: RNAV, runway 32L, suffix Y; R02-Y: runway 02; VOR-A: circling, no runway, suffix A
		const m = /^.(\d{2}[LRC]?)-?(.*)$/.exec(ident);
		transitions.sort((x, y) => compare(x.name, y.name));
		return {
			approach: {
				ident,
				// the approach type is the route type of the final approach, which a circling approach does not spell in
				// its ident (VOR-A is type S, a VOR approach with DME)
				type: [...finalTypes][0],
				runway: m === null ? '' : m[1],
				suffix: m === null ? ident.replace(/^.*-/, '') : m[2],
				rnav: rnavLevels.get(`${airport}|${ident}`) ?? [],
				transitions,
				final: built.legs.slice(0, missedFrom),
				missed: built.legs.slice(missedFrom),
			},
		};
	};

	/** @type {CifpAirport[]} */
	const airports = [];
	for (const ident of [...procedures.keys()].sort(compare)) {
		/** @type {CifpAirport} */
		const airport = {ident, departures: [], arrivals: [], approaches: []};
		for (const [key, parts] of procedures.get(ident)) {
			const [subsection, name] = key.split('|');
			/** @type {Waypoint[]} */
			const found = [];
			const built = subsection === 'F' ? buildApproach(name, parts, ident, found)
				: buildProcedure(subsection, name, parts, ident, found);
			if ('reason' in built) {
				(skipped[built.reason] ??= []).push(`${ident} ${PROCEDURE_KINDS[subsection]} ${name}`);
				continue;
			}
			if ('approach' in built) airport.approaches.push(built.approach);
			else (subsection === 'D' ? airport.departures : airport.arrivals).push(built.procedure);
			for (const w of found) waypoints.set(`${w.kind}|${w.ident}|${w.region}|${w.airport ?? ''}`, w);
		}
		airport.departures.sort((x, y) => compare(x.name, y.name));
		airport.arrivals.sort((x, y) => compare(x.name, y.name));
		airport.approaches.sort((x, y) => compare(x.ident, y.ident));
		airports.push(airport);
	}

	const waypointList = [...waypoints.values()].sort((x, y) => compare(x.ident, y.ident) || compare(x.region, y.region)
		|| compare(x.kind, y.kind) || compare(x.airport ?? '', y.airport ?? ''));
	stats.counts = {
		airports: airports.length,
		departures: airports.reduce((n, a) => n + a.departures.length, 0),
		arrivals: airports.reduce((n, a) => n + a.arrivals.length, 0),
		approaches: airports.reduce((n, a) => n + a.approaches.length, 0),
		waypoints: waypointList.length,
	};
	return {cycle, source: `FAA CIFP (FAACIFP18), cycle ${cycle}`, airports, waypoints: waypointList};
}

/** The text the CLI prints. */
function summary(extractedFile, nasrFile, result, stats) {
	const byKind = {};
	for (const w of result.waypoints) byKind[w.kind] = (byKind[w.kind] ?? 0) + 1;
	const lines = [
		`Wrote ${extractedFile}`,
		`Cycle ${result.cycle}, airports of ${nasrFile}`,
		`Airports with procedures ${stats.counts.airports}`,
		`SIDs ${stats.counts.departures}`,
		`STARs ${stats.counts.arrivals}`,
		`Approaches ${stats.counts.approaches}`,
		`Waypoints taken from the CIFP ${stats.counts.waypoints} (${Object.entries(byKind).sort((x, y) => compare(x[0], y[0]))
			.map(([kind, n]) => `${n} ${kind}`).join(', ')})`,
	];
	const reasons = Object.entries(stats.skipped).sort((x, y) => compare(x[0], y[0]));
	lines.push(reasons.length === 0 ? 'No procedure skipped' : 'Skipped:');
	for (const [reason, names] of reasons) lines.push(`  ${names.length} ${reason}: ${names.join(', ')}`);
	const notes = Object.entries(stats.notes).sort((x, y) => compare(x[0], y[0]));
	if (notes.length > 0) lines.push('Left out of procedures that were kept:');
	for (const [reason, count] of notes) lines.push(`  ${count} ${reason}`);
	return lines.join('\n');
}

/** The extract as written to disk. */
export const serialize = result => JSON.stringify(result, null, 2) + '\n';

function main(argv) {
	if (argv.length !== 1) {
		console.error('Usage: node generator/navdata/extract-cifp.mjs <FAACIFP18>');
		process.exit(2);
	}
	const nasrFile = fs.readdirSync(HERE).filter(f => NASR_FILE.test(f)).sort().pop();
	if (nasrFile === undefined) {
		console.error(`no nasr-*.json in ${HERE}; run generator/navdata/extract-nasr.mjs first`);
		process.exit(1);
	}
	const nasr = JSON.parse(fs.readFileSync(path.join(HERE, nasrFile), 'utf8'));
	/** @type {Partial<CifpStats>} */
	const stats = {};
	let result;
	try {
		result = extractCifp(fs.readFileSync(path.resolve(argv[0]), 'utf8'), nasr, stats);
	} catch (e) {
		console.error(e instanceof Error ? e.message : e);
		process.exit(1);
	}
	const file = path.join(HERE, `cifp-${result.cycle}.json`);
	fs.writeFileSync(file, serialize(result));
	console.log(summary(path.relative(process.cwd(), file), nasrFile, result, stats));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
