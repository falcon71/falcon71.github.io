import {defineScreen, NEAREST_SEARCH_WAIT_MS, place, pointFrom, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'OTH 2 page outside every Center',
	show: 'left',
	// Over the Pacific, 700 NM west of Seattle
	boot: {position: pointFrom(place('KSEA'), 270, 700)},
	steps: async u => {
		await u.panel.selectPage('L', 'OTH 2');
		await wait(NEAREST_SEARCH_WAIT_MS);
	},
	fields: [
		{id: 'outside', find: {re: /OUTSIDE/, area: 'L', row: 0}},
		{id: 'artcc', find: {re: /ARTCC/, area: 'L', row: 1}},
		{id: 'page', find: {re: /OTH 2/, area: 'S'}},
	],
});
