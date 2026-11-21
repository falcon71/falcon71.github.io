import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 9 page without altitude alerting',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 9');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}, {area: 'L', row: 2}]},
		{id: 'off', find: {area: 'L', row: 3}},
		{id: 'disabled', find: [{area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /SET 9/, area: 'S'}},
	],
});
