import {defineScreen, place} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';

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
		{id: 'ident', find: {re: /KSE/, area: 'R', row: 0}},
		{id: 'char', find: {re: /(?<=KSE)A/, area: 'R', row: 0}},
		// The name of the airport takes two rows and is free
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		// Latitude and longitude
		{id: 'pos', find: positionRows('R')},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
