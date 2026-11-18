import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'NAV 3 page without an active waypoint',
	show: 'left',
	// FPL 0 is empty and there is no direct-to
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'NAV 3');
	},
	fields: [
		{id: 'dtk', find: {re: /DTK +\S+/, area: 'L', row: 1}},
		{id: 'tk', find: {re: /TK +\S+/, area: 'L', row: 2}},
		{id: 'fly', find: {re: /FLY.+/, area: 'L', row: 3}},
		{id: 'msa', find: {re: /MSA.+/, area: 'L', row: 4}},
		{id: 'esa', find: {re: /ESA.+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 3/, area: 'S'}},
	],
});
