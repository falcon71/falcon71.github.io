import {adjustCourseIndicator, defineScreen, place, pointFrom, wait} from '../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../vendor/kln90b/kln90b/data/PersistentMessages';

defineScreen(import.meta.url, {
	title: 'ACT page of a direct-to waypoint outside FPL 0',
	show: 'right',
	// 20 NM east of the DPY NDB, with a Direct To DPY and no flight plan
	boot: {position: pointFrom(place('DPY'), 90, 20)},
	steps: async u => {
		await u.panel.directTo('DPY');
		// The Direct To raises ADJ NAV IND CRS, which a pilot answers on the indicator
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('R', 'ACT');
	},
	fields: [
		{id: 'arrow', find: {re: /›/, area: 'R', row: 0}},
		{id: 'number', find: {area: 'R', row: 0, from: 1, to: 4}},
		{id: 'ident', find: {re: /DPY/, area: 'R', row: 0}},
		{id: 'type', find: {re: /N$/, area: 'R', row: 0}},
		{id: 'name', find: {area: 'R', row: 1}},
		{id: 'freq', find: {re: /FREQ +\d+/, area: 'R', row: 3}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'page', find: {re: /ACT/, area: 'S'}},
	],
});
