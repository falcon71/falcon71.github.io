import {
	adjustCourseIndicator,
	courseDeg,
	defineScreen,
	moveAircraft,
	place,
	pointFrom,
	showSuperNav5,
	wait,
} from '../../generator/api.ts';
import {cleanUpDuplicates, tut2Boot} from '../shared/tut2.ts';

// The waypoints the aircraft has passed, and the one it flies to
const PASSED = ['YKM', 'TITON', 'CADED', 'CHINS'];
const ACTIVE = 'RADDY';
const GROUNDSPEED_KT = 150;

defineScreen(import.meta.url, {
	title: 'The route of tutorial flight 2 on Super NAV 5',
	show: 'both',
	boot: tut2Boot,
	steps: async u => {
		await cleanUpDuplicates(u);
		// The aircraft is staged a mile past each waypoint on the leg after it, so that the unit sequences them as in
		// flight, and then on the leg from CHINS to RADDY, the first leg of the arrival
		const route = [...PASSED, ACTIVE];
		for (let i = 0; i < PASSED.length; i++) {
			const track = courseDeg(place(route[i]), place(route[i + 1]));
			await moveAircraft(u, pointFrom(place(route[i]), track, 1), {groundspeedKt: GROUNDSPEED_KT, trackTrue: track});
			await wait(2000);
		}
		const track = courseDeg(place('CHINS'), place(ACTIVE));
		await moveAircraft(u, pointFrom(place('CHINS'), track, 20), {groundspeedKt: GROUNDSPEED_KT, trackTrue: track});
		await wait(2000);
		// The unit asks for the course of the leg to RADDY with ADJ NAV IND CRS
		await adjustCourseIndicator(u);
		await showSuperNav5(u);
		// The left cursor comes on at the range of the map, and the inner knob turns it from 40 to 60 NM, which holds
		// the whole route
		await u.panel.cursor('L');
		await u.panel.inner('L', 1);
		await u.panel.cursor('L');
	},
	fields: [
		// The left column: the distance to the active waypoint and its name, the mode, the ground speed and the three
		// fields the pilot chooses (here ETE, DTK and TK)
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /RADDY/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'ete', find: {re: /Ð\d+:\d\d/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		// The range of the map in NM, over the map
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		// What the map draws: the legs of FPL 0, the active one with an arrow; each waypoint with its name; and the
		// aircraft. The runway fix RW32L is no place of the extract, so its icon and name are described by its position
		{id: 'active-leg', find: {map: 'F', draw: /^arrow CHINS RADDY$/}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{
			id: 'active-waypoint',
			find: [{map: 'F', draw: /^icon @ RADDY$/}, {map: 'F', draw: /^label RADDY RADDY$/}],
		},
		{
			id: 'waypoints',
			find: [{map: 'F', draw: /^icon @ (?!RADDY$)/, many: true}, {map: 'F', draw: /^label (?!RADDY )/, many: true}],
		},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
