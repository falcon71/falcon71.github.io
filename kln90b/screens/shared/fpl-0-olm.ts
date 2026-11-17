// The state of the unit that the screens of FPL 0 on Controls and display share: the stored flight plan from KPDX over
// KOLM to KSEA, flown 20 NM out of KPDX on the first leg at 120 kt.
import {
	adjustCourseIndicator, courseDeg, facility, moveAircraft, place, pointFrom, savedFlightplan, wait,
	type ScreenDescription,
} from '../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../vendor/kln90b/kln90b/data/PersistentMessages';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

const KPDX = place('KPDX');
const KOLM = place('KOLM');
const POSITION = pointFrom(KPDX, courseDeg(KPDX, KOLM), 20);

export const BOOT: NonNullable<ScreenDescription['boot']> = {
	position: POSITION,
	storage: savedFlightplan(0, [facility('KPDX'), facility('KOLM'), facility('KSEA')]),
};

/** Flies the first leg, and a pilot answers the message of the active leg on the indicator. */
export async function flyAndAdjust(u: HeadlessUnit): Promise<void> {
	await moveAircraft(u, POSITION, {groundspeedKt: 120, trackTrue: courseDeg(POSITION, KOLM)});
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}
