import {defineScreen, place} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'APT 1 page',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'KSEA');
		// Back to the plain page: with the cursor on, the status line would show CRSR
		await u.panel.cursor('R');
	},
	fields: [
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		// The name of the airport takes two rows and is free
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		// Latitude and longitude
		{id: 'pos', find: positionRows('R')},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
