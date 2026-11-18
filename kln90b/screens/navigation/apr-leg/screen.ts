import {
	adjustCourseIndicator, APR_ARM_SWITCH, courseDeg, facility, moveAircraft, panelXml, place, pointFrom, savedFlightplan, wait,
} from '../../../generator/api.ts';
import {defineScreen} from '../../../generator/api.ts';
import {rnav34lWaypoints} from '../../shared/apt-7-8.ts';

// The RNAV approach to 34L at KSEA loaded and armed; the aircraft 1.5 NM before the FAF JALON on the final course
const KPDX = place('KPDX');
const KSEA = place('KSEA');
const JALON = place('JALON');
const HOVOS = place('HOVOS');
const START = pointFrom(KSEA, courseDeg(KSEA, KPDX), 25);
const FINAL = pointFrom(JALON, courseDeg(HOVOS, JALON), 1.5);

defineScreen(import.meta.url, {
	title: 'MOD 1 in approach active mode',
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
		// Direct to the FAF, then the aircraft on the final course short of it
		await u.panel.directTo('JALON');
		await moveAircraft(u, FINAL, {groundspeedKt: 100, trackTrue: courseDeg(FINAL, JALON)});
		await wait(10000);
		await adjustCourseIndicator(u);
		await u.panel.alt();
		await wait(1000);
		await u.panel.alt();
		await wait(1000);
		await u.panel.readMessages();
		await u.panel.selectPage('L', 'MOD 1');
		await u.panel.selectPage('R', 'NAV 1');
	},
	fields: [
		{id: 'title', find: {re: /ACTIVE MODE/, area: 'L', row: 0}},
		{id: 'leg', find: {re: /LEG/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /MOD 1/, area: 'S'}},
		{id: 'mode', find: {re: /apr-leg/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
