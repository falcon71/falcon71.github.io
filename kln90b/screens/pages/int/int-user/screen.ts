import {defineScreen, place, pointFrom, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The INT page of a user-defined intersection',
	show: 'right',
	// 8 NM southwest of KSEA
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: async u => {
		await u.panel.selectPage('R', 'INT  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'HOME');
		await u.panel.cursorTo('R', 'PRES POS?');
		await u.panel.ent();
		// The unit looks for the reference VOR for about 8 seconds
		await wait(9000);
	},
	fields: [
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'ref', find: {area: 'R', row: 1}},
		{id: 'rad', find: {area: 'R', row: 2}},
		{id: 'dis', find: {area: 'R', row: 3}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'page', find: {re: /INT/, area: 'S'}},
	],
});
