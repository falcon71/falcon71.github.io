import {defineScreen} from '../../../generator/api.ts';
import {obsAtTiton, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'NAV 3 in OBS mode before TITON, on the radial',
	show: 'left',
	boot: tut2Boot,
	steps: async u => {
		await obsAtTiton(u);
		await u.panel.selectPage('L', 'NAV 3');
	},
	fields: [
		{id: 'to', find: {area: 'L', row: 0}},
		{id: 'obs', find: {re: /OBS +\S+/, area: 'L', row: 1}},
		{id: 'tk', find: {re: /TK +\S+/, area: 'L', row: 2}},
		{id: 'fly', find: {re: /FLY.+/, area: 'L', row: 3}},
		{id: 'msa', find: {re: /MSA.+/, area: 'L', row: 4}},
		{id: 'esa', find: {re: /ESA.+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 3/, area: 'S'}},
	],
});
