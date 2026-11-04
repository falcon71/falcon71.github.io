import {defineScreen, place, pointFrom} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'APT 1 page while a user airport is entered',
	show: 'both',
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'HOME');
		await u.panel.cursorTo('R', 'USER POS?');
		await u.panel.ent();
		// The cursor is on the latitude; the first click of the knob starts the entry
		await u.panel.inner('R', 1);
		await u.panel.outer('R', 1);
		await u.panel.type('R', '472000');
		await u.panel.ent();
	},
	fields: [
		{id: 'present', find: {re: /PRESENT POS/, area: 'L', row: 0}},
		{id: 'vor', find: {re: /\S+ +\d+°fr/, area: 'L', row: 2}},
		{id: 'vor-distance', find: {re: /[\d.]+nm/, area: 'L', row: 3}},
		{id: 'present-pos', find: [{re: /[NS] *\d+°[\d.]+'/, area: 'L'}, {re: /[EW] *\d+°[\d.]+'/, area: 'L'}]},
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /_+°__\.__'/, area: 'R'}},
		{id: 'left-page', find: {re: /NAV 2/, area: 'S'}},
		{id: 'message', find: {re: /ENT LAT\/LON/, area: 'S'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
