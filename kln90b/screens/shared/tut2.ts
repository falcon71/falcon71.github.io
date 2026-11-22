// The state of the unit that the screens of tutorial flight 2 share: on the ground at KYKM, with FPL 0 holding the en
// route waypoints of the flight. The pilot loads the departure, the arrival and the approach on top of it in that order;
// the screens of each step start from the state the steps before it leave.
import {
	adjustCourseIndicator,
	APR_ARM_SWITCH,
	courseDeg,
	facility,
	moveAircraft,
	panelXml,
	place,
	pointFrom,
	savedFlightplan,
	wait,
	type ScreenDescription,
} from '../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../vendor/kln90b/kln90b/data/PersistentMessages';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';
import {fplIdents} from '../../../vendor/kln90b/test/harness/readers';
import {LEG_OBS_SWITCH} from '../../../vendor/kln90b/test/harness/panelXml';
import {Screen} from '../../../vendor/kln90b/test/harness/render/screen';

/** The en route waypoints of the flight, in the order the pilot enters them into FPL 0. */
export const TUT2_ENROUTE = ['KYKM', 'TITON', 'CADED', 'CHINS', 'KBFI'];

export const tut2Boot: NonNullable<ScreenDescription['boot']> = {
	position: place('KYKM'),
	storage: savedFlightplan(0, TUT2_ENROUTE.map(facility)),
	// The flight ends with an approach, so the unit is installed for approaches, which gives it APT 8. The aircraft has
	// a GPS CRS switch, which selects leg or OBS mode in place of ENT on the MOD pages
	panelXml: panelXml({...APR_ARM_SWITCH, ...LEG_OBS_SWITCH}),
};

/**
 * The unit at KYKM with FPL 0 empty, the way the tutorial starts: the pilot enters the route by hand
 * (`enterRoute`). The other screens boot with the same FPL 0 stored, which gives the unit the same state.
 */
export const tut2EmptyBoot: NonNullable<ScreenDescription['boot']> = {
	position: place('KYKM'),
	panelXml: panelXml({...APR_ARM_SWITCH, ...LEG_OBS_SWITCH}),
};

/**
 * Enters the en route waypoints into the empty FPL 0 the way the tutorial does: the left cursor on the blank waypoint
 * position, each identifier, ENT and ENT. FPL 0 becomes active with its second waypoint, and the message ADJ NAV IND CRS
 * TO that follows is answered on the external indicator. Ends with FPL 0 on the left and the cursor off.
 */
export async function enterRoute(u: HeadlessUnit): Promise<void> {
	await u.panel.appendToFpl0(TUT2_ENROUTE);
	await wait(1000);
	await adjustCourseIndicator(u);
}

// The text of a list entry on APT 7 and APT 8 is its number and its name; the cursor covers the whole entry
const YKM7 = '3 YKM7';
const CHINS5 = '1 CHINS5';
const YKM_TRANSITION = '3 YKM';
// The list of approaches shows the RNAV (GPS) Y approach to 32L without its suffix
const RNAV_32L = '1 RNAV 32L';
const HUMPP = '2 HUMPP';

/** APT 7 of KYKM on the right, with the cursor on YKM7 in its list of departures. */
export async function cursorOnYkm7(u: HeadlessUnit): Promise<void> {
	// The APT pages share one airport, entered here on APT 1
	await u.panel.selectPage('R', 'APT 1');
	await u.panel.cursor('R');
	await u.panel.enterIdent('R', 'KYKM');
	await u.panel.cursor('R');
	await u.panel.selectPage('R', 'APT 7');
	// The cursor comes on at the first departure
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', YKM7);
}

/**
 * YKM7 chosen: it has no en route transition, and every runway of it gives the same waypoints, so the unit asks for
 * neither and shows the waypoints of the departure at once, with the cursor on LOAD IN FPL.
 */
export async function cursorOnLoadSid(u: HeadlessUnit): Promise<void> {
	await cursorOnYkm7(u);
	await u.panel.ent();
}

/**
 * Loads YKM7 into FPL 0 and answers the messages of the load: TITON is both a waypoint of the departure and an
 * en route waypoint (REDUNDANT WPTS IN FPL), and the leg to YKM is active now (ADJ NAV IND CRS). The unit shows FPL 0 on
 * the left then, and the right cursor is off.
 */
export async function loadSid(u: HeadlessUnit): Promise<void> {
	await cursorOnLoadSid(u);
	await u.panel.ent();
	await wait(1000);
	// Reads every message and turns the indicator to the course ADJ NAV IND CRS asks for
	await adjustCourseIndicator(u);
}

/** APT 7 of KBFI on the right, at its list of arrivals, with the cursor on CHINS5. */
export async function cursorOnChins5(u: HeadlessUnit): Promise<void> {
	await loadSid(u);
	await u.panel.selectPage('R', 'APT 1');
	await u.panel.cursor('R');
	await u.panel.enterIdent('R', 'KBFI');
	await u.panel.cursor('R');
	// KBFI has departures and arrivals, so APT 7 has two pages. The knob turns back from APT 1 by way of APT 8 and comes
	// to the last of them, the arrivals
	await u.panel.selectPage('R', 'APT 7');
	// The cursor comes on at the first arrival
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', CHINS5);
}

/** CHINS5 chosen: its list of transitions, with the cursor on YKM. */
export async function cursorOnYkmTransition(u: HeadlessUnit): Promise<void> {
	await cursorOnChins5(u);
	await u.panel.ent();
	// The cursor comes on at the first transition
	await u.panel.cursorTo('R', YKM_TRANSITION);
}

/**
 * YKM chosen: every runway of CHINS5 gives the same waypoints, so the unit asks for none and shows the waypoints of the
 * arrival at once, with the cursor on LOAD IN FPL.
 */
export async function cursorOnLoadStar(u: HeadlessUnit): Promise<void> {
	await cursorOnYkmTransition(u);
	await u.panel.ent();
}

/**
 * Loads CHINS5 with the transition YKM into FPL 0 and answers the message of the load: CHINS is both a
 * waypoint of the arrival and an en route waypoint (REDUNDANT WPTS IN FPL). The unit shows FPL 0 on the left then, and
 * on the right the list of arrivals with the cursor off.
 */
export async function loadStar(u: HeadlessUnit): Promise<void> {
	await cursorOnLoadStar(u);
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
}

/** APT 8 of KBFI on the right, with the cursor on the RNAV approach to 32L, the only approach in its list. */
export async function cursorOnRnav32l(u: HeadlessUnit): Promise<void> {
	await loadStar(u);
	await u.panel.selectPage('R', 'APT 8');
	// The cursor comes on at the first approach
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', RNAV_32L);
}

/** The approach chosen: its IAFs, with the cursor on HUMPP. */
export async function cursorOnHumpp(u: HeadlessUnit): Promise<void> {
	await cursorOnRnav32l(u);
	await u.panel.ent();
	// The cursor comes on at the first IAF
	await u.panel.cursorTo('R', HUMPP);
}

/** HUMPP chosen: the waypoints of the approach, with the cursor on LOAD IN FPL. */
export async function cursorOnLoadApproach(u: HeadlessUnit): Promise<void> {
	await cursorOnHumpp(u);
	await u.panel.ent();
}

/**
 * Loads the approach with the IAF HUMPP into FPL 0 and reads the messages (the load raises none). The unit shows FPL 0
 * on the left then, and on the right APT 8 goes back to its list of approaches with the cursor off.
 */
export async function loadApproach(u: HeadlessUnit): Promise<void> {
	await cursorOnLoadApproach(u);
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
}

// FPL 0 shows each waypoint with its number and a mark of its kind: a colon for an en route waypoint, a full stop for a
// waypoint of a departure or an arrival, a blank for one of an approach
const DUPLICATES = [
	// The arrival's copies of the first waypoints of the approach, from the end of the arrival
	'11.AUBRN', '10.HUMPP',
	// The arrival's YKM, which is also the first waypoint of the departure
	'7.YKM',
	// The en route copies the message REDUNDANT WPTS IN FPL points at
	'6:CHINS', '4:TITON',
];

/** FPL 0 once the duplicates are deleted. */
export const CLEANED_UP = [
	'KYKM', 'YKM', 'TITON', 'CADED', 'CHINS', 'RADDY', 'HUMPP', 'COVOG', 'AUBRN', 'DUANE', 'RW32L', 'FEVAS', 'GRRAM',
	'LOFAL', 'KBFI',
];

/**
 * Turns the left outer knob until the cursor is on the entry of FPL 0 that shows `entry`, its number, mark and
 * waypoint ('4:TITON'). The search turns clockwise and, once the cursor stops at the end of the list, counterclockwise.
 */
export async function cursorToEntry(u: HeadlessUnit, entry: string): Promise<void> {
	let dir: 1 | -1 = 1;
	for (let i = 0; i < 60; i++) {
		const field = u.panel.focused('L');
		// The first column holds the arrow of the active leg
		if (Screen.read().rows('L')[field.row].slice(1).trim() === entry) return;
		const before = Screen.read().dump();
		await u.panel.outer('L', dir);
		if (Screen.read().dump() === before) {
			if (dir === -1) break;
			dir = -1;
		}
	}
	throw new Error(`cursorToEntry: no entry "${entry}" in FPL 0\n${Screen.read().dump()}`);
}

/**
 * Deletes the waypoints that the departure, the arrival and the approach repeat from FPL 0, from the end of the list,
 * so that the numbers of the entries above stay: the left cursor on each copy, CLR, which asks DEL, and ENT. Ends with
 * FPL 0 on the left and the left cursor off.
 */
export async function cleanUpDuplicates(u: HeadlessUnit): Promise<void> {
	await loadApproach(u);
	await u.panel.cursor('L');
	for (const entry of DUPLICATES) {
		await cursorToEntry(u, entry);
		await u.panel.clr();
		await u.panel.ent();
	}
	await u.panel.cursor('L');
	await wait(1000);
	await adjustCourseIndicator(u);
	const idents = fplIdents(u);
	if (idents.join(' ') !== CLEANED_UP.join(' ')) {
		throw new Error(`cleanUpDuplicates: FPL 0 is ${idents.join(' ')}\n${Screen.read().dump()}`);
	}
}

// The flight. The aircraft is staged, not flown: each step puts it where the tutorial has the pilot do something

export const KYKM = place('KYKM');
export const YKM = place('YKM');
export const TITON = place('TITON');
export const CHINS = place('CHINS');
export const RADDY = place('RADDY');

/** The true course of runway 27 at KYKM, 274° magnetic with the variation there. */
const RUNWAY_27_TRUE = 289;
const CLIMB_KT = 90;
/** The groundspeed of the flight en route. */
export const GROUNDSPEED_KT = 120;
/** The radial 284 of YKM, along which the departure runs to TITON, as a true course. */
const RADIAL_TRUE = courseDeg(YKM, TITON);

/**
 * The departure: FPL 0 complete, the right side turned to NAV 1 before takeoff, and the aircraft 2 NM out on runway
 * heading, climbing. The unit flies the leg from KYKM to YKM, which the SID load made active.
 */
export async function climbOut(u: HeadlessUnit): Promise<void> {
	await cleanUpDuplicates(u);
	await u.panel.selectPage('R', 'NAV 1');
	await moveAircraft(u, pointFrom(KYKM, RUNWAY_27_TRUE, 2), {groundspeedKt: CLIMB_KT, trackTrue: RUNWAY_27_TRUE});
}

/**
 * The direct-to YKM made after the turn back toward YKM, 3 NM west of it: the Direct To page offers the active waypoint
 * YKM, and ENT approves it. The course message that follows is answered on the indicator.
 */
export async function directToYkm(u: HeadlessUnit): Promise<void> {
	await climbOut(u);
	await u.panel.dct();
	await u.panel.ent();
	const west = pointFrom(YKM, 270, 3);
	await moveAircraft(u, west, {groundspeedKt: CLIMB_KT, trackTrue: courseDeg(west, YKM)});
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}

/**
 * Sets the GPS CRS switch of the aircraft to OBS (true) or LEG (false). The unit reads the switch every cycle, and the
 * wait lets it follow.
 */
export async function gpsCrsSwitch(u: HeadlessUnit, obs: boolean): Promise<void> {
	u.env.sim.set('GPS OBS ACTIVE', 'bool', obs);
	await wait(2000);
}

/**
 * OBS mode before YKM: the pilot turns the external indicator to 284, the radial of the SID, turns the left side to
 * MOD 2 and sets the GPS CRS switch to OBS. The unit reads the indicator, so the selected course is 284.
 */
export async function obsOnRadial(u: HeadlessUnit): Promise<void> {
	await directToYkm(u);
	u.env.sim.set('Nav OBS:1', 'degrees', 284);
	await wait(2000);
	await u.panel.selectPage('L', 'MOD 2');
	await gpsCrsSwitch(u, true);
}

/** The aircraft `nm` out from YKM on the radial 284, flying outbound, in OBS mode. */
export async function outboundOnRadial(u: HeadlessUnit, nm: number): Promise<void> {
	await obsOnRadial(u);
	await moveAircraft(u, pointFrom(YKM, RADIAL_TRUE, nm), {groundspeedKt: CLIMB_KT, trackTrue: RADIAL_TRUE});
}

/**
 * Back to leg mode 8 NM out on the radial, with NAV 3 on the left and the GPS CRS switch set to LEG: YKM lies behind,
 * so the unit makes the leg from YKM to TITON active. Its desired track differs from the indicator by more than 5°, and
 * the course message that follows is answered on the indicator.
 */
export async function legModeToTiton(u: HeadlessUnit): Promise<void> {
	await outboundOnRadial(u, 8);
	await u.panel.selectPage('L', 'NAV 3');
	await gpsCrsSwitch(u, false);
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}

/**
 * OBS mode 2 NM before TITON on the radial, for the hold: the GPS CRS switch set to OBS, with the indicator still on the
 * desired track of the leg, which the unit takes as the selected course through TITON.
 */
export async function obsAtTiton(u: HeadlessUnit): Promise<void> {
	await legModeToTiton(u);
	await moveAircraft(u, pointFrom(TITON, RADIAL_TRUE + 180, 2), {groundspeedKt: CLIMB_KT, trackTrue: RADIAL_TRUE});
	await gpsCrsSwitch(u, true);
}

/**
 * En route in leg mode, `nm` past CHINS on the leg to RADDY. The aircraft is staged a mile past each waypoint before,
 * so that the unit sequences them as in flight, and each course message is answered on the indicator.
 */
export async function pastChins(u: HeadlessUnit, nm: number): Promise<void> {
	await cleanUpDuplicates(u);
	const route = ['YKM', 'TITON', 'CADED', 'CHINS', 'RADDY'].map(place);
	for (let i = 0; i < route.length - 1; i++) {
		const legTrack = courseDeg(route[i], route[i + 1]);
		await moveAircraft(u, pointFrom(route[i], legTrack, 1), {groundspeedKt: GROUNDSPEED_KT, trackTrue: legTrack});
		await wait(2000);
	}
	const track = courseDeg(CHINS, RADDY);
	await moveAircraft(u, pointFrom(CHINS, track, nm), {groundspeedKt: GROUNDSPEED_KT, trackTrue: track});
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}

/** The altitude of the aircraft on the arrival: the chart of CHINS5 has propeller aircraft cross RADDY at 10,000 ft. */
export const ARRIVAL_ALTITUDE_FT = 10000;

/** Turns the left inner knob until the character under the left cursor reads `ch`. */
async function setLeftDigit(u: HeadlessUnit, ch: string): Promise<void> {
	for (let i = 0; i < 10 && u.panel.focused('L').text !== ch; i++) {
		await u.panel.inner('L', 1);
	}
	if (u.panel.focused('L').text !== ch) {
		throw new Error(`setLeftDigit: the cursor shows ${u.panel.focused('L').text}, not ${ch}\n${Screen.read().dump()}`);
	}
}

/**
 * The descent planned on NAV 4, 12 NM past CHINS at the altitude of the arrival: the selected altitude 6,000 ft, the
 * VNAV waypoint COVOG of the approach with no offset, then the cursor on the angle, which starts VNAV at the angle shown,
 * and the angle 3.0 entered, which starts it again at that angle with the descent point ahead. The left cursor is
 * turned off at the end, and NAV 4 stays on the left.
 */
export async function vnavToCovog(u: HeadlessUnit): Promise<void> {
	await pastChins(u, 12);
	u.env.sim.set('PLANE ALTITUDE', 'feet', ARRIVAL_ALTITUDE_FT);
	u.env.sim.set('PRESSURE ALTITUDE', 'feet', ARRIVAL_ALTITUDE_FT);
	await wait(2000);
	await u.panel.selectPage('L', 'NAV 4');
	// The cursor comes on at the ten thousands of the selected altitude; the outer knob moves on to the thousands
	await u.panel.cursor('L');
	await u.panel.outer('L', 1);
	await setLeftDigit(u, '6');
	// Past the hundreds to the waypoint, which is entered and its waypoint page approved
	await u.panel.outer('L', 2);
	await u.panel.enterIdent('L', 'COVOG');
	await u.panel.ent();
	await u.panel.ent();
	// Past the offset, which stays 00, onto the units of the angle
	await u.panel.outer('L', 2);
	await wait(1000);
	await setLeftDigit(u, '3');
	await u.panel.outer('L', 1);
	await setLeftDigit(u, '0');
	await wait(1000);
	await u.panel.cursor('L');
}
