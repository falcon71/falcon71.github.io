import {adjustCourseIndicator, defineScreen, place, pointFrom} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'NAV 5 page, actual track up, with the aircraft standing still',
	show: 'left',
	// 20 NM south of KSEA, on the ground, with a Direct To KSEA. The unit keeps the orientation the pilot chose, here
	// actual track up, from the last flight; the map is blank from the first moment NAV 5 is shown
	boot: {position: pointFrom(place('KSEA'), 180, 20), storage: {nav5MapOrientation: 2}},
	steps: async u => {
		await u.panel.directTo('KSEA');
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'NAV 5');
	},
	fields: [
		{id: 'orientation', find: {re: /---°/, area: 'L', row: 5}},
		{id: 'range', find: {re: /\d+$/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 5/, area: 'S'}},
	],
});
