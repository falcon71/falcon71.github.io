import path from 'node:path';
import {fileURLToPath} from 'node:url';

/** Absolute path of `kln90b/` (the Astro site package). */
export const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
/** Absolute path of the kln90b submodule. */
export const VENDOR = path.resolve(SITE, '..', 'vendor', 'kln90b');
/** Absolute path of the generated screens and their descriptions. */
export const SCREENS = path.join(SITE, 'screens');
