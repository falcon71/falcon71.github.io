import path from 'node:path';
import type {ViteUserConfig} from 'vitest/config';
import {SITE, VENDOR} from './lib/paths.ts';

const IGNORED_SCSS = '\0kln90b-ignored-scss';

/**
 * KLN90B.tsx imports KLN90B.scss for rollup. The generator needs no styles, so every .scss import resolves to an empty
 * module (same stub as the kln90b vitest.config.mts).
 */
const ignoreScss = {
	name: 'kln90b-ignore-scss',
	enforce: 'pre' as const,
	resolveId: (id: string) => id.endsWith('.scss') ? IGNORED_SCSS : null,
	load: (id: string) => id === IGNORED_SCSS ? 'export default "";' : null,
};

// Bare imports from files outside the submodule resolve as if imported from inside it, so that the screens, the
// generator and the harness share one copy of vitest, the SDK and happy-dom.
const resolveFromVendor = {
	name: 'resolve-from-vendor', enforce: 'pre' as const,
	async resolveId(this: any, source: string, importer?: string) {
		if (!importer || source.startsWith('.') || source.startsWith('\0') || path.isAbsolute(source)) return null;
		if (path.resolve(importer).startsWith(VENDOR)) return null;
		return this.resolve(source, path.join(VENDOR, 'package.json'), {skipSelf: true});
	},
};

const setupFiles = [path.join(VENDOR, 'test', 'harness', 'setup', 'dom.ts')];

// A plain object instead of defineConfig(): Vitest bundles this file into a temp file under kln90b/node_modules, where a
// runtime import of vitest/config does not resolve. The type import above is erased.
const config: ViteUserConfig = {
	root: SITE,
	// The harness and the SDK live in the submodule, outside the site root
	server: {fs: {allow: [VENDOR, SITE]}},
	plugins: [ignoreScss, resolveFromVendor],
	// Same JSX factory as the kln90b tsconfig.json: FSComponent, not React
	oxc: {jsx: {runtime: 'classic', pragma: 'FSComponent.buildComponent', pragmaFrag: 'FSComponent.Fragment'}},
	test: {
		// The instrument logs a lot. Set KLN_TEST_LOG=1 to see console.log/info output; stderr is always shown.
		onConsoleLog: (_log, type) => process.env.KLN_TEST_LOG === '1' || type === 'stderr' ? undefined : false,
		projects: [
			{
				extends: true,
				test: {
					name: 'unit', environment: 'node',
					include: ['generator/test/**/*.test.ts', 'src/lib/**/*.test.ts'],
					exclude: ['generator/test/**/*.capture.test.ts'],
				},
			},
			{
				extends: true,
				test: {
					name: 'capture', environment: 'happy-dom', include: ['generator/test/**/*.capture.test.ts'],
					setupFiles, testTimeout: 120_000,
				},
			},
			{
				extends: true,
				test: {
					name: 'screens', environment: 'happy-dom', include: ['screens/*/screen.ts'],
					setupFiles, testTimeout: 120_000,
				},
			},
		],
	},
};

export default config;
