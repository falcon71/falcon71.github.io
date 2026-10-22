import {describe, expect, it} from 'vitest';
// @ts-ignore: plain ES module without declarations
import {manifestText, parseManifest, planScreensRun} from '../screensManifest.mjs';

const PINNED = 'd9370b0143af6463cadf0b52076e1e76f7310fbe';
const OLD = '3d371f34a68144c80f8e7035490d8f0391b0eb45';
const SCREENS = ['--project', 'screens'];

describe('manifest file', () => {
	it('is a comment line and the commit', () => {
		const lines = manifestText(PINNED).split('\n');
		expect(lines).toHaveLength(3);
		expect(lines[0]).toMatch(/^# .*npm run screens/);
		expect(lines.slice(1)).toEqual([PINNED, '']);
	});

	it('round-trips', () => expect(parseManifest(manifestText(OLD))).toBe(OLD));
	it('reads the commit of a file with CRLF line ends', () => expect(parseManifest(`# note\r\n${OLD}\r\n`)).toBe(OLD));
	it('has no commit when the file is missing, empty or not a commit', () => {
		expect(parseManifest(null)).toBeNull();
		expect(parseManifest('')).toBeNull();
		expect(parseManifest('# only a comment\n')).toBeNull();
		expect(parseManifest(`# note\n${OLD.slice(1)}\n`)).toBeNull();
		expect(parseManifest(`# note\n${OLD}\nmore\n`)).toBeNull();
	});
});

describe('planScreensRun', () => {
	it('lets the unit and capture projects run, whatever the manifest says', () => {
		const args = ['--project', 'unit', '--project', 'capture'];
		expect(planScreensRun(args, null, PINNED)).toEqual({problem: null, writeManifest: false});
		expect(planScreensRun([...args, 'generator/test/fixtures'], OLD, PINNED)).toEqual({problem: null, writeManifest: false});
	});

	it('writes the manifest after a run of all screens, whatever it said before', () => {
		for (const recorded of [null, OLD, PINNED]) {
			expect(planScreensRun(SCREENS, recorded, PINNED)).toEqual({problem: null, writeManifest: true});
		}
	});

	it('lets a filtered run proceed when the manifest is the pinned commit, and does not write it', () => {
		expect(planScreensRun([...SCREENS, 'screens/nav-1'], PINNED, PINNED)).toEqual({problem: null, writeManifest: false});
	});

	it('refuses a filtered run when the manifest is missing, naming the pin and saying to run all screens', () => {
		const {problem, writeManifest} = planScreensRun([...SCREENS, 'screens/nav-1'], null, PINNED);
		expect(writeManifest).toBe(false);
		expect(problem).toContain(PINNED);
		expect(problem).toContain('npm run screens');
		expect(problem).toContain('without filters');
	});

	it('refuses a filtered run when the manifest differs, naming both commits', () => {
		const {problem, writeManifest} = planScreensRun([...SCREENS, 'screens/nav-1'], OLD, PINNED);
		expect(writeManifest).toBe(false);
		expect(problem).toContain(OLD);
		expect(problem).toContain(PINNED);
		expect(problem).toContain('without filters');
	});

	it('takes every argument beyond --project screens for a filter, a test name pattern as well', () => {
		for (const extra of [['-t', 'nav'], ['screens/nav-1'], ['--reporter', 'verbose']]) {
			expect(planScreensRun([...SCREENS, ...extra], OLD, PINNED).problem, extra.join(' ')).toContain('without filters');
		}
	});

	it('finds the screens project wherever --project is', () => {
		expect(planScreensRun(['screens/nav-1', '--project', 'screens'], OLD, PINNED).problem).toContain('without filters');
		expect(planScreensRun(['--project', 'unit', '--project', 'screens'], OLD, PINNED).writeManifest).toBe(true);
	});
});
