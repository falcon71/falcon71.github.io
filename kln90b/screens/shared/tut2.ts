// The state of the unit that the screens of tutorial flight 2 share: on the ground at KYKM, with FPL 0 holding the en
// route waypoints of the flight. The pilot loads the departure, the arrival and the approach on top of it in that order;
// the screens of each step start from the state the steps before it leave.
import {adjustCourseIndicator, facility, place, savedFlightplan, wait, type ScreenDescription} from '../../generator/api.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

/** The en route waypoints of the flight, in the order the pilot enters them into FPL 0. */
export const TUT2_ENROUTE = ['KYKM', 'TITON', 'CADED', 'CHINS', 'KBFI'];

export const tut2Boot: NonNullable<ScreenDescription['boot']> = {
	position: place('KYKM'),
	storage: savedFlightplan(0, TUT2_ENROUTE.map(facility)),
};

// The text of a list entry on APT 7 is its number and its name; the cursor covers the whole entry
const YKM7 = '3 YKM7';
const RW27 = '3 RW27';

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
