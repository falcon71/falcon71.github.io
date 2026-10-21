import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'Cursor on the right page',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'KSEA');
	},
	fields: [
		// The cursor stands on the last character of the ident
		{id: 'ident', find: {area: 'R', row: 0, from: 1, to: 4}},
		{id: 'char', find: {area: 'R', row: 0, from: 4, to: 5}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		// Latitude and longitude
		{id: 'pos', find: [{area: 'R', row: 4}, {area: 'R', row: 5}]},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
