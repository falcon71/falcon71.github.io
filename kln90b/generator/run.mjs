// Runs the generator's Vitest projects with the Vitest of the kln90b submodule, from the submodule's working directory
// (the harness resolves resources/ from process.cwd()).
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {manifestText, parseManifest, planScreensRun} from './screensManifest.mjs';
import {checkVendor, gatherVendorState, vendorCommit} from './vendorCheck.mjs';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VENDOR = path.resolve(SITE, '..', 'vendor', 'kln90b');
const MANIFEST = path.join(SITE, 'screens', 'kln90b-commit.txt');

const problem = checkVendor(gatherVendorState());
if (problem !== null) {
	console.error(problem);
	process.exit(1);
}

const args = process.argv.slice(2);
const pinned = vendorCommit();
const plan = planScreensRun(args, parseManifest(fs.existsSync(MANIFEST) ? fs.readFileSync(MANIFEST, 'utf8') : null), pinned);
if (plan.problem !== null) {
	console.error(plan.problem);
	process.exit(1);
}

const child = spawnSync(process.execPath, [
	path.join(VENDOR, 'node_modules', 'vitest', 'vitest.mjs'),
	'run',
	'--config', path.join(SITE, 'generator', 'vitest.config.mts'),
	...args,
], {cwd: VENDOR, stdio: 'inherit'});

// All screens were generated from the pinned commit, and only a run that succeeded says so
if (plan.writeManifest && child.status === 0) fs.writeFileSync(MANIFEST, manifestText(pinned));

process.exit(child.status ?? 1);
