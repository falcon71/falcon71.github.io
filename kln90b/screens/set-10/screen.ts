import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 10 page',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 10');
	},
	fields: [
		{id: 'gps', find: {area: 'L', row: 0}},
		{id: 'page', find: {re: /SET10/, area: 'S'}},
	],
});
