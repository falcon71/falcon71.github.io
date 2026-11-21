import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'OTH 1 page',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'OTH 1');
	},
	fields: [
		{id: 'none', find: {re: /NO NEAREST/, area: 'L', row: 0}},
		{id: 'fss', find: {re: /FSS/, area: 'L', row: 1}},
		{id: 'page', find: {re: /OTH 1/, area: 'S'}},
	],
});
