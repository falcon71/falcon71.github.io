import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 5 page without altitude alerting',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 5');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'off', find: {area: 'L', row: 2}},
		{id: 'disabled', find: [{area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /SET 5/, area: 'S'}},
	],
});
