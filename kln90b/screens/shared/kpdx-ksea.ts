// The state of the unit that the manual's NAV 1 screens share: flying the stored flight plan from KPDX to KSEA, 45 NM
// short of KSEA, at 123 kt.
import {
	adjustCourseIndicator, courseDeg, facility, moveAircraft, place, pointFrom, savedFlightplan, type ScreenDescription,
} from '../../generator/api.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

const KPDX = place('KPDX');
const KSEA = place('KSEA');
const POSITION = pointFrom(KSEA, courseDeg(KSEA, KPDX), 45);

export const BOOT: NonNullable<ScreenDescription['boot']> = {
	position: POSITION,
	storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')]),
};

/** Flies the leg. The message ADJ NAV IND CRS of the active leg stays pending. */
export async function fly(u: HeadlessUnit): Promise<void> {
	await moveAircraft(u, POSITION, {groundspeedKt: 123, trackTrue: courseDeg(POSITION, KSEA)});
}

/** Flies the leg, and a pilot answers the message of the active leg on the indicator. */
export async function flyAndAdjust(u: HeadlessUnit): Promise<void> {
	await fly(u);
	await adjustCourseIndicator(u);
}

/** NAV 1 on the left and APT 1 with KSEA on the right, the pair of pages a pilot uses most. */
export async function showNav1AndApt1(u: HeadlessUnit): Promise<void> {
	await u.panel.selectPage('L', 'NAV 1');
	await u.panel.selectPage('R', 'APT 1');
	await u.panel.cursor('R');
	await u.panel.enterIdent('R', 'KSEA');
	// Back to the plain page: with the cursor on, the status line would show CRSR
	await u.panel.cursor('R');
}
