import {defineScreen, place} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'APT 1 page with the cursor on the identifier',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'KSEA');
	},
	fields: [
		// The cursor stands on the last character of the identifier
		{id: 'ident', find: {re: /KSE/, area: 'R', row: 0}},
		{id: 'char', find: {re: /(?<=KSE)A/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'pos', find: positionRows('R')},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
