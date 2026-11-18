// The state the screens of Sequencing and turn anticipation share: FPL 0 from KPDX over KOLM to KSEA, the aircraft at
// 120 kt on the leg to KOLM, where the route turns right by about 49° onto the leg to KSEA. At 120 kt turn anticipation
// begins about 0.4 NM before KOLM and the waypoint alert about 0.7 NM before that.
import {
	adjustCourseIndicator, courseDeg, facility, moveAircraft, place, pointFrom, savedFlightplan, wait,
	type ScreenDescription,
} from '../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../vendor/kln90b/kln90b/data/PersistentMessages';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

const KOLM = place('KOLM');
const BACK = courseDeg(KOLM, place('KPDX'));
const GROUNDSPEED_KT = 120;

/** On the leg to KOLM, nm before it. */
function beforeKolm(nm: number) {
	return pointFrom(KOLM, BACK, nm);
}

/** Inside the alert, before the turn: 0.8 NM before KOLM. */
export const ALERT_POSITION = beforeKolm(0.8);

export const BOOT: NonNullable<ScreenDescription['boot']> = {
	position: ALERT_POSITION,
	storage: savedFlightplan(0, [facility('KPDX'), facility('KOLM'), facility('KSEA')]),
};

/** Flies the leg to KOLM inside the waypoint alert, and a pilot answers the message of the active leg on the indicator. */
export async function inAlert(u: HeadlessUnit): Promise<void> {
	await moveAircraft(u, ALERT_POSITION, {groundspeedKt: GROUNDSPEED_KT, trackTrue: courseDeg(ALERT_POSITION, KOLM)});
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}

/**
 * From the alert on to 0.2 NM before KOLM, inside the point where turn anticipation begins: the transition has begun, KOLM is still the active
 * waypoint. Its beginning changes the desired track, which raises ADJ NAV IND CRS, and the pilot turns the indicator.
 */
export async function inTurn(u: HeadlessUnit): Promise<void> {
	await inAlert(u);
	const pos = beforeKolm(0.2);
	await moveAircraft(u, pos, {groundspeedKt: GROUNDSPEED_KT, trackTrue: courseDeg(pos, KOLM)});
	await wait(2000);
	await adjustCourseIndicator(u);
}
