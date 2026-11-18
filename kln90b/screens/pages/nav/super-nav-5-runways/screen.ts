import {COURSE_MESSAGE_DELAY} from '../../../../../vendor/kln90b/kln90b/data/PersistentMessages';
import {
	adjustCourseIndicator, courseDeg, defineScreen, facility, moveAircraft, place, pointFrom, savedFlightplan, showSuperNav5, wait,
} from '../../../../generator/api.ts';

const KPAE = place('KPAE');
const KSEA = place('KSEA');
// 1.5 NM short of KSEA on the leg from KPAE
const POSITION = pointFrom(KSEA, courseDeg(KSEA, KPAE), 1.5);

defineScreen(import.meta.url, {
	title: 'Super NAV 5 at a range scale of 2 NM, with the runways of KSEA',
	show: 'both',
	boot: {position: POSITION, storage: savedFlightplan(0, [facility('KPAE'), facility('KSEA')])},
	steps: async u => {
		await moveAircraft(u, POSITION, {groundspeedKt: 123, trackTrue: courseDeg(POSITION, KSEA)});
		await wait(COURSE_MESSAGE_DELAY + 1000);
		await adjustCourseIndicator(u);
		await showSuperNav5(u);
		// The left CRSR puts the cursor on the range: eight steps of the inner knob counterclockwise go from 40 NM to 2 NM
		await u.panel.cursor('L');
		await u.panel.inner('L', -8);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /KSEA/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'ete', find: {re: /Ð\S+/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		{id: 'active-leg', find: {map: 'F', draw: /^arrow KPAE KSEA$/}},
		{id: 'runways', find: {map: 'F', draw: /^plain /, many: true}},
		{id: 'waypoint', find: [{map: 'F', draw: /^icon @ KSEA$/}, {map: 'F', draw: /^label KSEA /}]},
		{id: 'runway-numbers', find: {map: 'F', draw: /^label (?!KSEA )/, many: true}},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
