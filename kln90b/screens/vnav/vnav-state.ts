// The state the screens of VNAV share: the stored flight plan from KPDX to KSEA, flown at 123 kt toward KSEA, with a
// descent planned on NAV 4 to 3,000 ft 5 NM before KSEA.
import {
	adjustCourseIndicator, courseDeg, facility, moveAircraft, place, pointFrom, savedFlightplan, wait,
	type ScreenDescription,
} from '../../generator/api.ts';
import {COURSE_MESSAGE_DELAY} from '../../../vendor/kln90b/kln90b/data/PersistentMessages';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

export const KPDX = place('KPDX');
export const KSEA = place('KSEA');

/** The point on the leg from KPDX, `nm` NM short of KSEA */
export function short(nm: number): {lat: number; lon: number} {
	return pointFrom(KSEA, courseDeg(KSEA, KPDX), nm);
}

/** On the leg to KSEA, `nm` NM short of it, at the given altitude */
export function boot(nm: number, altitudeFt = 7500): NonNullable<ScreenDescription['boot']> {
	return {
		position: short(nm),
		altitudeFt,
		storage: savedFlightplan(0, [facility('KPDX'), facility('KSEA')]),
	};
}

/** Flies the leg at 123 kt, and a pilot answers the message of the active leg on the indicator. */
export async function fly(u: HeadlessUnit, nm: number): Promise<void> {
	const at = short(nm);
	await moveAircraft(u, at, {groundspeedKt: 123, trackTrue: courseDeg(at, KSEA)});
	await wait(COURSE_MESSAGE_DELAY + 1000);
	await adjustCourseIndicator(u);
}

/** Turns the inner knob until the digit under the cursor of a side reads `digit` */
async function setDigit(u: HeadlessUnit, side: 'L' | 'R', digit: string): Promise<void> {
	for (let i = 0; i < 10 && u.panel.focused(side).text !== digit; i++) {
		await u.panel.inner(side, 1);
	}
	if (u.panel.focused(side).text !== digit) {
		throw new Error(`setDigit: the cursor shows ${u.panel.focused(side).text}, not ${digit}`);
	}
}

/**
 * NAV 4 on the left: the selected altitude 3,000 ft and the offset 5 NM, then the cursor on the angle, which starts VNAV
 * at the angle shown, and the angle 3.0 entered, which starts it again at that angle. The cursor stays on the angle.
 */
export async function planDescent(u: HeadlessUnit): Promise<void> {
	await u.panel.selectPage('L', 'NAV 4');
	await u.panel.cursor('L');
	// The thousands of the selected altitude
	await u.panel.outer('L', 1);
	await setDigit(u, 'L', '3');
	// The units of the offset
	await u.panel.outer('L', 4);
	await setDigit(u, 'L', '5');
	// The units and the tenths of the angle
	await u.panel.outer('L', 1);
	await wait(1000);
	await setDigit(u, 'L', '3');
	await u.panel.outer('L', 1);
	await setDigit(u, 'L', '0');
	await wait(1000);
}
