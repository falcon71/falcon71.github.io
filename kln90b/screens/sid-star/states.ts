// The states that the screens of SID and STAR procedures share.
import {
	adjustCourseIndicator, APR_ARM_SWITCH, courseDeg, facility, panelXml, place, pointFrom, savedFlightplan, wait,
	type ScreenDescription,
} from '../../generator/api.ts';
import {apt7, bangr9Waypoints} from '../shared/apt-7-8.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

export {PROCEDURES_BOOT} from '../pages/fpl/states.ts';

/**
 * With FPL 0 from KSEA to KBFI (PROCEDURES_BOOT): loads BANGR9 with the transition ARRIE. KSEA is in FPL 0, so the unit
 * loads at once and shows FPL 0 on the left with the cursor off.
 */
export async function loadBangr9(u: HeadlessUnit): Promise<void> {
	await bangr9Waypoints(u);
	await u.panel.ent();
	await wait(1000);
	await adjustCourseIndicator(u);
}

/** BANGR9 loaded, the left cursor on its header. */
export async function cursorOnSidHeader(u: HeadlessUnit): Promise<void> {
	await loadBangr9(u);
	await u.panel.cursor('L');
	await u.panel.cursorTo('L', 'CHANGE SID?');
}

/**
 * En route between YKM and CHINS, 20 NM before CHINS, with FPL 0 from KYKM over YKM and CHINS to KBFI. The leg to CHINS is
 * active, and the course indicator is turned to it.
 */
export const CHINS_BOOT: NonNullable<ScreenDescription['boot']> = {
	position: pointFrom(place('CHINS'), courseDeg(place('CHINS'), place('YKM')), 20),
	panelXml: panelXml(APR_ARM_SWITCH),
	storage: savedFlightplan(0, ['KYKM', 'YKM', 'CHINS', 'KBFI'].map(facility)),
};

/**
 * From CHINS_BOOT: loads CHINS5 of KBFI with the transition YKM, which repeats YKM and CHINS. The unit raises
 * REDUNDANT WPTS IN FPL, which this leaves unread.
 */
export async function loadChins5OverRoute(u: HeadlessUnit): Promise<void> {
	// The active leg raises ADJ NAV IND CRS a few seconds after the start
	await wait(15000);
	await adjustCourseIndicator(u);
	await apt7(u, 'KBFI');
	await u.panel.cursor('R');
	await u.panel.cursorTo('R', '1 CHINS5');
	await u.panel.ent();
	await u.panel.cursorTo('R', '3 YKM');
	await u.panel.ent();
	await u.panel.ent();
	await wait(1000);
}
