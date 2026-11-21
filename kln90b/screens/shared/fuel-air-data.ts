// The state that the screens of OTH 5 with the entry of the fuel on board and of the fuel reserve share: a light single-engine aircraft that flies the stored
// flight plan from KPDX to KSEA, 45 NM short of KSEA, and burns 10 gallons an hour.
import {panelXml, type FieldDef} from '../../generator/api.ts';
import {BOOT as KPDX_KSEA} from './kpdx-ksea.ts';

/** The simulator's values: one engine, 60 pounds an hour are 10 gallons of avgas an hour. */
export const FUEL_SIM_VARS = [
	{name: 'NUMBER OF ENGINES', unit: 'number', value: 1},
	{name: 'ENG FUEL FLOW PPH:1', unit: 'pounds per hour', value: 60},
];

/** A fuel management system in gallons; the aircraft does not send the fuel on board. */
export const FOB_ENTERED = panelXml({
	'Input.FuelComputer.IsInterfaced': true,
	'Input.FuelComputer.Unit': 'GAL',
	'Input.FuelComputer.Type': 'Avgas',
	'Input.FuelComputer.FOBTransmitted': false,
});

/** A fuel management system in gallons; the aircraft sends the fuel on board. */
export const FOB_SENT = panelXml({
	'Input.FuelComputer.IsInterfaced': true,
	'Input.FuelComputer.Unit': 'GAL',
	'Input.FuelComputer.Type': 'Avgas',
});

export const BOOT_ENTERED = {...KPDX_KSEA, panelXml: FOB_ENTERED, simVars: FUEL_SIM_VARS};

export const OTH_5_FIELDS: FieldDef[] = [
	{id: 'destination', find: {re: /^.KSEA/, area: 'L', row: 0}},
	{id: 'unit', find: {re: /GAL/, area: 'L', row: 0}},
	{id: 'fob', find: {re: /FOB.? +\d+/, area: 'L', row: 1}},
	{id: 'reqd', find: {re: /REQD +\d+/, area: 'L', row: 2}},
	{id: 'l-fob', find: {re: /L FOB +\d+/, area: 'L', row: 3}},
	{id: 'res', find: {re: /RES: +\d+/, area: 'L', row: 4}},
	{id: 'extra', find: {re: /EXTRA +\d+/, area: 'L', row: 5}},
	{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
];
