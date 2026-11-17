// Steps that the screens of OTH 3 share: the user waypoints a pilot has made, one of them in a flight plan.
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';

/** Makes a user waypoint of the page's waypoint type at the present position, from the offer, and turns the cursor off. */
async function createAtPresentPosition(u: HeadlessUnit, page: string, ident: string): Promise<void> {
	await u.panel.selectPage('R', page);
	await u.panel.cursor('R');
	await u.panel.enterIdent('R', ident);
	await u.panel.cursorTo('R', 'PRES POS?');
	await u.panel.ent();
}

/** Appends a waypoint to a flight plan with its approval, then turns the cursor off. */
async function appendToFlightPlan(u: HeadlessUnit, page: string, ident: string): Promise<void> {
	await u.panel.selectPage('L', page);
	await u.panel.cursor('L');
	for (let i = 0; u.panel.focused('L').text.replace(/[_ ]/g, '') !== ''; i++) {
		if (i > 31) throw new Error('no blank entry in the flight plan');
		await u.panel.outer('L', 1);
	}
	await u.panel.enterIdent('L', ident);
	await u.panel.ent();
	await u.panel.ent();
	await u.panel.cursor('L');
}

/**
 * Four user waypoints, an airport (HOME), an intersection (FIXA) and two supplemental waypoints (CAMP, HOLD), the last
 * one in FPL 3, and OTH 3 on the left with the cursor off.
 */
export async function userWaypointsOnOth3(u: HeadlessUnit): Promise<void> {
	await createAtPresentPosition(u, 'APT 1', 'HOME');
	await createAtPresentPosition(u, 'INT  ', 'FIXA');
	await createAtPresentPosition(u, 'SUP  ', 'CAMP');
	await createAtPresentPosition(u, 'SUP  ', 'HOLD');
	await appendToFlightPlan(u, 'FPL 3', 'HOLD');
	await u.panel.selectPage('L', 'OTH 3');
}
