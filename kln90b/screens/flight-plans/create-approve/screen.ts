import {defineScreen, place} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'An airport waiting for approval on an FPL page',
	show: 'both',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.cursor('L');
		await u.panel.enterIdent('L', 'KPDX');
		await u.panel.ent();
	},
	fields: [
		{id: 'load', find: {re: /LOAD FPL 0\?/, area: 'L'}},
		{id: 'entry', find: {re: /1:KPDX/, area: 'L'}},
		{id: 'ident', find: {re: /KPDX/, area: 'R', row: 0}},
		// The name of the airport takes two rows and is free
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'class', find: {re: /CL C/, area: 'R'}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
