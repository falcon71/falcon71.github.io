import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'STA 2 page, with a position',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'STA 2');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'epe', find: {re: /\S+NM/, area: 'L', row: 2}},
		{id: 'page', find: {re: /STA 2/, area: 'S'}},
	],
});
