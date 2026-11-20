import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'CTR 1 without an FPL page on the left side',
	show: 'right',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.selectPage('L', 'NAV 1');
		await u.panel.selectPage('R', 'CTR 1');
	},
	fields: [
		{id: 'text', find: [{re: /DISPLAY/, area: 'R'}, {re: /DESIRED/, area: 'R'}, {re: /FPL ON/, area: 'R'}, {re: /LEFT PAGE/, area: 'R'}]},
		{id: 'page', find: {re: /CTR 1/, area: 'S'}},
	],
});
