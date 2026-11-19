// The states that the screens of the FPL pages share. FPL 0 is the stored flight plan from KPDX over KOLM to KSEA, flown
// 20 NM out of KPDX on the first leg at 120 kt (shared/fpl-0-olm.ts); FPL 1 holds the same route, FPL 12 a longer one and
// FPL 2 is empty.
import {
	adjustCourseIndicator, APR_ARM_SWITCH, facility, panelXml, place, savedFlightplan, wait,
	type ScreenDescription,
} from '../../../generator/api.ts';
import {BOOT as OLM_BOOT, flyAndAdjust} from '../../shared/fpl-0-olm.ts';
import {apt7, bangr9Waypoints} from '../../shared/apt-7-8.ts';
import type {HeadlessUnit} from '../../../../vendor/kln90b/test/harness/boot';

export {flyAndAdjust};

const ROUTE = ['KPDX', 'KOLM', 'KSEA'];
const LONG_ROUTE = ['KPDX', 'KHIO', 'KSLE', 'KCVO', 'KEUG', 'KOLM', 'KTIW', 'KSEA'];

export const BOOT: NonNullable<ScreenDescription['boot']> = {
	...OLM_BOOT,
	storage: {
		...savedFlightplan(0, ROUTE.map(facility)),
		...savedFlightplan(1, ROUTE.map(facility)),
		...savedFlightplan(12, LONG_ROUTE.map(facility)),
	},
};

/** The unit on the ground at KPDX with no flight plan at all. */
export const EMPTY_BOOT: NonNullable<ScreenDescription['boot']> = {
	position: place('KPDX'),
};

/** The unit installed for approaches, on the ground at KSEA with FPL 0 from KSEA to KBFI. */
export const PROCEDURES_BOOT: NonNullable<ScreenDescription['boot']> = {
	position: place('KSEA'),
	panelXml: panelXml(APR_ARM_SWITCH),
	storage: savedFlightplan(0, [facility('KSEA'), facility('KBFI')]),
};

/**
 * Loads the SID BANGR9 of KSEA, the STAR CHINS5 with the transition YKM and the approach RNAV 32L of KBFI into FPL 0, and
 * shows FPL 0 on the left with the cursor off.
 */
export async function loadProcedures(u: HeadlessUnit): Promise<void> {
	await bangr9Waypoints(u);
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
	await apt7(u, 'KBFI');
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', '1 CHINS5');
	await u.panel.ent();
	await u.panel.cursorTo('R', '3 YKM');
	await u.panel.ent();
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
	await u.panel.selectPage('R', 'APT 1');
	await u.panel.selectPage('R', 'APT 8');
	await u.panel.cursor('R');
	await u.panel.ent();
	await u.panel.ent();
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
	// The loaded approach arms and raises PRESS ALT TO SET BARO, which goes once the ALT page has been shown
	await wait(20000);
	await adjustCourseIndicator(u);
	await u.panel.alt();
	await wait(2000);
	await u.panel.alt();
	await wait(1000);
	await u.panel.readMessages();
	await u.panel.selectPage('L', 'FPL 0');
}
