import {defineScreen, place} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'A new flight plan with three waypoints',
	show: 'left',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.cursor('L');
		for (const ident of ['KPDX', 'KOLM', 'KSEA']) {
			await u.panel.enterIdent('L', ident);
			await u.panel.ent();
			await u.panel.ent();
		}
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'wpts', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'blank', find: {re: /4: +/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
