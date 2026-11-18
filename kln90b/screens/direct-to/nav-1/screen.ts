import {adjustCourseIndicator, courseDeg, defineScreen, moveAircraft, place, wait} from '../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../vendor/kln90b/kln90b/data/PersistentMessages';

defineScreen(import.meta.url, {
	title: 'NAV 1 right after a direct-to',
	show: 'right',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.directTo('KBFI');
		await moveAircraft(u, place('KPDX'), {groundspeedKt: 120, trackTrue: courseDeg(place('KPDX'), place('KBFI'))});
		// The direct-to raises ADJ NAV IND CRS, which a pilot answers on the indicator
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
	},
	fields: [
		{id: 'from', find: {re: /d›/, area: 'R', row: 0}},
		{id: 'to', find: {re: /KBFI/, area: 'R', row: 0}},
		{id: 'cdi', find: {area: 'R', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
