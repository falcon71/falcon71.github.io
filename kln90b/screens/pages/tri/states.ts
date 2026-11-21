// What the screens of the TRI pages share: the entries of a trip (TAS, wind, fuel flow and reserve, as a pilot enters
// them on TRI 0 and TRI 1) and the way a waypoint is entered on a TRI page.
import type {HeadlessUnit} from '../../../../vendor/kln90b/test/harness/boot';

/** The trip entries of the screens: 120 kt true airspeed, wind from 270 at 20 kt, a fuel flow of 12 and a reserve of 10 per hour */
export const TRIP_ENTRIES = {
	triTas: 120,
	triWindDirTrue: 270,
	triWindSpeed: 20,
	triFuelFlow: 12,
	triReserve: 10,
};

/** Types an identifier into the field under the cursor and approves the waypoint page, as a pilot does with two ENT presses */
export async function enterWaypoint(u: HeadlessUnit, ident: string): Promise<void> {
	await u.panel.type('L', ident);
	await u.panel.ent();
	await u.panel.ent();
}

/** Enters the two waypoints of TRI 3: the cursor starts on FROM and moves on to TO when FROM is approved */
export async function enterRoute(u: HeadlessUnit, from: string, to: string): Promise<void> {
	await u.panel.cursor('L');
	await enterWaypoint(u, from);
	await enterWaypoint(u, to);
	await u.panel.cursor('L');
}
