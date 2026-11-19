import {defineScreen, place} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'An empty flight plan with an identifier entered',
	show: 'left',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.cursor('L');
		await u.panel.enterIdent('L', 'KPDX');
	},
	fields: [
		{id: 'load', find: {re: /LOAD FPL 0\?/, area: 'L'}},
		{id: 'entry', find: {re: /1:KPDX/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
