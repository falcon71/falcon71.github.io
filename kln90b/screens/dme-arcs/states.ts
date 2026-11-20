// The states that the screens of DME arcs share. The SID GROMO4 of KYKM with the transition PAPPS flies a DME arc of
// 9 NM around the VOR YKM, counterclockwise from its 250 radial to its 087 radial, ending at OHKAR. The approach
// VOR/DME 27 of KYKM (VORD 27 on APT 8) with the IAF WIKIK flies an arc of 13 NM around YKM, counterclockwise from its
// 220.9 radial to its 094 radial, ending at FAYCE. The radials are magnetic; YKM has a published magnetic variation of
// 21° east.
import {
	adjustCourseIndicator,
	APR_ARM_SWITCH,
	facility,
	moveAircraft,
	panelXml,
	place,
	pointFrom,
	savedFlightplan,
	showSuperNav5,
	wait,
	type ScreenDescription,
} from '../../generator/api.ts';
import {apt7, apt8} from '../shared/apt-7-8.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';
import {Screen} from '../../../vendor/kln90b/test/harness/render/screen';
import {SuperNav5} from '../../../vendor/kln90b/test/harness/render/superNav5';

/**
 * Turns the outer knob of `side` until the field under the cursor matches `re`, searching clockwise and then, once the
 * cursor stops, counterclockwise. The list entries of APT 7 and APT 8 are numbered, and the number depends on the data.
 */
export async function cursorToMatch(u: HeadlessUnit, side: 'L' | 'R', re: RegExp): Promise<void> {
	let dir: 1 | -1 = 1;
	for (let i = 0; i < 40; i++) {
		const field = u.panel.focused(side);
		if (re.test(field.text.trim())) return;
		const before = Screen.read().dump();
		await u.panel.outer(side, dir);
		if (Screen.read().dump() === before) {
			if (dir === -1) break;
			dir = -1;
		}
	}
	throw new Error(`cursorToMatch: no field ${re} on side ${side}\n${Screen.read().dump()}`);
}

/** The magnetic variation of YKM, which turns its magnetic radials into true ones. */
const YKM_VARIATION = 21;

/** The point on the magnetic `radial` of YKM at `nm`. */
export function fromYkm(radial: number, nm: number): {lat: number; lon: number} {
	return pointFrom(place('YKM'), (radial + YKM_VARIATION) % 360, nm);
}

/** The unit installed for approaches, on the ground at KYKM, FPL 0 empty. */
export const GROUND_BOOT: NonNullable<ScreenDescription['boot']> = {
	position: place('KYKM'),
	panelXml: panelXml(APR_ARM_SWITCH),
};

/**
 * APT 7 of KYKM with GROMO4 and the transition PAPPS chosen: the waypoints of the SID, with the cursor on LOAD IN FPL.
 * The aircraft stands at KYKM, which lies on the 247 radial of YKM, between the radials of the arc, so the DME arc
 * waypoint is the point of the arc nearest the aircraft.
 */
export async function gromo4Waypoints(u: HeadlessUnit): Promise<void> {
	// KYKM has departures only, so APT 7 is a single page
	await apt7(u, 'KYKM');
	await u.panel.cursor('R');
	await cursorToMatch(u, 'R', /^\d+ GROMO4$/);
	await u.panel.ent();
	// Every runway gives the same waypoints, so the unit asks for none and shows the transitions
	await cursorToMatch(u, 'R', /^\d+ PAPPS$/);
	await u.panel.ent();
}

/**
 * GROMO4 loaded into the empty FPL 0 on the ground at KYKM: the unit asks to add KYKM, which ENT approves. FPL 0 then
 * holds KYKM, the DME arc waypoint, OHKAR and PAPPS, and the left side shows it with the cursor off.
 */
export async function loadGromo4(u: HeadlessUnit): Promise<void> {
	await gromo4Waypoints(u);
	await u.panel.ent();
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
}

/**
 * After the takeoff the aircraft flies a heading that meets the arc between its radials: 5 NM out on the 224 radial of
 * YKM, on a track of 204° magnetic, which meets the arc near the 217 radial.
 */
export const VECTOR = {at: () => fromYkm(224, 5), trackTrue: 204 + YKM_VARIATION, groundspeedKt: 140};

/** GROMO4 loaded on the ground, then the aircraft on the heading of VECTOR, its messages answered. */
export async function onVector(u: HeadlessUnit): Promise<void> {
	await loadGromo4(u);
	await moveAircraft(u, VECTOR.at(), {groundspeedKt: VECTOR.groundspeedKt, trackTrue: VECTOR.trackTrue});
	// The unit asks for the course of the leg to the DME arc waypoint once the indicator has been off it for a while
	await wait(15000);
	await adjustCourseIndicator(u);
}

/** Pulls the right inner knob on Super NAV 5 and turns the window to the waypoint `ident`. */
export async function windowTo(u: HeadlessUnit, ident: RegExp): Promise<void> {
	await u.panel.scan();
	// The window starts on the active waypoint; it stops at the first waypoint of FPL 0, so step back there first
	await u.panel.inner('R', -10);
	for (let i = 0; i < 10; i++) {
		const window = SuperNav5.read().directTo;
		if (window !== null && ident.test(window)) return;
		await u.panel.inner('R', 1);
	}
	throw new Error(`windowTo: no ${ident} in the window: ${JSON.stringify(SuperNav5.read())}`);
}

/** The approach VORD 27 of KYKM with the IAF WIKIK: its waypoints on APT 8, with the cursor on LOAD IN FPL. */
export async function vord27Waypoints(u: HeadlessUnit): Promise<void> {
	await apt8(u, 'KYKM');
	await u.panel.cursor('R');
	await cursorToMatch(u, 'R', /^\d+ VORD 27$/);
	await u.panel.ent();
	await cursorToMatch(u, 'R', /^\d+ WIKIK$/);
	await u.panel.ent();
}

/**
 * In flight from ELN to KYKM, 10 NM south of ELN, north of YKM: the aircraft is not abeam the arc of VORD 27, so the DME
 * arc waypoint is the published beginning of the arc.
 */
export const EN_ROUTE_BOOT: NonNullable<ScreenDescription['boot']> = {
	position: pointFrom(place('ELN'), 182, 10),
	panelXml: panelXml(APR_ARM_SWITCH),
	storage: savedFlightplan(0, [facility('ELN'), facility('KYKM')]),
};

/** Flies the aircraft to the boot position on the track of the leg ELN to KYKM, and answers the course message. */
export async function enRoute(u: HeadlessUnit): Promise<void> {
	await moveAircraft(u, pointFrom(place('ELN'), 182, 10), {groundspeedKt: 140, trackTrue: 182});
	await wait(2000);
	await adjustCourseIndicator(u);
}

/**
 * VORD 27 loaded into FPL 0 en route, its messages answered, and FPL 0 on the left with the cursor off. The loaded
 * approach arms and raises PRESS ALT TO SET BARO, which goes once the ALT page has been shown.
 */
export async function loadVord27(u: HeadlessUnit): Promise<void> {
	await enRoute(u);
	await vord27Waypoints(u);
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
	await wait(20000);
	await adjustCourseIndicator(u);
	await u.panel.alt();
	await wait(2000);
	await u.panel.alt();
	await wait(1000);
	await u.panel.readMessages();
	await u.panel.selectPage('L', 'FPL 0');
}

/**
 * On the vector of VECTOR, the DME arc waypoint moved on Super NAV 5: the window turned to D247I, CLR for MOVE ?, ENT,
 * and the knob pushed in. The left outer knob then leaves Super NAV 5 (NAV 4 on the left, NAV 5 on the right), and the
 * course message of the new leg is answered.
 */
export async function movedOnSuperNav5(u: HeadlessUnit): Promise<void> {
	await onVector(u);
	await showSuperNav5(u);
	await windowTo(u, /D247I/);
	await u.panel.clr();
	await u.panel.ent();
	await wait(1000);
	await u.panel.scan();
	await u.panel.inner('L', -1);
	await wait(500);
	await adjustCourseIndicator(u);
}

/**
 * After the move the aircraft flies to the moved waypoint D215I and turns onto the arc. It is staged along the arc, one
 * point after the other, so that the unit sequences D215I as in flight, and ends on the 200 radial of YKM at 9 NM, on
 * the course of the arc there. OHKAR is the active waypoint.
 */
export async function onArc(u: HeadlessUnit): Promise<void> {
	await movedOnSuperNav5(u);
	for (const radial of [213, 210, 206, 202, 200]) {
		// The arc runs counterclockwise, so its course is the radial less 90°
		await moveAircraft(u, fromYkm(radial, 9), {groundspeedKt: 140, trackTrue: radial + YKM_VARIATION - 90});
		await wait(2000);
	}
	await adjustCourseIndicator(u);
}
