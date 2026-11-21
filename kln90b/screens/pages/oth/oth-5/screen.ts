import {defineScreen} from '../../../../generator/api.ts';
import {cruise, FUEL_XML, KPDX_KSEA, ON_ROUTE, SINGLE_VARS} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 5, fuel on board and fuel required',
	show: 'left',
	// A single on the way from KPDX to KSEA, the fuel on board sent by the aircraft, 5 gal of reserve
	boot: {
		position: ON_ROUTE, panelXml: FUEL_XML, simVars: SINGLE_VARS,
		storage: {...KPDX_KSEA, othReserve: 5},
	},
	steps: async u => {
		await cruise(u, 110);
		await u.panel.selectPage('L', 'OTH 5');
	},
	fields: [
		{id: 'destination', find: {re: /^.KSEA/, area: 'L', row: 0}},
		{id: 'unit', find: {re: /GAL/, area: 'L', row: 0}},
		{id: 'fob', find: {re: /FOB +\d+/, area: 'L', row: 1}},
		{id: 'reqd', find: {re: /REQD +\d+/, area: 'L', row: 2}},
		{id: 'l-fob', find: {re: /L FOB +\d+/, area: 'L', row: 3}},
		{id: 'res', find: {re: /RES: +\d+/, area: 'L', row: 4}},
		{id: 'extra', find: {re: /EXTRA +\d+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /OTH 5/, area: 'S'}},
	],
});
