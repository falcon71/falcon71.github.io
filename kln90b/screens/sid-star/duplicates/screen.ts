import {defineScreen} from '../../../generator/api.ts';
import {CHINS_BOOT, loadChins5OverRoute} from '../states.ts';

// The transition YKM of CHINS5 repeats YKM and CHINS, which FPL 0 holds as en route waypoints
defineScreen(import.meta.url, {
	title: 'FPL 0 with waypoints twice after a STAR',
	show: 'left',
	boot: CHINS_BOOT,
	steps: async u => {
		await loadChins5OverRoute(u);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'from', find: {re: /Á 2:YKM/, area: 'L'}},
		{id: 'to', find: {re: /À 3:CHINS/, area: 'L'}},
		{id: 'header', find: {re: /CHINS5-Æ/, area: 'L'}},
		{id: 'copies', find: [{re: /4\.YKM/, area: 'L'}, {re: /5\.CHINS/, area: 'L'}]},
		{id: 'last', find: {re: /9:KBFI/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
