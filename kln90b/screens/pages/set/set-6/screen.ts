import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 6 page with turn anticipation enabled',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 6');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'value', find: {area: 'L', row: 3}},
		{id: 'page', find: {re: /SET 6/, area: 'S'}},
	],
});
