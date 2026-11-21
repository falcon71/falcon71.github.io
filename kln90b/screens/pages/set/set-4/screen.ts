import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 4 page',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 4');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}, {area: 'L', row: 2}]},
		{id: 'run', find: [{re: /RUN WHEN/, area: 'L'}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /SET 4/, area: 'S'}},
	],
});
