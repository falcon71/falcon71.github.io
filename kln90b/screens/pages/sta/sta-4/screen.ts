import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'STA 4 page',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'STA 4');
	},
	fields: [
		{id: 'time', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'cycles', find: [{area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'page', find: {re: /STA 4/, area: 'S'}},
	],
});
