// The state of the unit that the screens of tutorial flight 1 share: Friday Harbor (KFHR) direct to Tacoma Narrows
// (KTIW), with no flight plan. The direct-to is made on the ground at KFHR; the screens en route move the aircraft
// along the direct line at 110 kt, the way the flight goes.
import {
	adjustCourseIndicator, courseDeg, moveAircraft, place, pointFrom, wait, type ScreenDescription,
} from '../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../vendor/kln90b/kln90b/data/PersistentMessages';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

export const KFHR = place('KFHR');
export const KTIW = place('KTIW');

/** The groundspeed of the flight en route. */
export const GROUNDSPEED_KT = 110;

export const tut1Boot: NonNullable<ScreenDescription['boot']> = {position: KFHR};

/** The point on the direct line from KFHR to KTIW, `nm` along it from KFHR. */
export function along(nm: number): {lat: number; lon: number} {
	return pointFrom(KFHR, courseDeg(KFHR, KTIW), nm);
}

/**
 * The direct-to to KTIW made at KFHR, the way the tutorial makes it, and the message ADJ NAV IND CRS TO that follows,
 * answered on the external indicator the way a pilot does.
 */
export async function directToKtiw(u: HeadlessUnit): Promise<void> {
	await u.panel.directTo('KTIW');
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}

/** The aircraft `nm` along the direct line, flying toward KTIW at the groundspeed of the flight. */
export async function flyAlong(u: HeadlessUnit, nm: number): Promise<void> {
	const p = along(nm);
	await moveAircraft(u, p, {groundspeedKt: GROUNDSPEED_KT, trackTrue: courseDeg(p, KTIW)});
}
