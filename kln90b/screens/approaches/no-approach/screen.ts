import {defineScreen, wait} from '../../../generator/api.ts';
import {BOOT, flyStart} from '../states.ts';

// FPL 0 from KSEA to KOLM without an approach; the GPS APR switch pressed
defineScreen(import.meta.url, {
	title: 'NO APPROACH in the status line',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyStart(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'NAV 1');
		await u.panel.press('KLN90B_ApprArm_Push');
		await wait(200);
	},
	fields: [
		{id: 'lpage', find: {re: /FPL 0/, area: 'S'}},
		{id: 'message', find: {re: /NO APPROACH/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
