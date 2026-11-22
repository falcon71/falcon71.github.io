import {defineScreen} from '../../../generator/api.ts';
import {directToKtiw, flyAlong, tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'NAV 3 en route, 40 NM from Friday Harbor',
	show: 'left',
	boot: tut1Boot,
	steps: async u => {
		await directToKtiw(u);
		await flyAlong(u, 40);
		await u.panel.selectPage('L', 'NAV 3');
	},
	fields: [
		{id: 'from', find: {re: /d›/, area: 'L', row: 0}},
		{id: 'to', find: {re: /KTIW/, area: 'L', row: 0}},
		{id: 'dtk', find: {re: /DTK +\S+/, area: 'L', row: 1}},
		{id: 'tk', find: {re: /TK +\S+/, area: 'L', row: 2}},
		{id: 'fly', find: {re: /FLY.+/, area: 'L', row: 3}},
		{id: 'msa', find: {re: /MSA.+/, area: 'L', row: 4}},
		{id: 'esa', find: {re: /ESA.+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 3/, area: 'S'}},
	],
});
