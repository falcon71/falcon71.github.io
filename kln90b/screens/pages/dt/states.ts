// The state of the unit that the screens of the D/T pages share: the stored flight plan from KPDX over KOLM and KSEA to
// KGEG, flown 20 NM out of KPDX on the first leg at 120 kt. FPL 1 holds the same route. The distance to KGEG is far
// enough for the time en route to take hours.
import {
	adjustCourseIndicator, courseDeg, facility, moveAircraft, place, pointFrom, savedFlightplan, wait,
	type ScreenDescription,
} from '../../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../../vendor/kln90b/kln90b/data/PersistentMessages';
import type {HeadlessUnit} from '../../../../vendor/kln90b/test/harness/boot';

const KPDX = place('KPDX');
const KOLM = place('KOLM');
const ROUTE = ['KPDX', 'KOLM', 'KSEA', 'KGEG'];

export const POSITION = pointFrom(KPDX, courseDeg(KPDX, KOLM), 20);

export const BOOT: NonNullable<ScreenDescription['boot']> = {
	position: POSITION,
	storage: {
		...savedFlightplan(0, ROUTE.map(facility)),
		...savedFlightplan(1, ROUTE.map(facility)),
	},
};

/** Flies the first leg, and a pilot answers the message of the active leg on the indicator. */
export async function flyAndAdjust(u: HeadlessUnit): Promise<void> {
	await moveAircraft(u, POSITION, {groundspeedKt: 120, trackTrue: courseDeg(POSITION, KOLM)});
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}
