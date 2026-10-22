import {defineScreen, NEAREST_SEARCH_WAIT_MS, place, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'OTH 2 page',
	show: 'left',
	// Over Yakima, inside the Seattle Center
	boot: {position: place('KYKM')},
	steps: async u => {
		await u.panel.selectPage('L', 'OTH 2');
		// The page looks for the Center of the present position every 10 s
		await wait(NEAREST_SEARCH_WAIT_MS);
	},
	fields: [
		// The name of the Center takes the first row and CTR the second
		{id: 'center', find: {area: 'L', row: 0}},
		{id: 'ctr', find: {re: /CTR/, area: 'L', row: 1}},
		// The frequencies of the Center
		{id: 'frequency', find: {re: /\d{3}\.\d{2}/, area: 'L'}},
		{id: 'page', find: {re: /OTH 2/, area: 'S'}},
	],
});
