import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'STA 1 page, navigating',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'STA 1');
	},
	fields: [
		{id: 'state', find: {re: /STATE +\S+( \S)?/, area: 'L', row: 0}},
		// The column headings and the rows of the satellites, in three columns
		{id: 'sv', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row, from: 0, to: 4}))},
		{id: 'snr', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row, from: 4, to: 8}))},
		{id: 'ele', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row, from: 8, to: 11}))},
		{id: 'page', find: {re: /STA.1/, area: 'S'}},
	],
});
