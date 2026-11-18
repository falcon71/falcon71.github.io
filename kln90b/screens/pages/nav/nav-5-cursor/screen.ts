import {adjustCourseIndicator, defineScreen, place, pointFrom} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'NAV 5 page with the cursor on the map orientation',
	show: 'left',
	// 20 NM south of KSEA, with a Direct To KSEA
	boot: {position: pointFrom(place('KSEA'), 180, 20)},
	steps: async u => {
		await u.panel.directTo('KSEA');
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'NAV 5');
		// The cursor comes on at the range; the outer knob moves it to the orientation, and the inner knob turns the map
		// from north up to desired track up
		await u.panel.cursor('L');
		await u.panel.outer('L', -1);
		await u.panel.inner('L', 1);
	},
	fields: [
		{id: 'orientation', find: {re: /DTK\^/, area: 'L', row: 5}},
		{id: 'range', find: {re: /\d+$/, area: 'L', row: 5}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'leg', find: {map: 'L', draw: /^arrow \S+ KSEA$/}},
		{id: 'active-waypoint', find: {map: 'L', draw: /^icon % KSEA$/}},
		{id: 'aircraft', find: {map: 'L', draw: /^icon \$ /}},
	],
});
