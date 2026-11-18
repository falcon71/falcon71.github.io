import {
	adjustCourseIndicator, courseDeg, defineScreen, facility, moveAircraft, place, pointFrom, savedFlightplan, wait,
} from '../../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../../vendor/kln90b/kln90b/data/PersistentMessages';

// Flying from KSEA to KYKM, 10 NM out, with the Cascades ahead
const KSEA = place('KSEA');
const KYKM = place('KYKM');
const POSITION = pointFrom(KSEA, courseDeg(KSEA, KYKM), 10);

defineScreen(import.meta.url, {
	title: 'NAV 3 page on a route over higher terrain',
	show: 'left',
	boot: {position: POSITION, storage: savedFlightplan(0, [facility('KSEA'), facility('KYKM')])},
	steps: async u => {
		await moveAircraft(u, POSITION, {groundspeedKt: 120, trackTrue: courseDeg(POSITION, KYKM)});
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'NAV 3');
	},
	fields: [
		{id: 'from', find: {area: 'L', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {re: /›/, area: 'L', row: 0}},
		{id: 'to', find: {area: 'L', row: 0, from: 6, to: 11}},
		{id: 'dtk', find: {re: /DTK +\S+/, area: 'L', row: 1}},
		{id: 'tk', find: {re: /TK +\S+/, area: 'L', row: 2}},
		{id: 'fly', find: {re: /FLY.+/, area: 'L', row: 3}},
		{id: 'msa', find: {re: /MSA.+/, area: 'L', row: 4}},
		{id: 'esa', find: {re: /ESA.+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 3/, area: 'S'}},
	],
});
