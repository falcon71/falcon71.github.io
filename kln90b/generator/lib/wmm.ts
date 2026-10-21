import {readFileSync} from 'node:fs';
import path from 'node:path';
import {SITE} from './paths.ts';

/**
 * The World Magnetic Model (NOAA's WMMHR2025), evaluated as in the WMM2025 technical report: geodetic to geocentric
 * spherical coordinates on WGS 84, Schmidt semi-normalized associated Legendre functions, coefficients advanced by their
 * secular variation, and the field rotated back to geodetic.
 */

/** Degree and order the screens use. The high-resolution terms add nothing visible at the precision of the unit. */
export const SCREEN_DEGREE = 12;

/** The coefficients are stored at index `n * (n + 1) / 2 + m`. */
export interface WmmModel {
	epoch: number;
	maxDegree: number;
	/** Gauss coefficients g and h at the epoch (nT). */
	g: Float64Array;
	h: Float64Array;
	/** Their secular variation (nT/yr). */
	gDot: Float64Array;
	hDot: Float64Array;
}

/** WGS 84 semi-major axis (km) and flattening. */
const WGS84_A = 6378.137;
const WGS84_F = 1 / 298.257223563;
const WGS84_E2 = WGS84_F * (2 - WGS84_F);
/** The geomagnetic reference radius (km). */
const EARTH_RADIUS = 6371.2;

const DEG = Math.PI / 180;

function index(n: number, m: number): number {
	return (n * (n + 1)) / 2 + m;
}

/** Parses the text of a `.COF` file. The model ends at the first line of 9s. */
export function loadWmm(cof: string): WmmModel {
	const lines = cof.split(/\r?\n/);
	const epoch = Number(lines[0].trim().split(/\s+/)[0]);
	if (!Number.isFinite(epoch)) {
		throw new Error(`The first line of the WMM coefficients does not start with the epoch: "${lines[0]}"`);
	}

	const rows: number[][] = [];
	let maxDegree = 0;
	for (const line of lines.slice(1)) {
		const trimmed = line.trim();
		if (trimmed === '') {
			continue;
		}
		if (trimmed.startsWith('99999')) {
			break;
		}
		const f = trimmed.split(/\s+/).map(Number);
		if (f.length < 6 || f.some(v => !Number.isFinite(v))) {
			throw new Error(`Cannot read the WMM coefficient line "${line}"`);
		}
		rows.push(f);
		maxDegree = Math.max(maxDegree, f[0]);
	}

	const size = index(maxDegree + 1, 0);
	const model: WmmModel = {
		epoch,
		maxDegree,
		g: new Float64Array(size),
		h: new Float64Array(size),
		gDot: new Float64Array(size),
		hDot: new Float64Array(size),
	};
	for (const [n, m, g, h, gDot, hDot] of rows) {
		const i = index(n, m);
		model.g[i] = g;
		model.h[i] = h;
		model.gDot[i] = gDot;
		model.hDot[i] = hDot;
	}
	return model;
}

/** The year plus the elapsed fraction of it, by milliseconds since 1 January 00:00 UTC. */
export function decimalYear(date: Date): number {
	const year = date.getUTCFullYear();
	const start = Date.UTC(year, 0, 1);
	const end = Date.UTC(year + 1, 0, 1);
	return year + (date.getTime() - start) / (end - start);
}

/**
 * Fully normalized associated Legendre functions of sin(latitude) and their derivatives with respect to the geocentric
 * latitude, converted to Schmidt semi-normalization. The forward column recursion stays stable up to degree 133.
 */
function legendre(maxDegree: number, sinLat: number, cosLat: number): {p: Float64Array; dp: Float64Array} {
	const size = index(maxDegree + 1, 0);
	// Pbar is the fully normalized function; the extra column keeps the derivative formula free of bounds checks.
	const pbar = new Float64Array(size + maxDegree + 2);
	pbar[0] = 1;
	for (let m = 0; m <= maxDegree; m++) {
		if (m > 0) {
			// Sectoral term.
			pbar[index(m, m)] = Math.sqrt(m === 1 ? 3 : (2 * m + 1) / (2 * m)) * cosLat * pbar[index(m - 1, m - 1)];
		}
		if (m < maxDegree) {
			pbar[index(m + 1, m)] = Math.sqrt(2 * m + 3) * sinLat * pbar[index(m, m)];
		}
		for (let n = m + 2; n <= maxDegree; n++) {
			const nn = n * n - m * m;
			const a = Math.sqrt((4 * n * n - 1) / nn);
			const b = Math.sqrt(((2 * n + 1) * (n + m - 1) * (n - m - 1)) / ((2 * n - 3) * nn));
			pbar[index(n, m)] = a * sinLat * pbar[index(n - 1, m)] - b * pbar[index(n - 2, m)];
		}
	}

	const p = new Float64Array(size);
	const dp = new Float64Array(size);
	for (let n = 0; n <= maxDegree; n++) {
		const toSchmidt = 1 / Math.sqrt(2 * n + 1);
		for (let m = 0; m <= n; m++) {
			const i = index(n, m);
			p[i] = pbar[i] * toSchmidt;
			// d/d(colatitude); the latitude derivative is its negative. Pbar(n, n + 1) is zero.
			let dTheta: number;
			if (m === 0) {
				dTheta = -Math.sqrt((n * (n + 1)) / 2) * pbar[index(n, 1)];
			} else {
				const lower = Math.sqrt((n + m) * (n - m + 1)) * (m === 1 ? Math.SQRT2 : 1) * pbar[index(n, m - 1)];
				const upper = m < n ? Math.sqrt((n - m) * (n + m + 1)) * pbar[index(n, m + 1)] : 0;
				dTheta = 0.5 * (lower - upper);
			}
			dp[i] = -dTheta * toSchmidt;
		}
	}
	return {p, dp};
}

/**
 * The magnetic declination in degrees, east positive.
 * @param year the decimal year; the model advances its coefficients by `year - epoch`.
 * @param heightKm height above the WGS 84 ellipsoid.
 * @param maxDegree evaluate only terms up to this degree and order.
 */
export function declination(m: WmmModel, latDeg: number, lonDeg: number, year: number, heightKm = 0, maxDegree = m.maxDegree): number {
	const degree = Math.min(maxDegree, m.maxDegree);
	const dt = year - m.epoch;

	// Geodetic to geocentric spherical coordinates.
	const lat = latDeg * DEG;
	const lon = lonDeg * DEG;
	const sinGd = Math.sin(lat);
	const cosGd = Math.cos(lat);
	const rc = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinGd * sinGd);
	const pAxis = (rc + heightKm) * cosGd;
	const zAxis = (rc * (1 - WGS84_E2) + heightKm) * sinGd;
	const r = Math.hypot(pAxis, zAxis);
	const sinLat = zAxis / r;
	const cosLat = pAxis / r;

	const {p, dp} = legendre(degree, sinLat, cosLat);

	// cos(m * lon) and sin(m * lon) by angle addition.
	const cosM = new Float64Array(degree + 1);
	const sinM = new Float64Array(degree + 1);
	cosM[0] = 1;
	sinM[0] = 0;
	const cosL = Math.cos(lon);
	const sinL = Math.sin(lon);
	for (let k = 1; k <= degree; k++) {
		cosM[k] = cosM[k - 1] * cosL - sinM[k - 1] * sinL;
		sinM[k] = sinM[k - 1] * cosL + cosM[k - 1] * sinL;
	}

	// The field in geocentric components: north, east and down.
	let x = 0;
	let y = 0;
	let z = 0;
	let radial = EARTH_RADIUS / r;
	for (let n = 1; n <= degree; n++) {
		radial *= EARTH_RADIUS / r; // (a / r)^(n + 2)
		let sumX = 0;
		let sumY = 0;
		let sumZ = 0;
		for (let k = 0; k <= n; k++) {
			const i = index(n, k);
			const g = m.g[i] + dt * m.gDot[i];
			const h = m.h[i] + dt * m.hDot[i];
			const gc = g * cosM[k] + h * sinM[k];
			sumX -= gc * dp[i];
			sumY += k * (g * sinM[k] - h * cosM[k]) * p[i];
			sumZ -= (n + 1) * gc * p[i];
		}
		x += radial * sumX;
		y += radial * sumY;
		z += radial * sumZ;
	}
	y /= cosLat;

	// Rotate back to the geodetic frame. Only north and east matter for the declination.
	const delta = Math.asin(sinLat) - lat;
	const xGd = x * Math.cos(delta) - z * Math.sin(delta);
	return Math.atan2(y, xGd) / DEG;
}

let screenModelCache: WmmModel | undefined;

/** The model of `generator/wmm/WMMHR.COF`, read once. */
export function screenModel(): WmmModel {
	screenModelCache ??= loadWmm(readFileSync(path.join(SITE, 'generator', 'wmm', 'WMMHR.COF'), 'utf8'));
	return screenModelCache;
}
