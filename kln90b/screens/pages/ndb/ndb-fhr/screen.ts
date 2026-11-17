import {defineScreen, place} from '../../../../generator/api.ts';
import {positionRows} from '../../../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'The NDB page of an NDB of the database',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'NDB  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'FHR');
		await u.panel.cursor('R');
	},
	fields: [
		{id: 'ident', find: {re: /FHR/, area: 'R', row: 0}},
		{id: 'name', find: {area: 'R', row: 1}},
		{id: 'freq', find: {re: /FREQ +[\d.]+/, area: 'R', row: 3}},
		{id: 'pos', find: positionRows('R')},
		{id: 'page', find: {re: /NDB/, area: 'S'}},
	],
});
