import {defineScreen, NEAREST_SEARCH_WAIT_MS, place, pointFrom, wait} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The nearest airport after MSG and ENT',
	show: 'both',
	// 3 NM east of KSEA
	boot: {position: pointFrom(place('KSEA'), 100, 3)},
	steps: async u => {
		await wait(NEAREST_SEARCH_WAIT_MS);
		await u.panel.selectPage('L', 'SET 3');
		// MSG opens the message page, which holds no message; ENT closes it and shows the nearest airport on the right
		await u.panel.msg();
		await u.panel.ent();
	},
	fields: [
		{id: 'set-title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'set-length', find: [{re: /MIN LENGTH:/, area: 'L'}, {area: 'L', row: 3}]},
		{id: 'set-surface', find: [{re: /SURFACE:/, area: 'L'}, {area: 'L', row: 5}]},
		{id: 'ident', find: {area: 'R', row: 0, from: 1, to: 5}},
		{id: 'rank', find: {re: /nr \d/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'length', find: {re: /\d+'/, area: 'R', row: 3}},
		{id: 'surface', find: {re: /[A-Z]{3}/, area: 'R', row: 3}},
		{id: 'lighting', find: {area: 'R', row: 4, from: 0, to: 3}},
		{id: 'bearing', find: {re: /\d+°to/, area: 'R', row: 4}},
		{id: 'distance', find: {re: /[\d.]+nm/, area: 'R', row: 5}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'lpage', find: {re: /SET 3/, area: 'S'}},
		{id: 'rpage', find: {re: /APT 1/, area: 'S'}},
	],
});
