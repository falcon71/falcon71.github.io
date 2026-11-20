import {defineScreen, wait} from '../../../generator/api.ts';
import {activeOnFinal, BOOT} from '../states.ts';
import {inhibitAllBut} from '../../../../vendor/kln90b/test/harness/gps.ts';

// Three satellites and the altitude input keep the position but give no RAIM; after 2 minutes without RAIM the unit
// flags its navigation in approach active mode
defineScreen(import.meta.url, {
	title: 'MSG page with PRESS GPS APR FOR NAV',
	show: 'both',
	keepMessages: true,
	boot: BOOT,
	steps: async u => {
		await activeOnFinal(u);
		inhibitAllBut(u, 3);
		await wait(130_000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: {area: 'F', row: 0}},
		{id: 'raim', find: [{area: 'F', row: 1}, {area: 'F', row: 2}]},
		{id: 'mode', find: {re: /apr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
