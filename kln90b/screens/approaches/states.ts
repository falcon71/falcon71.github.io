// The states that the screens of Non-precision approaches share: the flight from KSEA to KOLM with the RNAV (GPS) RWY 17
// approach of KOLM over the IAF CARRO. The unit is installed for approaches, with a GPS APR switch.
import {
	adjustCourseIndicator, APR_ARM_SWITCH, courseDeg, facility, moveAircraft, panelXml, place, pointFrom, savedFlightplan,
	wait, type ScreenDescription,
} from '../../generator/api.ts';
import {apt8} from '../shared/apt-7-8.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

export const KSEA = place('KSEA');
export const KOLM = place('KOLM');
export const CARRO = place('CARRO');
export const BOSTO = place('BOSTO');
export const OPOYU = place('OPOYU');

/** 4 NM out of KSEA toward CARRO, about 34 NM from KOLM, outside the 30 NM at which the approach arms by itself. */
export const START = pointFrom(KSEA, courseDeg(KSEA, CARRO), 4);

/** En route from KSEA to KOLM, about 34 NM out, with FPL 0 from KSEA to KOLM. */
export const BOOT: NonNullable<ScreenDescription['boot']> = {
	position: START,
	panelXml: panelXml(APR_ARM_SWITCH),
	storage: savedFlightplan(0, [facility('KSEA'), facility('KOLM')]),
};

/** Gives the aircraft its track toward KOLM at 120 kt, and turns the course indicator to the active leg. */
export async function flyStart(u: HeadlessUnit): Promise<void> {
	await moveAircraft(u, START, {groundspeedKt: 120, trackTrue: courseDeg(START, KOLM)});
	await wait(15000);
	await adjustCourseIndicator(u);
}

/** APT 8 of KOLM with the cursor on RNAV 17. */
export async function cursorOnRnav17(u: HeadlessUnit): Promise<void> {
	await apt8(u, 'KOLM');
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', '1 RNAV 17');
}

/** RNAV 17 chosen: its IAFs, with the cursor on CARRO. */
export async function rnav17Iafs(u: HeadlessUnit): Promise<void> {
	await cursorOnRnav17(u);
	await u.panel.ent();
	await u.panel.cursorTo('R', '1 CARRO');
}

/** CARRO chosen: the waypoints of the approach, with the cursor on LOAD IN FPL. */
export async function rnav17Waypoints(u: HeadlessUnit): Promise<void> {
	await rnav17Iafs(u);
	await u.panel.ent();
}

/** From BOOT: loads RNAV 17 over CARRO into FPL 0, which holds KOLM, so the unit loads at once. */
export async function loadRnav17(u: HeadlessUnit): Promise<void> {
	await flyStart(u);
	await rnav17Waypoints(u);
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
}

/** Answers PRESS ALT TO SET BARO the way a pilot does: shows the ALT page and leaves it. */
export async function answerAlt(u: HeadlessUnit): Promise<void> {
	await u.panel.alt();
	await wait(1000);
	await u.panel.alt();
	await wait(1000);
	await u.panel.readMessages();
}

/** On the final course from BOSTO to OPOYU, `nm` NM before OPOYU. */
export function onFinal(nm: number): {lat: number; lon: number} {
	return pointFrom(OPOYU, courseDeg(OPOYU, BOSTO), nm);
}

/**
 * From BOOT: loads the approach, flies into the 30 NM at which it arms, answers PRESS ALT TO SET BARO, and makes a
 * direct-to to the FAF OPOYU from 4 NM before it on the final course, as after vectors to final. The unit is armed,
 * 4 NM before the FAF.
 */
export async function armedOnFinal(u: HeadlessUnit): Promise<void> {
	await armed(u);
	const four = onFinal(4);
	await moveAircraft(u, four, {groundspeedKt: 100, trackTrue: courseDeg(BOSTO, OPOYU)});
	await u.panel.directTo('OPOYU');
	await wait(3000);
	await adjustCourseIndicator(u);
}

/**
 * From BOOT: loads the approach and flies into the 30 NM at which it arms, 7 NM before CARRO on the leg from KSEA, about 25 NM from KOLM, with
 * PRESS ALT TO SET BARO answered and the CDI scale factor down to 1 NM.
 */
export async function armed(u: HeadlessUnit): Promise<void> {
	await loadRnav17(u);
	const at = pointFrom(CARRO, courseDeg(CARRO, KSEA), 7);
	await moveAircraft(u, at, {groundspeedKt: 120, trackTrue: courseDeg(at, CARRO)});
	await wait(35000);
	await adjustCourseIndicator(u);
	await answerAlt(u);
}

/** From armedOnFinal: on to 1.5 NM before the FAF, where the approach becomes active. */
export async function activeOnFinal(u: HeadlessUnit): Promise<void> {
	await armedOnFinal(u);
	const at = onFinal(1.5);
	await moveAircraft(u, at, {groundspeedKt: 100, trackTrue: courseDeg(BOSTO, OPOYU)});
	await wait(5000);
	await adjustCourseIndicator(u);
}

/**
 * From activeOnFinal: past the FAF, 3 NM on toward the MAP RW17, and then over the airport, half a mile past the
 * threshold of runway 17, the MAP.
 */
export async function pastMap(u: HeadlessUnit): Promise<void> {
	await activeOnFinal(u);
	const course = courseDeg(BOSTO, OPOYU);
	const between = pointFrom(OPOYU, course, 3);
	await moveAircraft(u, between, {groundspeedKt: 100, trackTrue: course});
	await wait(5000);
	await adjustCourseIndicator(u);
	await moveAircraft(u, KOLM, {groundspeedKt: 100, trackTrue: course});
	await wait(5000);
	await adjustCourseIndicator(u);
}
