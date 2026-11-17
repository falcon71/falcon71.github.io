import {adjustCourseIndicator, defineScreen, place, pointFrom, wait} from '../../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../../vendor/kln90b/kln90b/data/PersistentMessages';

defineScreen(import.meta.url, {
	title: 'ACT page of a terminal waypoint',
	show: 'right',
	// 25 NM west of KBKE, with a Direct To CAKPU, a terminal waypoint of KBKE
	boot: {position: pointFrom(place('KBKE'), 270, 25)},
	steps: async u => {
		await u.panel.directTo('CAKPU');
		// The Direct To raises ADJ NAV IND CRS, which a pilot answers on the indicator
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('R', 'ACT');
		// The unit looks for the reference VOR for about 8 seconds
		await wait(9000);
	},
	fields: [
		{id: 'arrow', find: {re: /›/, area: 'R', row: 0}},
		{id: 'number', find: {area: 'R', row: 0, from: 1, to: 4}},
		{id: 'ident', find: {re: /CAKPU/, area: 'R', row: 0}},
		{id: 'type', find: {re: /T$/, area: 'R', row: 0}},
		{id: 'ref', find: {area: 'R', row: 1}},
		{id: 'rad', find: {area: 'R', row: 2}},
		{id: 'dis', find: {area: 'R', row: 3}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'page', find: {re: /ACT/, area: 'S'}},
	],
});
