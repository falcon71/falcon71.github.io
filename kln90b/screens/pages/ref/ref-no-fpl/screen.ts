import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The REF page without an FPL page on the left side',
	show: 'right',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.selectPage('L', 'NAV 1');
		await u.panel.selectPage('R', 'REF');
	},
	fields: [
		{id: 'text', find: [{re: /DISPLAY/, area: 'R'}, {re: /DESIRED/, area: 'R'}, {re: /FPL ON/, area: 'R'}, {re: /LEFT PAGE/, area: 'R'}]},
		{id: 'page', find: {re: /REF/, area: 'S'}},
	],
});
