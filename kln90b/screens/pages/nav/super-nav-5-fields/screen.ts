import {
	adjustCourseIndicator, courseDeg, defineScreen, facility, moveAircraft, place, pointFrom, savedFlightplan, showSuperNav5, wait,
} from '../../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../../vendor/kln90b/kln90b/data/PersistentMessages';

const KPAE = place('KPAE');
const KSEA = place('KSEA');
// 12 NM short of KSEA on the leg from KPAE, then 0.7 NM to the right of the leg
const ON_LEG = pointFrom(KSEA, courseDeg(KSEA, KPAE), 12);
const POSITION = pointFrom(ON_LEG, courseDeg(KPAE, KSEA) + 90, 0.7);

defineScreen(import.meta.url, {
	title: 'Super NAV 5 with XTK, BRG and RAD in the three fields',
	show: 'both',
	boot: {position: POSITION, storage: savedFlightplan(0, [facility('KPAE'), facility('KSEA')])},
	steps: async u => {
		await moveAircraft(u, POSITION, {groundspeedKt: 123, trackTrue: courseDeg(POSITION, KSEA)});
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
		await showSuperNav5(u);
		// The left CRSR puts the cursor on the range. The outer knob moves it up to field 3, field 2 and field 1, and the
		// inner knob chooses RAD, BRG and XTK
		await u.panel.cursor('L');
		await u.panel.outer('L', -1);
		await u.panel.inner('L', 2);
		await u.panel.outer('L', -1);
		await u.panel.inner('L', 1);
		await u.panel.outer('L', -1);
		await u.panel.inner('L', 1);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /KSEA/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'xtk', find: {re: /\S+NM\S/, area: 'F', row: 4}},
		{id: 'bearing', find: {re: /Ô\d{3}°/, area: 'F', row: 5}},
		{id: 'radial', find: {re: /Õ\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		{id: 'active-leg', find: {map: 'F', draw: /^arrow KPAE KSEA$/}},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ /, many: true}, {map: 'F', draw: /^label /, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
