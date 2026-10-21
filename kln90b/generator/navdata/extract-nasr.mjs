import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

/**
 * Extracts the part of the FAA's NASR 28-day subscription (CSV) that the example screens need, for the regions in
 * regions.json, into a neutral JSON file. Usage: node generator/navdata/extract-nasr.mjs <unzipped CSV folder>
 * The format is described in README.md.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Mean earth radius in nautical miles. */
const EARTH_RADIUS_NM = 3440.065;

/** The columns the script reads from each file. The structure files of the download describe them. */
const REQUIRED_COLUMNS = {
	'APT_BASE.csv': ['EFF_DATE', 'SITE_TYPE_CODE', 'ARPT_ID', 'CITY', 'ARPT_NAME', 'FACILITY_USE_CODE', 'LAT_DECIMAL',
		'LONG_DECIMAL', 'ELEV', 'MAG_VARN', 'MAG_HEMIS', 'TWR_TYPE_CODE'],
	'APT_RWY.csv': ['ARPT_ID', 'RWY_ID', 'RWY_LEN', 'SURFACE_TYPE_CODE', 'RWY_LGT_CODE'],
	'APT_RWY_END.csv': ['ARPT_ID', 'RWY_ID', 'RWY_END_ID', 'TRUE_ALIGNMENT', 'LAT_DECIMAL', 'LONG_DECIMAL'],
	'FRQ.csv': ['SERVICED_FACILITY', 'SERVICED_SITE_TYPE', 'FREQ', 'FREQ_USE'],
	'NAV_BASE.csv': ['EFF_DATE', 'NAV_ID', 'NAV_TYPE', 'NAV_STATUS', 'NAME', 'HIGH_ALT_ARTCC_ID', 'LOW_ALT_ARTCC_ID',
		'LAT_DECIMAL', 'LONG_DECIMAL', 'MAG_VARN', 'MAG_VARN_HEMIS', 'FREQ'],
	'FIX_BASE.csv': ['EFF_DATE', 'FIX_ID', 'ICAO_REGION_CODE', 'LAT_DECIMAL', 'LONG_DECIMAL', 'ARTCC_ID_HIGH',
		'ARTCC_ID_LOW'],
};

/** NAV_TYPE values the data layout lists. Anything else is counted as unknown and skipped. */
const KNOWN_NAV_TYPES = new Set(['CONSOLAN', 'DME', 'FAN MARKER', 'MARINE NDB', 'MARINE NDB/DME', 'NDB', 'NDB/DME',
	'TACAN', 'UHF/NDB', 'VOR', 'VOR/DME', 'VORTAC', 'VOT']);
const VOR_TYPES = new Set(['VOR', 'VOR/DME', 'VORTAC']);
const NDB_TYPES = new Set(['NDB', 'NDB/DME']);

/** The region of a record that has no ICAO region and whose ARTCC has no fixes. */
const FALLBACK_REGION = 'K1';

/**
 * Parses RFC 4180 CSV: quoted fields with commas, doubled quotes and line breaks, CRLF or LF, a leading byte order
 * mark. The first row is the header; every other row becomes an object keyed by it. Blank lines are skipped.
 * @param {string} text
 * @returns {Record<string, string>[]}
 */
export function parseCsv(text) {
	if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
	/** @type {string[][]} */
	const rows = [];
	let row = [];
	let field = '';
	let quoted = false;
	let fieldStarted = false;
	const endField = () => {
		row.push(field);
		field = '';
		fieldStarted = false;
	};
	const endRow = () => {
		endField();
		// a blank line parses as one empty field
		if (row.length > 1 || row[0] !== '') rows.push(row);
		row = [];
	};
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (quoted) {
			if (c === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					quoted = false;
				}
			} else {
				field += c;
			}
		} else if (c === '"' && !fieldStarted) {
			quoted = true;
			fieldStarted = true;
		} else if (c === ',') {
			endField();
		} else if (c === '\n') {
			endRow();
		} else if (c === '\r') {
			if (text[i + 1] !== '\n') endRow();
		} else {
			field += c;
			fieldStarted = true;
		}
	}
	if (fieldStarted || field !== '' || row.length > 0) endRow();

	if (rows.length === 0) return [];
	const header = rows[0];
	return rows.slice(1).map(values => {
		/** @type {Record<string, string>} */
		const record = {};
		header.forEach((name, i) => record[name] = values[i] ?? '');
		return record;
	});
}

const toRad = deg => deg * Math.PI / 180;
const toDeg = rad => rad * 180 / Math.PI;

/** Great circle distance in nautical miles. */
function distanceNm(lat1, lon1, lat2, lon2) {
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
	return 2 * EARTH_RADIUS_NM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Initial true course from point 1 to point 2, 0 <= course < 360. */
function bearing(lat1, lon1, lat2, lon2) {
	const dLon = toRad(lon2 - lon1);
	const y = Math.sin(dLon) * Math.cos(toRad(lat2));
	const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
	return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Great circle midpoint. */
function midpoint(lat1, lon1, lat2, lon2) {
	const [p1, l1, p2] = [toRad(lat1), toRad(lon1), toRad(lat2)];
	const dLon = toRad(lon2 - lon1);
	const bx = Math.cos(p2) * Math.cos(dLon);
	const by = Math.cos(p2) * Math.sin(dLon);
	const lat = Math.atan2(Math.sin(p1) + Math.sin(p2), Math.hypot(Math.cos(p1) + bx, by));
	const lon = l1 + Math.atan2(by, Math.cos(p1) + bx);
	return {lat: toDeg(lat), lon: ((toDeg(lon) + 540) % 360) - 180};
}

/** Coordinates as the data publishes them are accurate to about a centimeter, more digits are noise. */
const round8 = value => Math.round(value * 1e8) / 1e8;

/** A number, or null for a blank or unreadable field. */
function num(text) {
	if (text === undefined || text.trim() === '') return null;
	const value = Number(text);
	return Number.isFinite(value) ? value : null;
}

/** Code point order, independent of the locale, so the output is the same on every machine. */
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;

/**
 * Reads one CSV file and checks its columns.
 * @param {string} folder
 * @param {string} file
 * @returns {Record<string, string>[]}
 */
function readTable(folder, file) {
	const fullPath = path.join(folder, file);
	if (!fs.existsSync(fullPath)) throw new Error(`${file}: not found in ${folder}`);
	const rows = parseCsv(fs.readFileSync(fullPath, 'utf8'));
	if (rows.length === 0) throw new Error(`${file}: no data rows`);
	const missing = REQUIRED_COLUMNS[file].filter(column => !(column in rows[0]));
	if (missing.length > 0) throw new Error(`${file}: missing column${missing.length > 1 ? 's' : ''} ${missing.join(', ')}`);
	return rows;
}

/** "2026/10/01" -> "2026-10-01" */
function effectiveDate(file, rows) {
	const text = rows[0].EFF_DATE;
	if (!/^\d{4}\/\d{2}\/\d{2}$/.test(text)) throw new Error(`${file}: EFF_DATE "${text}" is not YYYY/MM/DD`);
	return text.replace(/\//g, '-');
}

/**
 * @typedef {{name: string, lat: number, lon: number, radiusNm: number}} Region
 * @typedef {object} ExtractStats
 * @property {{airports: number, vors: number, ndbs: number, fixes: number}} counts
 * @property {number} regionsFromArtcc records whose region came from the fixes of their ARTCC
 * @property {number} regionsDefaulted records without a region whose ARTCC has no fixes, set to K1
 * @property {Record<string, number>} skipped records and values the script could not use, by reason
 */

/**
 * Extracts the records within the regions from the unzipped NASR CSV folder.
 * @param {string} folder
 * @param {Region[]} regions
 * @param {Partial<ExtractStats>} [stats] filled with what the summary prints
 */
export function extract(folder, regions, stats = {}) {
	const apt = readTable(folder, 'APT_BASE.csv');
	const rwy = readTable(folder, 'APT_RWY.csv');
	const rwyEnd = readTable(folder, 'APT_RWY_END.csv');
	const frq = readTable(folder, 'FRQ.csv');
	const nav = readTable(folder, 'NAV_BASE.csv');
	const fix = readTable(folder, 'FIX_BASE.csv');

	const cycle = effectiveDate('APT_BASE.csv', apt);
	for (const [file, rows] of [['NAV_BASE.csv', nav], ['FIX_BASE.csv', fix]]) {
		if (effectiveDate(file, rows) !== cycle) {
			throw new Error(`${file}: effective date ${effectiveDate(file, rows)} differs from ${cycle} in APT_BASE.csv`);
		}
	}

	const skipped = stats.skipped = {};
	const skip = reason => skipped[reason] = (skipped[reason] ?? 0) + 1;
	stats.regionsFromArtcc = 0;
	stats.regionsDefaulted = 0;

	const inside = (lat, lon) => regions.some(r => distanceNm(r.lat, r.lon, lat, lon) <= r.radiusNm);

	// The ICAO region of a record without one is the region most of the fixes of its ARTCC carry. Each fix counts for
	// its low and its high ARTCC.
	/** @type {Map<string, Map<string, number>>} */
	const votes = new Map();
	for (const f of fix) {
		if (f.ICAO_REGION_CODE === '') continue;
		for (const artcc of new Set([f.ARTCC_ID_LOW, f.ARTCC_ID_HIGH])) {
			if (artcc === '') continue;
			const counts = votes.get(artcc) ?? new Map();
			counts.set(f.ICAO_REGION_CODE, (counts.get(f.ICAO_REGION_CODE) ?? 0) + 1);
			votes.set(artcc, counts);
		}
	}
	/** @type {Map<string, string>} */
	const artccRegion = new Map();
	for (const [artcc, counts] of votes) {
		artccRegion.set(artcc, [...counts].sort((a, b) => b[1] - a[1] || compare(a[0], b[0]))[0][0]);
	}
	const regionOfArtcc = (...artccs) => {
		for (const artcc of artccs) {
			const region = artccRegion.get(artcc);
			if (region !== undefined) {
				stats.regionsFromArtcc++;
				return region;
			}
		}
		stats.regionsDefaulted++;
		return FALLBACK_REGION;
	};

	/** Magnetic variation, east positive. */
	const declinationEast = (value, hemisphere, what) => {
		const degrees = num(value);
		if (degrees === null) {
			skip(`${what} without magnetic variation (set to 0)`);
			return 0;
		}
		if (hemisphere === 'E') return degrees;
		if (hemisphere === 'W') return -degrees;
		skip(`${what} with unknown magnetic variation hemisphere "${hemisphere}" (set to 0)`);
		return 0;
	};

	// Airports
	/** @type {Map<string, Map<string, Record<string, string>[]>>} */
	const endsOf = new Map();
	for (const end of rwyEnd) {
		const byRunway = endsOf.get(end.ARPT_ID) ?? new Map();
		byRunway.set(end.RWY_ID, [...(byRunway.get(end.RWY_ID) ?? []), end]);
		endsOf.set(end.ARPT_ID, byRunway);
	}
	/** @type {Map<string, Record<string, string>[]>} */
	const runwaysOf = new Map();
	for (const r of rwy) runwaysOf.set(r.ARPT_ID, [...(runwaysOf.get(r.ARPT_ID) ?? []), r]);
	/** @type {Map<string, {use: string, mhz: number}[]>} */
	const frequenciesOf = new Map();
	for (const f of frq) {
		if (f.SERVICED_SITE_TYPE !== 'AIRPORT' && f.SERVICED_SITE_TYPE !== 'HELIPORT') continue;
		if (f.FREQ.trim() === '') continue;
		const mhz = num(f.FREQ);
		if (mhz === null) {
			// e.g. "122.1R", a receive-only frequency
			skip('airport frequency that is not a plain number');
			continue;
		}
		const key = `${f.SERVICED_SITE_TYPE}|${f.SERVICED_FACILITY}`;
		const list = frequenciesOf.get(key) ?? [];
		// the same frequency is published once for every sector or procedure that uses it
		if (!list.some(e => e.use === f.FREQ_USE && e.mhz === mhz)) list.push({use: f.FREQ_USE, mhz});
		frequenciesOf.set(key, list);
	}

	const airports = [];
	for (const a of apt) {
		const isHeliport = a.SITE_TYPE_CODE === 'H';
		if ((a.SITE_TYPE_CODE !== 'A' && !isHeliport) || a.FACILITY_USE_CODE !== 'PU') continue;
		const lat = num(a.LAT_DECIMAL);
		const lon = num(a.LONG_DECIMAL);
		if (lat === null || lon === null) {
			skip('airport without position');
			continue;
		}
		if (!inside(lat, lon)) continue;
		const elevation = num(a.ELEV);
		if (elevation === null) skip('airport without elevation (set to 0)');
		const variation = num(a.MAG_VARN) === null ? 0 : declinationEast(a.MAG_VARN, a.MAG_HEMIS, 'airport');

		const runways = [];
		for (const r of runwaysOf.get(a.ARPT_ID) ?? []) {
			const [firstId, secondId] = r.RWY_ID.split('/');
			const ends = endsOf.get(a.ARPT_ID)?.get(r.RWY_ID) ?? [];
			const lowEnd = ends.find(e => e.RWY_END_ID === firstId) ?? ends[0];
			const points = ends
				.map(e => ({lat: num(e.LAT_DECIMAL), lon: num(e.LONG_DECIMAL)}))
				.filter(p => p.lat !== null && p.lon !== null);

			let position;
			if (points.length >= 2) {
				position = midpoint(points[0].lat, points[0].lon, points[1].lat, points[1].lon);
			} else if (points.length === 1) {
				position = points[0];
				skip('runway with one end position, placed at that end');
			} else {
				position = {lat, lon};
				skip('runway without end positions, placed at the airport');
			}

			let headingTrue = lowEnd === undefined ? null : num(lowEnd.TRUE_ALIGNMENT);
			if (headingTrue === null) {
				const lowPoint = lowEnd === undefined ? null : {lat: num(lowEnd.LAT_DECIMAL), lon: num(lowEnd.LONG_DECIMAL)};
				const highEnd = ends.find(e => e !== lowEnd);
				const highPoint = highEnd === undefined ? null : {lat: num(highEnd.LAT_DECIMAL), lon: num(highEnd.LONG_DECIMAL)};
				if (lowPoint?.lat != null && lowPoint.lon != null && highPoint?.lat != null && highPoint.lon != null) {
					headingTrue = bearing(lowPoint.lat, lowPoint.lon, highPoint.lat, highPoint.lon);
					skip('runway without published alignment, taken from its end positions');
				} else if (/^\d{1,2}[LCRW]?$/.test(firstId) && secondId !== undefined) {
					headingTrue = parseInt(firstId, 10) * 10 + variation;
					skip('runway without published alignment, taken from its designation and the airport variation');
				} else {
					headingTrue = 0;
					skip('runway without published alignment (set to 0)');
				}
			}

			runways.push({
				designation: r.RWY_ID.replace('/', '-'),
				headingTrue: Math.round(((headingTrue % 360) + 360) % 360),
				lengthFt: num(r.RWY_LEN) ?? 0,
				surface: r.SURFACE_TYPE_CODE,
				lit: r.RWY_LGT_CODE !== '' && r.RWY_LGT_CODE !== 'NONE',
				lat: round8(position.lat),
				lon: round8(position.lon),
			});
		}
		runways.sort((x, y) => compare(x.designation, y.designation));

		const frequencies = (frequenciesOf.get(`${isHeliport ? 'HELIPORT' : 'AIRPORT'}|${a.ARPT_ID}`) ?? [])
			.slice().sort((x, y) => compare(x.use, y.use) || x.mhz - y.mhz);

		airports.push({
			ident: a.ARPT_ID,
			name: a.ARPT_NAME,
			city: a.CITY,
			lat,
			lon,
			elevationFt: elevation ?? 0,
			// every tower type but NON-ATCT (and the bare TRACON) names an air traffic control tower
			towered: a.TWR_TYPE_CODE.startsWith('ATCT'),
			heliport: isHeliport,
			runways,
			frequencies,
		});
	}
	airports.sort((x, y) => compare(x.ident, y.ident));

	// Navaids
	const vors = [];
	const ndbs = [];
	for (const n of nav) {
		if (!KNOWN_NAV_TYPES.has(n.NAV_TYPE)) {
			skip(`navaid of unknown type "${n.NAV_TYPE}"`);
			continue;
		}
		const isVor = VOR_TYPES.has(n.NAV_TYPE);
		if (!isVor && !NDB_TYPES.has(n.NAV_TYPE)) continue;
		if (!n.NAV_STATUS.startsWith('OPERATIONAL')) continue;
		const lat = num(n.LAT_DECIMAL);
		const lon = num(n.LONG_DECIMAL);
		if (lat === null || lon === null) {
			skip('navaid without position');
			continue;
		}
		if (!inside(lat, lon)) continue;
		const frequency = num(n.FREQ);
		if (frequency === null) {
			skip('navaid without frequency');
			continue;
		}
		const region = regionOfArtcc(n.LOW_ALT_ARTCC_ID, n.HIGH_ALT_ARTCC_ID);
		if (isVor) {
			vors.push({
				ident: n.NAV_ID,
				name: n.NAME,
				type: n.NAV_TYPE,
				lat,
				lon,
				mhz: frequency,
				declinationEast: declinationEast(n.MAG_VARN, n.MAG_VARN_HEMIS, 'VOR'),
				region,
			});
		} else {
			ndbs.push({ident: n.NAV_ID, name: n.NAME, lat, lon, khz: frequency, region});
		}
	}
	const byIdent = (x, y) => compare(x.ident, y.ident) || compare(x.region, y.region) || x.lat - y.lat || x.lon - y.lon;
	vors.sort(byIdent);
	ndbs.sort(byIdent);

	// Fixes
	const fixes = [];
	for (const f of fix) {
		const lat = num(f.LAT_DECIMAL);
		const lon = num(f.LONG_DECIMAL);
		if (lat === null || lon === null) {
			skip('fix without position');
			continue;
		}
		if (!inside(lat, lon)) continue;
		const region = f.ICAO_REGION_CODE !== '' ? f.ICAO_REGION_CODE : regionOfArtcc(f.ARTCC_ID_LOW, f.ARTCC_ID_HIGH);
		fixes.push({ident: f.FIX_ID, lat, lon, region});
	}
	fixes.sort(byIdent);

	stats.counts = {airports: airports.length, vors: vors.length, ndbs: ndbs.length, fixes: fixes.length};
	return {
		cycle,
		source: `FAA NASR 28-day subscription (CSV), effective ${cycle}`,
		regions,
		airports,
		vors,
		ndbs,
		fixes,
	};
}

/** The text the CLI prints. */
function summary(extractedFile, result, stats) {
	const lines = [
		`Wrote ${extractedFile}`,
		`Cycle ${result.cycle}`,
		`Airports ${stats.counts.airports} (${result.airports.filter(a => a.heliport).length} heliports)`,
		`VORs ${stats.counts.vors}`,
		`NDBs ${stats.counts.ndbs}`,
		`Fixes ${stats.counts.fixes}`,
		`Regions derived from the fixes of the ARTCC: ${stats.regionsFromArtcc}`,
		`Regions set to ${FALLBACK_REGION} because the ARTCC has no fixes: ${stats.regionsDefaulted}`,
	];
	const reasons = Object.entries(stats.skipped).sort((x, y) => compare(x[0], y[0]));
	lines.push(reasons.length === 0 ? 'Nothing skipped or defaulted' : 'Skipped or defaulted:');
	for (const [reason, count] of reasons) lines.push(`  ${count} ${reason}`);
	return lines.join('\n');
}

/** The extract as written to disk. */
export const serialize = result => JSON.stringify(result, null, 2) + '\n';

function main(argv) {
	if (argv.length !== 1) {
		console.error('Usage: node generator/navdata/extract-nasr.mjs <unzipped NASR CSV folder>');
		process.exit(2);
	}
	const regions = JSON.parse(fs.readFileSync(path.join(HERE, 'regions.json'), 'utf8'));
	/** @type {Partial<ExtractStats>} */
	const stats = {};
	let result;
	try {
		result = extract(path.resolve(argv[0]), regions, stats);
	} catch (e) {
		console.error(e instanceof Error ? e.message : e);
		process.exit(1);
	}
	const file = path.join(HERE, `nasr-${result.cycle}.json`);
	fs.writeFileSync(file, serialize(result));
	console.log(summary(path.relative(process.cwd(), file), result, stats));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
