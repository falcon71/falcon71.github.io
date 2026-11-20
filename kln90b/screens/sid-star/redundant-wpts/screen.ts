import {defineScreen, wait} from '../../../generator/api.ts';
import {CHINS_BOOT, loadChins5OverRoute} from '../states.ts';

// FPL 0 holds YKM and CHINS as en route waypoints, and the transition YKM of CHINS5 repeats both
defineScreen(import.meta.url, {
	title: 'MSG page with REDUNDANT WPTS IN FPL',
	show: 'both',
	keepMessages: true,
	boot: CHINS_BOOT,
	steps: async u => {
		await loadChins5OverRoute(u);
		await u.panel.msg();
		await wait(1000);
	},
	fields: [
		{id: 'message', find: [{re: /REDUNDANT WPTS IN FPL/, area: 'F'}, {re: /EDIT ENROUTE WPTS/, area: 'F'}, {re: /AS NECESSARY/, area: 'F'}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
