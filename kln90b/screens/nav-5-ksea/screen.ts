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
		{id: 'bottom', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 5/, area: 'S'}},
	],
});
