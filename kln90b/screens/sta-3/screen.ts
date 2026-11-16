import {vi} from 'vitest';
import {defineScreen, place} from '../../generator/api.ts';

// The source tree holds a template where the build inserts the version of package.json (rollup.config.mjs of the
// submodule), and the unit would show the template. This does what the build does. The working directory of a run is
// the submodule (generator/README.md).
vi.mock('../../../vendor/kln90b/kln90b/Version', async () => {
	const fs = await import('node:fs');
	return {VERSION: JSON.parse(fs.readFileSync('package.json', 'utf8')).version};
});

defineScreen(import.meta.url, {
	title: 'STA 3 page',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'STA 3');
	},
	fields: [
		{id: 'host', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'rcvr', find: [{area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'obs', find: {re: /OBS CAL +\S+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /STA 3/, area: 'S'}},
	],
});
