import {ICAO, type Facility, type AirportFacility, type FlightPlanLeg} from '@microsoft/msfs-sdk';
import {defineScreen, place, wait} from '../../../generator/api.ts';
import {intersection} from '../../../../vendor/kln90b/test/harness/navdata/builders';
import type {HeadlessUnit} from '../../../../vendor/kln90b/test/harness/boot';

/**
 * The extract has the terminal waypoint NNUTT of KPDX only as the plain fix of the FAA data, without its airport, so that
 * the unit takes it for an en route fix. A screen about the waypoint type identification page makes it the terminal
 * waypoint that it is: the same position with the airport in its ICAO, and the legs of the arrival KRATR3 that fly over it
 * name that one.
 */
function makeTerminal(u: HeadlessUnit): void {
	const plain = u.navdata.all().find(f => f.icaoStruct.ident === 'NNUTT');
	if (plain === undefined) throw new Error('NNUTT is not in the navdata');
	const oldUid = ICAO.getUid(plain.icaoStruct);
	const terminal = intersection('NNUTT', plain.lat, plain.lon, {region: plain.icaoStruct.region, airport: 'KPDX'});
	const apt = u.navdata.all().find(f => f.icaoStruct.ident === 'KPDX' && 'arrivals' in f) as AirportFacility;
	const legsOf = (legs: FlightPlanLeg[]) => legs.forEach(l => {
		if (l.fixIcaoStruct.ident === 'NNUTT') l.fixIcaoStruct = terminal.icaoStruct;
	});
	for (const p of apt.arrivals) {
		legsOf(p.commonLegs);
		p.enRouteTransitions.forEach(t => legsOf(t.legs));
		p.runwayTransitions.forEach(t => legsOf(t.legs));
	}
	// The unit finds a waypoint by its ident, so the plain fix gives way to the terminal waypoint instead of standing beside it
	const index = (u.navdata as unknown as {byUid: Map<string, Facility>}).byUid;
	index.delete(oldUid);
	(plain as {icaoStruct: unknown}).icaoStruct = terminal.icaoStruct;
	index.set(ICAO.getUid(terminal.icaoStruct), plain);
}

defineScreen(import.meta.url, {
	title: 'The waypoint type identification page',
	show: 'both',
	boot: {position: place('KPDX')},
	steps: async u => {
		makeTerminal(u);
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.cursor('L');
		await u.panel.enterIdent('L', 'NNUTT');
		await u.panel.ent();
		await wait(500);
		await u.panel.ent();
		// The unit loads the airport of the waypoint to see whether a procedure flies over it
		await wait(12000);
	},
	fields: [
		{id: 'ident', find: {re: /NNUTT/, area: 'L', row: 0}},
		{id: 'title', find: {re: /TYPE WPT/, area: 'L'}},
		{id: 'en-route', find: {re: /1 EN ROUTE\?/, area: 'L'}},
		{id: 'sid-star', find: {re: /2 SID\/STAR\?/, area: 'L'}},
		{id: 'right-ident', find: {re: /NNUTT/, area: 'R', row: 0}},
		{id: 'ref', find: {area: 'R', row: 1}},
		{id: 'rad', find: {area: 'R', row: 2}},
		{id: 'dis', find: {area: 'R', row: 3}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /INT/, area: 'S'}},
	],
});
