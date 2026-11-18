import {
	adjustCourseIndicator, APR_ARM_SWITCH, courseDeg, defineScreen, facility, moveAircraft, panelXml, place, pointFrom,
	savedFlightplan, wait,
} from '../../../../generator/api.ts';
import {rnav34lWaypoints} from '../../../shared/apt-7-8.ts';

// The RNAV approach to 34L at KSEA loaded and active; direct to the FAF JALON, the aircraft 1.5 NM before it on the final course
const KPDX = place('KPDX');
const KSEA = place('KSEA');
const JALON = place('JALON');
const HOVOS = place('HOVOS');
const START = pointFrom(KSEA, courseDeg(KSEA, KPDX), 25);
const FINAL = pointFrom(JALON, courseDeg(HOVOS, JALON), 1.5);

defineScreen(import.meta.url, {
	title: 'Super NAV 1 in approach active mode',
	show: 'both',
	boot: {
		position: START,
		panelXml: panelXml(APR_ARM_SWITCH),
		storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')]),
	},
	steps: async u => {
		await moveAircraft(u, START, {groundspeedKt: 123, trackTrue: courseDeg(START, KSEA)});
		await wait(2000);
		await rnav34lWaypoints(u);
		await u.panel.ent();
		await wait(15000);
		await adjustCourseIndicator(u);
		await u.panel.directTo('JALON');
		await moveAircraft(u, FINAL, {groundspeedKt: 100, trackTrue: courseDeg(FINAL, JALON)});
		await wait(10000);
		await adjustCourseIndicator(u);
		await u.panel.alt();
		await wait(1000);
		await u.panel.alt();
		await wait(1000);
		await u.panel.readMessages();
		await u.panel.selectPage('L', 'NAV 1');
		await u.panel.selectPage('R', 'NAV 1');
	},
	fields: [
		{id: 'from', find: {area: 'F', row: 0, from: 6, to: 11}},
		{id: 'arrow', find: {re: /›/, area: 'F', row: 0}},
		{id: 'to', find: {area: 'F', row: 0, from: 12, to: 18}},
		{id: 'cdi', find: {area: 'F', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'F'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'F'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'F'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'F'}},
		{id: 'lpage', find: {area: 'S', from: 0, to: 5}},
		{id: 'mode', find: {re: /apr-leg/, area: 'S'}},
		{id: 'prompt', find: {area: 'S', from: 14, to: 17}},
		{id: 'rpage', find: {area: 'S', from: 18, to: 23}},
	],
});
