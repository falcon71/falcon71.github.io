// The kln90b commit the generated screens come from is recorded once, in screens/kln90b-commit.txt, instead of in every
// screen file, so that a pin move changes in git only the screens that really changed.

const COMMIT = /^[0-9a-f]{40}$/;
const COMMENT = '# Written by "npm run screens": the kln90b commit all screens in this folder were generated from.';

/** The content of `screens/kln90b-commit.txt`. */
export function manifestText(commit) {
	return `${COMMENT}\n${commit}\n`;
}

/**
 * The commit the manifest records.
 * @param {string | null} text the content of the file, null when it does not exist
 * @returns {string | null} null when there is no file or it holds no single commit
 */
export function parseManifest(text) {
	if (text === null) return null;
	const lines = text.split(/\r?\n/).filter(line => line.trim() !== '' && !line.startsWith('#'));
	return lines.length === 1 && COMMIT.test(lines[0].trim()) ? lines[0].trim() : null;
}

/**
 * What a run of the generator's Vitest has to do about the manifest, from the arguments `run.mjs` passes on. Only a run
 * of the `screens` project is concerned. With anything beyond `--project screens` (a file filter, a test name pattern, any
 * option) it generates only some screens, so the manifest must already name the pinned commit, or the screens that are
 * not generated would stay at an older one unnoticed. Without, it regenerates every screen and records the commit.
 * @param {string[]} args the arguments after `run.mjs`
 * @param {string | null} recorded the commit of the manifest, null when missing
 * @param {string} pinned the commit of the submodule
 * @returns {{problem: string | null, writeManifest: boolean}} `writeManifest`: write it once Vitest exits 0
 */
export function planScreensRun(args, recorded, pinned) {
	const projects = [];
	const rest = [];
	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--project' && i + 1 < args.length) projects.push(args[++i]);
		else rest.push(args[i]);
	}
	if (!projects.includes('screens')) return {problem: null, writeManifest: false};
	if (rest.length === 0) return {problem: null, writeManifest: true};
	if (recorded === pinned) return {problem: null, writeManifest: false};
	return {
		problem: `The screens were generated from kln90b ${recorded ?? '(no commit recorded in screens/kln90b-commit.txt)'}, `
			+ `but the submodule is at ${pinned}. A run with filters would leave the other screens at the old commit. `
			+ 'Run `npm run screens` without filters first.',
		writeManifest: false,
	};
}
