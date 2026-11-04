import {defineScreen, NEAREST_SEARCH_WAIT_MS, place, pointFrom, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'APT 1 page of a nearest airport',
	show: 'right',
	// 3 NM east of KSEA
	boot: {position: pointFrom(place('KSEA'), 100, 3)},
	steps: async u => {
		await wait(NEAREST_SEARCH_WAIT_MS);
		await u.panel.selectPage('R', 'APT 1');
		// The nearest airport, then the next one down the list with the right inner knob pulled out
		await u.panel.msg();
		await u.panel.ent();
		await u.panel.scan();
		await u.panel.inner('R', 1);
		await u.panel.scan();
	},
	fields: [
		{id: 'ident', find: {area: 'R', row: 0, from: 1, to: 5}},
		{id: 'rank', find: {re: /nr \d/, area: 'R', row: 0}},
		{id: 'name', find: {area: 'R', row: 1}},
		{id: 'length', find: {re: /\d+'/, area: 'R', row: 3}},
		{id: 'surface', find: {re: /[A-Z]{3}/, area: 'R', row: 3}},
		{id: 'lighting', find: {area: 'R', row: 4, from: 0, to: 3}},
		{id: 'bearing', find: {re: /\d+°to/, area: 'R', row: 4}},
		{id: 'distance', find: {re: /[\d.]+nm/, area: 'R', row: 5}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
