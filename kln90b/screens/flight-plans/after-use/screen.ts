import {adjustCourseIndicator, courseDeg, defineScreen, moveAircraft, place, pointFrom, wait} from '../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../vendor/kln90b/kln90b/data/PersistentMessages';
import {BOOT_FPL_1} from '../../shared/flight-plans.ts';

const POSITION = pointFrom(place('KOLM'), courseDeg(place('KOLM'), place('KSEA')), 20);

defineScreen(import.meta.url, {
	title: 'FPL 0 after the question USE? on the second leg',
	show: 'left',
	boot: {...BOOT_FPL_1, position: POSITION},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.cursor('L');
		await u.panel.ent();
		// The unit makes the leg closest to the aircraft active, and a pilot answers the message of the leg on the indicator
		await moveAircraft(u, POSITION, {groundspeedKt: 120, trackTrue: courseDeg(POSITION, place('KSEA'))});
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
	},
	fields: [
		{id: 'from', find: {re: /Á *2:KOLM/, area: 'L'}},
		{id: 'active', find: {re: /À *3:KSEA/, area: 'L'}},
		{id: 'blank', find: {re: /4: +/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
