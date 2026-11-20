import {adjustCourseIndicator, defineScreen, facility, place, savedFlightplan, wait} from '../../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../../vendor/kln90b/kln90b/data/PersistentMessages';

defineScreen(import.meta.url, {
	title: 'D/T 1 beside FPL 0 while the aircraft stands still',
	show: 'both',
	// On the ground at KPDX, with FPL 0 from KPDX over KOLM and KSEA to KGEG
	boot: {
		position: place('KPDX'),
		storage: savedFlightplan(0, ['KPDX', 'KOLM', 'KSEA', 'KGEG'].map(facility)),
	},
	steps: async u => {
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'D/T 1');
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'header', find: {re: /DIS +ETE/, area: 'R'}},
		{id: 'active', find: {area: 'R', row: 2}},
		{id: 'next', find: [{area: 'R', row: 3}, {area: 'R', row: 4}]},
		{id: 'lname', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rname', find: {re: /D\/T 1/, area: 'S'}},
	],
});
