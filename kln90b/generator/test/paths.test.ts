import os from 'node:os';
import path from 'node:path';
import {describe, expect, it} from 'vitest';
import {SCREENS, screenId} from '../lib/paths.ts';

describe('screenId', () => {
	it('is the folder name of a screen directly in screens/', () => {
		expect(screenId(path.join(SCREENS, 'nav-1'))).toBe('nav-1');
	});

	it('is the path below screens/ with slashes for a screen in a package', () => {
		expect(screenId(path.join(SCREENS, 'pages', 'apt', 'apt-1-ksea'))).toBe('pages/apt/apt-1-ksea');
	});

	it('is the folder name of a screen outside screens/', () => {
		expect(screenId(path.join(os.tmpdir(), 'kln-screen-x', 'nav-1-smoke'))).toBe('nav-1-smoke');
	});

	it('is the path below a given root', () => {
		const root = path.join(os.tmpdir(), 'kln-root');
		expect(screenId(path.join(root, 'a', 'b'), root)).toBe('a/b');
	});
});
