import {readFileSync} from 'node:fs';
import path from 'node:path';
import {describe, expect, it} from 'vitest';
import {SITE} from '../lib/paths.ts';
import {declination, decimalYear, loadWmm, screenModel, SCREEN_DEGREE} from '../lib/wmm.ts';

const WMM_DIR = path.join(SITE, 'generator', 'wmm');
const cof = readFileSync(path.join(WMM_DIR, 'WMMHR.COF'), 'utf8');
const full = loadWmm(cof);

/** The data lines of NOAA's test values: year, height (km), latitude, longitude and declination (field 11). */
const testPoints = readFileSync(path.join(WMM_DIR, 'WMMHR2025_TEST_VALUES.txt'), 'utf8')
	.split(/\r?\n/)
	.filter(line => line.trim() !== '' && !line.startsWith('#'))
	.map(line => {
		const f = line.trim().split(/\s+/).map(Number);
		return {year: f[0], height: f[1], lat: f[2], lon: f[3], declination: f[10]};
	});

describe('World Magnetic Model', () => {
	it('reads the whole model', () => {
		expect(full.epoch).toBe(2025);
		expect(full.maxDegree).toBe(133);
	});

	it('has test points to check against', () => {
		expect(testPoints.length).toBeGreaterThan(0);
	});

	for (const p of testPoints) {
		it(`matches NOAA's test values at ${p.year} ${p.height} km ${p.lat} ${p.lon}`, () => {
			expect(Math.abs(declination(full, p.lat, p.lon, p.year, p.height) - p.declination)).toBeLessThanOrEqual(0.006);
		});
	}

	it('truncates to a degree', () => {
		const low = cof.split(/\r?\n/).filter(line => {
			const n = Number(line.trim().split(/\s+/)[0]);
			return !(n > 12 && n < 999);
		}).join('\n');
		const truncated = loadWmm(low);
		expect(truncated.maxDegree).toBe(12);
		const a = declination(truncated, 47.45, -122.31, 2026.5);
		const b = declination(full, 47.45, -122.31, 2026.5, 0, 12);
		expect(Math.abs(a - b)).toBeLessThan(1e-9);
		// Degree 12 leaves out the high degrees, so it is not the full result.
		expect(Math.abs(b - declination(full, 47.45, -122.31, 2026.5))).toBeGreaterThan(1e-6);
	});

	it('reads CRLF text like LF text', () => {
		const crlf = loadWmm(cof.replace(/\r?\n/g, '\r\n'));
		expect(declination(crlf, 47.45, -122.31, 2026.5)).toBe(declination(full, 47.45, -122.31, 2026.5));
	});

	it('computes the decimal year', () => {
		expect(decimalYear(new Date('2026-01-01T00:00:00Z'))).toBe(2026);
		expect(decimalYear(new Date('2025-07-02T12:00:00Z'))).toBe(2025.5);
	});

	it('loads the screen model once, from the site', () => {
		expect(screenModel()).toBe(screenModel());
		expect(screenModel().maxDegree).toBe(133);
		expect(SCREEN_DEGREE).toBe(12);
	});
});
