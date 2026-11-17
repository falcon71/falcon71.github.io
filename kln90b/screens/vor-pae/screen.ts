import {defineScreen, place} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'The VOR page of a VOR of the database',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'VOR  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'PAE');
		await u.panel.cursor('R');
	},
	fields: [
		{id: 'ident', find: {re: /PAE/, area: 'R', row: 0}},
		{id: 'dme', find: {re: /D/, area: 'R', row: 0}},
		{id: 'name', find: {area: 'R', row: 1}},
		{id: 'class', find: {re: /[A-Z]/, area: 'R', row: 2}},
		{id: 'freq', find: {re: /\d+\.\d\d/, area: 'R', row: 3}},
		{id: 'magvar', find: {re: /\d+°[EW]/, area: 'R', row: 3}},
		{id: 'pos', find: positionRows('R')},
		{id: 'page', find: {re: /VOR/, area: 'S'}},
	],
});
