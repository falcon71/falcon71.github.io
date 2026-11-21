// What the screens of the fuel and air data pages of OTH share: the installations, a light single and a light twin on
// the way from KPDX to KSEA, and the steps that stage remarks for OTH 4.
import type {HeadlessUnit} from '../../../../vendor/kln90b/test/harness/boot';
import {courseDeg, facility, moveAircraft, panelXml, place, pointFrom, savedFlightplan} from '../../../generator/api.ts';
import {showAirport} from '../../shared/apt-pages.ts';

/** A fuel management system that sends the fuel on board and the fuel used, in US gallons */
export const FUEL_SYSTEM = {
	'Input.FuelComputer.IsInterfaced': true,
	'Input.FuelComputer.Unit': 'GAL',
	'Input.FuelComputer.Type': 'Avgas',
} as const;

export const AIR_DATA_SYSTEM = {'Input.Airdata.IsInterfaced': true} as const;

export const FUEL_XML = panelXml(FUEL_SYSTEM);

const KPDX = place('KPDX');
const KSEA = place('KSEA');

/** 15 NM north of KPDX, on the course to KSEA */
export const ON_ROUTE = pointFrom(KPDX, courseDeg(KPDX, KSEA), 15);
export const ROUTE_TRACK = courseDeg(KPDX, KSEA);

/** The flight plan KPDX to KSEA */
export const KPDX_KSEA = savedFlightplan(0, [facility('KPDX'), facility('KSEA')]);

/** A light single in the cruise: 54 gal on board (6 lb per gallon), 10 gal/hr, 22 gal used since start */
export const SINGLE_VARS = [
	{name: 'NUMBER OF ENGINES', unit: 'number', value: 1},
	{name: 'FUEL TOTAL QUANTITY WEIGHT EX1', unit: 'pounds', value: 324},
	{name: 'ENG FUEL FLOW PPH:1', unit: 'pounds per hour', value: 60},
	{name: 'GENERAL ENG FUEL USED SINCE START:1', unit: 'pounds', value: 132},
];

/** A light twin in the cruise: 126 gal on board, 15 and 14 gal/hr, 17 and 16 gal used since start */
export const TWIN_VARS = [
	{name: 'NUMBER OF ENGINES', unit: 'number', value: 2},
	{name: 'FUEL TOTAL QUANTITY WEIGHT EX1', unit: 'pounds', value: 756},
	{name: 'ENG FUEL FLOW PPH:1', unit: 'pounds per hour', value: 90},
	{name: 'ENG FUEL FLOW PPH:2', unit: 'pounds per hour', value: 84},
	{name: 'GENERAL ENG FUEL USED SINCE START:1', unit: 'pounds', value: 102},
	{name: 'GENERAL ENG FUEL USED SINCE START:2', unit: 'pounds', value: 96},
];

/** Flies the aircraft on the course to KSEA at the groundspeed */
export function cruise(u: HeadlessUnit, groundspeedKt: number): Promise<void> {
	return moveAircraft(u, ON_ROUTE, {groundspeedKt, trackTrue: ROUTE_TRACK});
}

/** Writes the first remark line of an airport on APT 5 and leaves the cursor off */
export async function addRemark(u: HeadlessUnit, ident: string, text: string): Promise<void> {
	await showAirport(u, ident);
	await u.panel.selectPage('R', 'APT 5');
	await u.panel.cursor('R');
	await u.panel.outer('R', 4);
	await u.panel.type('R', text);
	await u.panel.ent();
	await u.panel.cursor('R');
}

/** Three airports with remarks and OTH 3 replaced by OTH 4 on the left with the cursor off */
export async function remarksOnOth4(u: HeadlessUnit): Promise<void> {
	await addRemark(u, 'KTIW', 'BRUNCH');
	await addRemark(u, 'KBFI', 'SELFFUEL');
	await addRemark(u, 'KPDX', 'NOISE');
	await u.panel.selectPage('L', 'OTH 4');
}

/** The values an air data system sends in the cruise of a light single */
export const AIR_DATA_VARS = [
	{name: 'AIRSPEED TRUE', unit: 'knots', value: 118},
	{name: 'AIRSPEED MACH', unit: 'mach', value: 0.18},
	{name: 'AMBIENT TEMPERATURE', unit: 'celsius', value: 8},
	{name: 'TOTAL AIR TEMPERATURE', unit: 'celsius', value: 9},
	{name: 'PRESSURE ALTITUDE', unit: 'feet', value: 6240},
];
