import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The INT page of an intersection of the database',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'INT  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'LOFAL');
		await u.panel.cursor('R');
		// The unit looks for the reference VOR for about 8 seconds
		await wait(9000);
	},
	fields: [
		{id: 'ident', find: {re: /LOFAL/, area: 'R', row: 0}},
		{id: 'ref', find: {area: 'R', row: 1}},
		{id: 'rad', find: {area: 'R', row: 2}},
		{id: 'dis', find: {area: 'R', row: 3}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'page', find: {re: /INT/, area: 'S'}},
	],
});
