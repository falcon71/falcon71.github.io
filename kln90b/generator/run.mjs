// Runs the generator's Vitest projects with the Vitest of the kln90b submodule, from the submodule's working directory
// (the harness resolves resources/ from process.cwd()).
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkVendor, gatherVendorState} from './vendorCheck.mjs';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VENDOR = path.resolve(SITE, '..', 'vendor', 'kln90b');

const problem = checkVendor(gatherVendorState());
if (problem !== null) {
	console.error(problem);
	process.exit(1);
}

const child = spawnSync(process.execPath, [
	path.join(VENDOR, 'node_modules', 'vitest', 'vitest.mjs'),
	'run',
	'--config', path.join(SITE, 'generator', 'vitest.config.mts'),
	...process.argv.slice(2),
], {cwd: VENDOR, stdio: 'inherit'});

process.exit(child.status ?? 1);
