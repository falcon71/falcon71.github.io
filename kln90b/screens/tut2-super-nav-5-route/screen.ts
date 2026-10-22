import {
	adjustCourseIndicator,
	courseDeg,
	defineScreen,
	type Locator,
	moveAircraft,
	place,
	pointFrom,
	showSuperNav5,
	wait,
} from '../../generator/api.ts';
import {CLEANED_UP, cleanUpDuplicates, tut2Boot} from '../shared/tut2.ts';

// The waypoints the aircraft has passed, and the one it flies to
const PASSED = ['YKM', 'TITON', 'CADED', 'CHINS'];
const ACTIVE = 'RADDY';
const GROUNDSPEED_KT = 150;
// The runway fix of the approach is no place of the extract, so the map describes its icon and name by its position
const RUNWAY_FIX = 'RW32L';

/**
 * The icon and the name of a waypoint of FPL 0, each of which must be drawn exactly once, so that the screen fails when
 * a waypoint falls off the map.
 */
function drawn(ident: string): Locator[] {
	const icon = ident === RUNWAY_FIX ? /^icon @ -?\d+\.\d+,-?\d+\.\d+$/ : new RegExp(`^icon @ ${ident}$`);
	return [{map: 'F', draw: icon}, {map: 'F', draw: new RegExp(`^label ${ident} `)}];
}

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
			const legTrack = courseDeg(place(route[i]), place(route[i + 1]));
			const past = pointFrom(place(route[i]), legTrack, 1);
			await moveAircraft(u, past, {groundspeedKt: GROUNDSPEED_KT, trackTrue: legTrack});
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
		// What the map draws: the legs of FPL 0, the active one with an arrow; each waypoint of FPL 0 with its name; and
		// the aircraft
		{id: 'active-leg', find: {map: 'F', draw: /^arrow CHINS RADDY$/}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{id: 'active-waypoint', find: drawn(ACTIVE)},
		{id: 'waypoints', find: CLEANED_UP.filter(ident => ident !== ACTIVE).flatMap(drawn)},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
