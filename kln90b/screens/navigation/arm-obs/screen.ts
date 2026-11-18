import {
	adjustCourseIndicator, APR_ARM_SWITCH, courseDeg, facility, moveAircraft, panelXml, place, pointFrom, savedFlightplan, wait,
} from '../../../generator/api.ts';
import {defineScreen} from '../../../generator/api.ts';
import {rnav34lWaypoints} from '../../shared/apt-7-8.ts';

// Flying the stored flight plan from KPDX to KSEA, 25 NM short of KSEA, with the RNAV approach to 34L loaded, in OBS mode
const KPDX = place('KPDX');
const KSEA = place('KSEA');
const POSITION = pointFrom(KSEA, courseDeg(KSEA, KPDX), 25);

defineScreen(import.meta.url, {
	title: 'MOD 2 in approach arm mode and OBS mode',
	show: 'both',
	boot: {
		position: POSITION,
		panelXml: panelXml(APR_ARM_SWITCH),
		storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')]),
	},
	steps: async u => {
		await moveAircraft(u, POSITION, {groundspeedKt: 123, trackTrue: courseDeg(POSITION, KSEA)});
		await wait(2000);
		await rnav34lWaypoints(u);
		await u.panel.ent();
		await wait(15000);
		await adjustCourseIndicator(u);
		await u.panel.obsMode();
		// The scale of the D-bar has gone down to 1 NM
		await wait(35000);
		await u.panel.selectPage('L', 'MOD 2');
		await u.panel.selectPage('R', 'NAV 1');
		// Arming the approach asks for the baro setting: the ALT page, then the message
		await u.panel.alt();
		await wait(1000);
		await u.panel.alt();
		await wait(1000);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'title', find: {re: /ACTIVE MODE/, area: 'L', row: 0}},
		{id: 'course', find: {re: /OBS.\S+°/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /MOD 2/, area: 'S'}},
		{id: 'mode', find: {re: /arm:\d+/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
