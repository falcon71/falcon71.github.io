import path from 'node:path';
import {fileURLToPath} from 'node:url';

/** Absolute path of `kln90b/` (the Astro site package). */
export const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
/** Absolute path of the kln90b submodule. */
export const VENDOR = path.resolve(SITE, '..', 'vendor', 'kln90b');
/** Absolute path of the generated screens and their descriptions. */
export const SCREENS = path.join(SITE, 'screens');

/** A screen id: folder names of lowercase letters, digits and hyphens, joined by `/`. */
const SCREEN_ID = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;

/** Whether `id` is a valid screen id, every folder of its path of lowercase letters, digits and hyphens. */
export const isScreenId = (id: string): boolean => SCREEN_ID.test(id);

/**
 * The id of the screen in `dir`: its path below `root` with `/`, packages included (`pages/apt/apt-1-ksea`). A folder
 * outside `root` is named by its basename.
 */
export function screenId(dir: string, root: string = SCREENS): string {
	const rel = path.relative(root, dir);
	if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) return path.basename(dir);
	return rel.split(path.sep).join('/');
}
