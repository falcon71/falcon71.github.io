import {defineScreen, facility, place, savedFlightplan, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'CTR 2 with the first of two center waypoints',
	show: 'right',
	// The route leaves the Seattle Center at Portland, enters the Salt Lake City Center at Baker City and returns to the Seattle Center on the way to Spokane
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KBKE', 'KGEG'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'CTR 1');
		await u.panel.ent();
		await wait(3000);
		await u.panel.inner('R', 1);
	},
	fields: [
		{id: 'ident', find: {area: 'R', row: 0}},
		{id: 'centers', find: {area: 'R', row: 1}},
		{id: 'vor', find: {area: 'R', row: 2}},
		{id: 'dis', find: {area: 'R', row: 3}},
		{id: 'lat', find: {area: 'R', row: 4}},
		{id: 'lon', find: {area: 'R', row: 5}},
		{id: 'page', find: {re: /CTR\+2/, area: 'S'}},
	],
});
