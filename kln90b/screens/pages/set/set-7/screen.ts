import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 7 page with the baro setting in inches',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 7');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'unit', find: [{area: 'L', row: 3}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /SET 7/, area: 'S'}},
	],
});
