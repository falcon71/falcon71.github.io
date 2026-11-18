import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 without an active waypoint',
	show: 'left',
	// FPL 0 is empty and there is no direct-to
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'NAV 1');
	},
	fields: [
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'L'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'L'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'L'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'L'}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
