// The states that the screens of APT 7 and APT 8 in the page reference share: the unit on the ground at an airport,
// installed for approaches (which gives it APT 8), with an empty FPL 0. Each function brings the right side to one step
// of the selection of a departure, an arrival or an approach.
import {
	adjustCourseIndicator,
	APR_ARM_SWITCH,
	panelXml,
	place,
	wait,
	type ScreenDescription,
} from '../../generator/api.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

/** On the ground at `ident`, installed for approaches, FPL 0 empty. */
export function aptBoot(ident: string): NonNullable<ScreenDescription['boot']> {
	return {
		position: place(ident),
		panelXml: panelXml(APR_ARM_SWITCH),
	};
}

/** Enters `ident` on APT 1, which all APT pages share, and leaves the right cursor off. */
export async function airportOnApt1(u: HeadlessUnit, ident: string): Promise<void> {
	await u.panel.selectPage('R', 'APT 1');
	await u.panel.cursor('R');
	await u.panel.enterIdent('R', ident);
	await u.panel.cursor('R');
}

/**
 * APT 7 of `ident`. From APT 1 the right inner knob turns back by way of APT 8 and comes to the last APT 7 page, the
 * arrivals of an airport that has departures and arrivals; `sids` turns one step further back to the departures.
 */
export async function apt7(u: HeadlessUnit, ident: string, o: {sids?: boolean} = {}): Promise<void> {
	await airportOnApt1(u, ident);
	await u.panel.selectPage('R', 'APT 7');
	if (o.sids) await u.panel.inner('R', -1);
}

/** APT 7 of KSEA with the departures and the cursor on the first, BANGR9. */
export async function cursorOnBangr9(u: HeadlessUnit): Promise<void> {
	await apt7(u, 'KSEA', {sids: true});
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', '1 BANGR9');
}

/** BANGR9 chosen: its list of runways, with the cursor on RW34C. */
export async function bangr9Runways(u: HeadlessUnit): Promise<void> {
	await cursorOnBangr9(u);
	await u.panel.ent();
	await u.panel.cursorTo('R', '4 RW34C');
}

/** RW34C chosen: the transitions of BANGR9, with the cursor on ARRIE. */
export async function bangr9Transitions(u: HeadlessUnit): Promise<void> {
	await bangr9Runways(u);
	await u.panel.ent();
	await u.panel.cursorTo('R', '1 ARRIE');
}

/** ARRIE chosen: the waypoints of BANGR9, with the cursor on LOAD IN FPL. */
export async function bangr9Waypoints(u: HeadlessUnit): Promise<void> {
	await bangr9Transitions(u);
	await u.panel.ent();
}

/** LOAD IN FPL with KSEA not in FPL 0: the question whether to add the airport. */
export async function bangr9AddQuestion(u: HeadlessUnit): Promise<void> {
	await bangr9Waypoints(u);
	await u.panel.ent();
}

/**
 * Loads BANGR9 into the empty FPL 0, then selects it a second time up to LOAD IN FPL and presses ENT: FPL 0 holds a
 * departure already, so the unit asks whether to replace it.
 */
export async function bangr9ReplaceQuestion(u: HeadlessUnit): Promise<void> {
	await bangr9AddQuestion(u);
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
	// After the load the departures are shown again with the cursor off
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', '1 BANGR9');
	await u.panel.ent();
	await u.panel.cursorTo('R', '4 RW34C');
	await u.panel.ent();
	await u.panel.cursorTo('R', '1 ARRIE');
	await u.panel.ent();
	await u.panel.ent();
}

/** APT 8 of `ident`, cursor off. */
export async function apt8(u: HeadlessUnit, ident: string): Promise<void> {
	await airportOnApt1(u, ident);
	await u.panel.selectPage('R', 'APT 8');
}

/** The RNAV approach to 34L at KSEA chosen: its IAFs, with the cursor on SONDR. */
export async function rnav34lIafs(u: HeadlessUnit): Promise<void> {
	await apt8(u, 'KSEA');
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', '5 RNAV 34L');
	await u.panel.ent();
	await u.panel.cursorTo('R', '2 SONDR');
}

/** SONDR chosen: the waypoints of the approach, with the cursor on LOAD IN FPL. */
export async function rnav34lWaypoints(u: HeadlessUnit): Promise<void> {
	await rnav34lIafs(u);
	await u.panel.ent();
}

/**
 * The waypoints of the approach scrolled to their end: the outer knob takes the cursor up to RW34L, which scrolls the
 * list, and back down to LOAD IN FPL, where the list stays as it is.
 */
export async function rnav34lWaypointsScrolled(u: HeadlessUnit): Promise<void> {
	await rnav34lWaypoints(u);
	await u.panel.outer('R', -2);
	await u.panel.outer('R', 2);
}
