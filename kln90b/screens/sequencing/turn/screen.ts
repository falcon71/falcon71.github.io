import {defineScreen} from '../../../generator/api.ts';
import {BOOT, inTurn} from '../olm-turn.ts';

defineScreen(import.meta.url, {
	title: 'NAV 3 in the transition at KOLM, before the unit sequences to KSEA',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await inTurn(u);
		await u.panel.selectPage('L', 'NAV 3');
	},
	fields: [
		{id: 'leg', find: {area: 'L', row: 0}},
		{id: 'dtk', find: {re: /DTK +\S+/, area: 'L'}},
		{id: 'tk', find: {re: /TK +\S+/, area: 'L', row: 2}},
		{id: 'fly', find: {re: /FLY.*/, area: 'L'}},
		{id: 'msa', find: {re: /MSA.*/, area: 'L'}},
		{id: 'esa', find: {re: /ESA.*/, area: 'L'}},
		{id: 'page', find: {re: /NAV 3/, area: 'S'}},
	],
});
