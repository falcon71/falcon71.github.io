// The state of the unit that the screens of tutorial flight 2 share: on the ground at KYKM, with FPL 0 holding the en
// route waypoints of the flight. The pilot loads the departure, the arrival and the approach on top of it in that order;
// the screens of each step start from the state the steps before it leave.
import {
	adjustCourseIndicator,
	APR_ARM_SWITCH,
	facility,
	panelXml,
	place,
	savedFlightplan,
	wait,
	type ScreenDescription,
} from '../../generator/api.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

/** The en route waypoints of the flight, in the order the pilot enters them into FPL 0. */
export const TUT2_ENROUTE = ['KYKM', 'TITON', 'CADED', 'CHINS', 'KBFI'];

export const tut2Boot: NonNullable<ScreenDescription['boot']> = {
	position: place('KYKM'),
	storage: savedFlightplan(0, TUT2_ENROUTE.map(facility)),
	// The flight ends with an approach, so the unit is installed for approaches, which gives it APT 8
	panelXml: panelXml(APR_ARM_SWITCH),
};

// The text of a list entry on APT 7 is its number and its name; the cursor covers the whole entry
const YKM7 = '3 YKM7';
const RW27 = '3 RW27';
const CHINS5 = '1 CHINS5';
const YKM = '3 YKM';
// The unit lists RW32L after RW32R
const RW32L = '4 RW32L';
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

/** YKM7 chosen: its list of runways, with the cursor on RW27. */
export async function cursorOnRw27(u: HeadlessUnit): Promise<void> {
	await cursorOnYkm7(u);
	await u.panel.ent();
	// The cursor comes on at the first runway
	await u.panel.cursorTo('R', RW27);
}

/**
 * RW27 chosen: YKM7 has no en route transition, so the unit shows the waypoints of the departure at once, with the
 * cursor on LOAD IN FPL.
 */
export async function cursorOnLoadSid(u: HeadlessUnit): Promise<void> {
	await cursorOnRw27(u);
	await u.panel.ent();
}

/**
 * Loads YKM7 with RW27 into FPL 0 and answers the messages of the load: TITON is both a waypoint of the departure and an
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
	// Forward by way of APT 4: the shorter way back passes APT 8, whose list of KBFI the screen cannot be read on (see
	// cursorOnHumpp)
	await u.panel.selectPage('R', 'APT 4');
	await u.panel.selectPage('R', 'APT 7');
	// KBFI has departures and arrivals, so APT 7 has two pages; the first lists the departures
	await u.panel.inner('R', 1);
	// The cursor comes on at the first arrival
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', CHINS5);
}

/** CHINS5 chosen: its list of transitions, with the cursor on YKM. */
export async function cursorOnYkmTransition(u: HeadlessUnit): Promise<void> {
	await cursorOnChins5(u);
	await u.panel.ent();
	// The cursor comes on at the first transition
	await u.panel.cursorTo('R', YKM);
}

/** YKM chosen: the runways of CHINS5, with the cursor on RW32L, the runway of the approach. */
export async function cursorOnRw32l(u: HeadlessUnit): Promise<void> {
	await cursorOnYkmTransition(u);
	await u.panel.ent();
	await u.panel.cursorTo('R', RW32L);
}

/** RW32L chosen: the waypoints of the arrival, with the cursor on LOAD IN FPL. */
export async function cursorOnLoadStar(u: HeadlessUnit): Promise<void> {
	await cursorOnRw32l(u);
	await u.panel.ent();
}

/**
 * Loads CHINS5 with the transition YKM and RW32L into FPL 0 and answers the message of the load: CHINS is both a
 * waypoint of the arrival and an en route waypoint (REDUNDANT WPTS IN FPL). The unit shows FPL 0 on the left then, and
 * on the right the list of arrivals with the cursor off.
 */
export async function loadStar(u: HeadlessUnit): Promise<void> {
	await cursorOnLoadStar(u);
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
}

/**
 * APT 8 of KBFI chosen and its approach with it: the IAFs of the approach, with the cursor on HUMPP.
 *
 * The list of approaches of KBFI cannot be read as a screen: the unit draws its one entry, the RNAV Y approach to 32L,
 * one cell wider than the half page (a kln90b bug), and the harness rejects such a screen. So these steps do not read
 * the screen until the IAF page shows: the inner knob turns from the arrivals of APT 7 to APT 8, and ENT chooses the
 * approach the cursor comes on at, the first and only one in the list.
 */
export async function cursorOnHumpp(u: HeadlessUnit): Promise<void> {
	await loadStar(u);
	await u.panel.inner('R', 1);
	await u.panel.cursor('R');
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
 * on the left then, and on the right APT 8 goes back to its list of approaches with the cursor off; that list cannot be
 * read (see cursorOnHumpp), so the inner knob turns back to the arrivals of APT 7 first.
 */
export async function loadApproach(u: HeadlessUnit): Promise<void> {
	await cursorOnLoadApproach(u);
	await u.panel.ent();
	await wait(1000);
	await u.panel.inner('R', -1);
	await adjustCourseIndicator(u);
}
