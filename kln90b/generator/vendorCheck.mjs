import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(SITE, '..');
const VENDOR = path.join(REPO, 'vendor', 'kln90b');

/**
 * @typedef {object} VendorState
 * @property {boolean} exists vendor/kln90b/package.json exists
 * @property {boolean} nodeModules vendor/kln90b/node_modules/vitest exists
 * @property {string} statusLine output of `git submodule status vendor/kln90b`
 * @property {string} porcelain output of `git -C vendor/kln90b status --porcelain`
 */

/**
 * Judges whether the submodule can run the generator.
 * @param {VendorState} state
 * @returns {string | null} null when everything is fine, otherwise what the user has to do
 */
export function checkVendor(state) {
	if (!state.exists) {
		return 'The kln90b submodule is not checked out. Run: git submodule update --init';
	}
	if (!state.nodeModules) {
		return 'The submodule has no dependencies installed. Run: npm ci --prefix vendor/kln90b';
	}
	// git submodule status prefixes the line with "+" when the checkout differs from the recorded pin, "-" when it is
	// not initialized and "U" on a merge conflict
	if (/^[+\-U]/.test(state.statusLine)) {
		return 'The submodule is not at the commit this repository pins. Run: git submodule update';
	}
	if (state.porcelain.trim() !== '') {
		return 'The submodule has local changes, which would make the screens depend on them. Discard them in vendor/kln90b.';
	}
	return null;
}

/** Gathers the state of the submodule from the file system and git. */
export function gatherVendorState() {
	const git = (...args) => execFileSync('git', args, {cwd: REPO, encoding: 'utf8'});
	const exists = fs.existsSync(path.join(VENDOR, 'package.json'));
	return {
		exists,
		nodeModules: fs.existsSync(path.join(VENDOR, 'node_modules', 'vitest')),
		statusLine: exists ? git('submodule', 'status', 'vendor/kln90b') : '',
		porcelain: exists ? git('-C', 'vendor/kln90b', 'status', '--porcelain') : '',
	};
}

/** The 40-character commit the submodule is checked out at. */
export function vendorCommit() {
	return execFileSync('git', ['-C', VENDOR, 'rev-parse', 'HEAD'], {cwd: REPO, encoding: 'utf8'}).trim();
}
