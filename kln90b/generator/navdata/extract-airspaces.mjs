import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import {fileURLToPath} from 'node:url';

/**
 * Extracts the class B and class C airspace and the low altitude Center (ARTCC) boundaries within the regions of
 * regions.json from the FAA's ADDS GeoJSON files (Class Airspace and Airspace Boundary) into a neutral JSON file.
 * Usage: node generator/navdata/extract-airspaces.mjs <Class_Airspace.geojson> <Airspace_Boundary.geojson> <YYYY-MM-DD>
 * The format is described in README.md. The files are read line by line: each feature is one line, and the class file
 * is far too large to load whole.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Mean earth radius in nautical miles. */
const EARTH_RADIUS_NM = 3440.065;

/** What the FAA calls the airspace we keep, by LOCAL_TYPE: the class files' US class B and C, the low altitude Center. */
const CLASS_KINDS = {CLASS_B: 'B', CLASS_C: 'C'};
const CENTER_TYPE = 'ARTCC_L';

/** The FAA's "no value" in a limit. A Center has no limits. */
const NO_VALUE = -9998;

const KIND_ORDER = {B: 0, C: 1, center: 2};

const SOURCE = 'FAA Aeronautical Data (ADDS) Class Airspace and Airspace Boundary, GeoJSON: class B and class C ' +
	'airspace and the low altitude ARTCC boundaries';

const toRad = deg => deg * Math.PI / 180;

/** Great circle distance in nautical miles (the same as extract-nasr.mjs). */
function distanceNm(lat1, lon1, lat2, lon2) {
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
	return 2 * EARTH_RADIUS_NM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Five decimals are about a meter, which is more than the screens can show. */
const round5 = value => Math.round(value * 1e5) / 1e5;

/** Code point order, independent of the locale, so the output is the same on every machine. */
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;

/**
 * @typedef {{name: string, lat: number, lon: number, radiusNm: number}} Region
 * @typedef {{name: string, kind: 'B' | 'C' | 'center', ident?: string, sector?: string, lowerFt: number,
 *   lowerRef: 'MSL' | 'SFC' | 'AGL', upperFt: number | null, upperRef: 'MSL' | 'AGL' | null,
 *   polygon: [number, number][]}} Airspace
 * @typedef {{date: string, source: string, airspaces: Airspace[]}} AirspaceExtract
 * @typedef {{counts: Record<string, number>, skipped: Record<string, number>}} AirspaceStats
 */

/**
 * The features of a GeoJSON file that has one feature per line, as parsed objects. Every other line (the collection's
 * header and its closing brackets) is ignored, and so is the comma that ends a feature line.
 * @param {string} file
 * @returns {AsyncGenerator<any>}
 */
async function* features(file) {
	const lines = readline.createInterface({input: fs.createReadStream(file), crlfDelay: Infinity});
	for await (const line of lines) {
		if (!line.startsWith('{"type":"Feature"')) continue;
		yield JSON.parse(line.trimEnd().replace(/,$/, ''));
	}
}

/**
 * The outer rings of a feature's geometry, one per polygon of a multipolygon. A ring is [lat, lon] pairs without the
 * closing vertex (GeoJSON repeats the first one) and without altitude. Other geometries have none.
 * @returns {[number, number][][]}
 */
function outerRings(geometry) {
	if (geometry === null || geometry === undefined) return [];
	const polygons = geometry.type === 'Polygon' ? [geometry.coordinates]
		: geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
	return polygons.map(polygon => {
		const ring = polygon[0].map(([lon, lat]) => [round5(lat), round5(lon)]);
		const first = ring[0];
		const last = ring[ring.length - 1];
		if (ring.length > 1 && first[0] === last[0] && first[1] === last[1]) ring.pop();
		return ring;
	});
}

/** Whether a point lies inside a ring (even-odd rule, on the latitude and longitude plane). */
function contains(ring, lat, lon) {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [latI, lonI] = ring[i];
		const [latJ, lonJ] = ring[j];
		if ((latI > lat) !== (latJ > lat) && lon < (lonJ - lonI) * (lat - latI) / (latJ - latI) + lonI) inside = !inside;
	}
	return inside;
}

/** A ring is in a region when one of its vertices lies within the region's radius or the region's center lies inside. */
function inRegions(ring, regions) {
	return regions.some(r => ring.some(([lat, lon]) => distanceNm(r.lat, r.lon, lat, lon) <= r.radiusNm) ||
		contains(ring, r.lat, r.lon));
}

/**
 * A limit of the data as feet and a reference, or null when the data has a code or unit the script does not read.
 * The surface is 0 feet whatever the value says, a flight level is hundreds of feet (and standard pressure altitude,
 * which the extract files with the mean sea level ones), and no value is the surface for a lower limit and unlimited
 * for an upper limit.
 * @param {'lower' | 'upper'} side
 */
function limit(properties, side) {
	const prefix = side.toUpperCase();
	const value = properties[`${prefix}_VAL`];
	const unit = properties[`${prefix}_UOM`];
	const code = properties[`${prefix}_CODE`];
	if (value === NO_VALUE) return side === 'lower' ? {ft: 0, ref: 'SFC'} : {ft: null, ref: null};
	if (typeof value !== 'number' || !Number.isFinite(value)) return null;
	if (code === 'SFC' && side === 'lower') return {ft: 0, ref: 'SFC'};
	if (unit === 'FL' && code === 'STD') return {ft: value * 100, ref: 'MSL'};
	if (unit === 'FT' && (code === 'MSL' || code === 'AGL')) return {ft: value, ref: code};
	return null;
}

/** The text for the summary when a limit is not readable. */
const unreadable = (properties, side) => {
	const prefix = side.toUpperCase();
	return `with a ${side} limit the script does not read (${prefix}_VAL ${properties[`${prefix}_VAL`]}, ` +
		`${prefix}_UOM ${properties[`${prefix}_UOM`]}, ${prefix}_CODE ${properties[`${prefix}_CODE`]})`;
};

/**
 * Extracts the airspaces within the regions from the two files.
 * @param {string} classFile the Class Airspace GeoJSON file
 * @param {string} boundaryFile the Airspace Boundary GeoJSON file
 * @param {Region[]} regions
 * @param {string} date the download date, YYYY-MM-DD
 * @param {Partial<AirspaceStats>} [stats] filled with what the summary prints
 * @returns {Promise<AirspaceExtract>}
 */
export async function extractAirspaces(classFile, boundaryFile, regions, date, stats = {}) {
	/** @type {Record<string, number>} */
	const counts = {B: 0, C: 0, center: 0};
	/** @type {Record<string, number>} */
	const skipped = {};
	const skip = reason => skipped[reason] = (skipped[reason] ?? 0) + 1;
	/** @type {Airspace[]} */
	const airspaces = [];

	/** The airspaces of one feature, when it is one we keep and lies in a region. */
	function take(feature, kind, label) {
		const properties = feature.properties;
		const rings = outerRings(feature.geometry).filter(ring => ring.length >= 3 && inRegions(ring, regions));
		if (rings.length === 0) return;
		const lower = limit(properties, 'lower');
		const upper = limit(properties, 'upper');
		if (lower === null || upper === null) {
			skip(`${label} ${unreadable(properties, lower === null ? 'lower' : 'upper')}`);
			return;
		}
		for (const polygon of rings) {
			/** @type {Airspace} */
			const airspace = {name: String(properties.NAME).trim(), kind};
			const ident = properties.IDENT;
			if (typeof ident === 'string' && ident !== '') airspace.ident = ident;
			const sector = properties.SECTOR;
			if (kind !== 'center' && typeof sector === 'string' && sector !== '') airspace.sector = sector;
			Object.assign(airspace, {lowerFt: lower.ft, lowerRef: lower.ref, upperFt: upper.ft, upperRef: upper.ref, polygon});
			airspaces.push(airspace);
			counts[kind]++;
		}
	}

	for await (const feature of features(classFile)) {
		const kind = CLASS_KINDS[feature.properties.LOCAL_TYPE];
		if (kind !== undefined) take(feature, kind, `class ${kind} airspace`);
	}
	for await (const feature of features(boundaryFile)) {
		if (feature.properties.LOCAL_TYPE === CENTER_TYPE) take(feature, 'center', 'Center');
	}

	airspaces.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || compare(a.name, b.name) ||
		compare(a.sector ?? '', b.sector ?? '') || a.lowerFt - b.lowerFt || compare(JSON.stringify(a.polygon), JSON.stringify(b.polygon)));

	stats.counts = counts;
	stats.skipped = skipped;
	return {date, source: SOURCE, airspaces};
}

/** The text the CLI prints. */
function summary(extractedFile, result, stats) {
	const lines = [
		`Wrote ${extractedFile}`,
		`Date ${result.date}`,
		`Class B airspaces ${stats.counts.B}`,
		`Class C airspaces ${stats.counts.C}`,
		`Centers ${stats.counts.center}`,
	];
	const reasons = Object.entries(stats.skipped).sort((x, y) => compare(x[0], y[0]));
	lines.push(reasons.length === 0 ? 'Nothing skipped' : 'Skipped:');
	for (const [reason, count] of reasons) lines.push(`  ${count} ${reason}`);
	return lines.join('\n');
}

/** The extract as written to disk: indented, with each vertex of a polygon on one line. */
export const serialize = result => JSON.stringify(result, null, 2)
	.replace(/\[\n\s+(-?[\d.]+),\n\s+(-?[\d.]+)\n\s+\]/g, '[$1, $2]') + '\n';

async function main(argv) {
	if (argv.length !== 3 || !/^\d{4}-\d{2}-\d{2}$/.test(argv[2])) {
		console.error('Usage: node generator/navdata/extract-airspaces.mjs <Class_Airspace.geojson> <Airspace_Boundary.geojson> <YYYY-MM-DD>');
		process.exit(2);
	}
	const regions = JSON.parse(fs.readFileSync(path.join(HERE, 'regions.json'), 'utf8'));
	/** @type {Partial<AirspaceStats>} */
	const stats = {};
	let result;
	try {
		result = await extractAirspaces(path.resolve(argv[0]), path.resolve(argv[1]), regions, argv[2], stats);
	} catch (e) {
		console.error(e instanceof Error ? e.message : e);
		process.exit(1);
	}
	const file = path.join(HERE, `airspaces-${result.date}.json`);
	fs.writeFileSync(file, serialize(result));
	console.log(summary(path.relative(process.cwd(), file), result, stats));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
