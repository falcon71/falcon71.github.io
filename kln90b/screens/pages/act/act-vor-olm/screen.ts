import {
	adjustCourseIndicator, courseDeg, defineScreen, facility, moveAircraft, place, pointFrom, savedFlightplan, wait,
} from '../../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../../vendor/kln90b/kln90b/data/PersistentMessages';

const KPDX = place('KPDX');
const OLM = place('OLM');
const POSITION = pointFrom(OLM, courseDeg(OLM, KPDX), 30);

defineScreen(import.meta.url, {
	title: 'ACT page of a VOR',
	show: 'right',
	// The stored flight plan KPDX, OLM, KSEA, flown 30 NM short of OLM, so that the VOR is the active waypoint
	boot: {
		position: POSITION,
		storage: savedFlightplan(0, [facility('KPDX'), facility('OLM'), facility('KSEA')]),
	},
	steps: async u => {
		await moveAircraft(u, POSITION, {groundspeedKt: 123, trackTrue: courseDeg(POSITION, OLM)});
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('R', 'ACT');
	},
	fields: [
		{id: 'arrow', find: {re: /›/, area: 'R', row: 0}},
		{id: 'number', find: {re: /\d/, area: 'R', row: 0}},
		{id: 'ident', find: {re: /OLM/, area: 'R', row: 0}},
		{id: 'dme', find: {re: /D/, area: 'R', row: 0}},
		{id: 'type', find: {re: /V$/, area: 'R', row: 0}},
		{id: 'name', find: {area: 'R', row: 1}},
		{id: 'class', find: {re: /H$/, area: 'R', row: 2}},
		{id: 'freq', find: {re: /\d+\.\d\d/, area: 'R', row: 3}},
		{id: 'magvar', find: {re: /\d+°[EW]/, area: 'R', row: 3}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R', row: 5}},
		{id: 'page', find: {re: /ACT/, area: 'S'}},
	],
});
