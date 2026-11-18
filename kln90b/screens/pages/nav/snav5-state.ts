// The state the Super NAV 5 screens of the NAV pages share: FPL 0 from KPAE to KSEA, flown at 123 kt on the leg to
// KSEA, 12 NM short of it, so that the layers of the map have waypoints around the aircraft.
import {
	adjustCourseIndicator, courseDeg, facility, moveAircraft, place, pointFrom, savedFlightplan, wait,
	type ScreenDescription,
} from '../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../vendor/kln90b/kln90b/data/PersistentMessages';
import type {HeadlessUnit} from '../../../../vendor/kln90b/test/harness/boot';

const KPAE = place('KPAE');
const KSEA = place('KSEA');
const POSITION = pointFrom(KSEA, courseDeg(KSEA, KPAE), 12);

export const BOOT: NonNullable<ScreenDescription['boot']> = {
	position: POSITION,
	storage: savedFlightplan(0, [facility('KPAE'), facility('KSEA')]),
};

/** Flies the leg, and a pilot answers the message of the active leg on the indicator. */
export async function flyAndAdjust(u: HeadlessUnit): Promise<void> {
	await moveAircraft(u, POSITION, {groundspeedKt: 123, trackTrue: courseDeg(POSITION, KSEA)});
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}
