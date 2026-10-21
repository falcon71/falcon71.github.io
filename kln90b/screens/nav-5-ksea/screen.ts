import {adjustCourseIndicator, defineScreen, place, pointFrom} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'NAV 5 page',
	show: 'left',
	// 20 NM south of KSEA, with a Direct To KSEA
	boot: {position: pointFrom(place('KSEA'), 180, 20)},
	steps: async u => {
		await u.panel.directTo('KSEA');
		// The Direct To raises ADJ NAV IND CRS, which a pilot answers on the indicator
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'NAV 5');
	},
	fields: [
		// The orientation of the map (north up) and its range in NM
		{id: 'orientation', find: {re: /N\^/, area: 'L', row: 5}},
		{id: 'range', find: {re: /\d+$/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 5/, area: 'S'}},
		// What the map draws: the Direct To from where it was made, the active waypoint and the aircraft
		{id: 'leg', find: {map: 'L', draw: /^arrow \S+ KSEA$/}},
		{id: 'active-waypoint', find: {map: 'L', draw: /^icon % KSEA$/}},
		{id: 'aircraft', find: {map: 'L', draw: /^icon \$ /}},
	],
});
