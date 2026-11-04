import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The offer to create a waypoint',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'HOME');
		// The cursor stays on, on the last character entered
	},
	fields: [
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'offer', find: [{re: /CREATE NEW/, area: 'R'}, {re: /WPT AT:/, area: 'R'}]},
		{id: 'user', find: {re: /USER POS\?/, area: 'R'}},
		{id: 'pres', find: {re: /PRES POS\?/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
