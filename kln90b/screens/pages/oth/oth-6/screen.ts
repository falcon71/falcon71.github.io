import {defineScreen} from '../../../../generator/api.ts';
import {cruise, FUEL_XML, KPDX_KSEA, ON_ROUTE, SINGLE_VARS} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 6, endurance and range',
	show: 'left',
	boot: {
		position: ON_ROUTE, panelXml: FUEL_XML, simVars: SINGLE_VARS,
		storage: {...KPDX_KSEA, othReserve: 5},
	},
	steps: async u => {
		await cruise(u, 110);
		await u.panel.selectPage('L', 'OTH 6');
	},
	fields: [
		{id: 'title', find: {re: /FUEL DATA/, area: 'L', row: 0}},
		{id: 'endurance', find: {re: /ENDUR +\S+/, area: 'L', row: 2}},
		{id: 'range', find: {re: /RANGE +\S+/, area: 'L', row: 3}},
		{id: 'efficiency', find: {re: /NM\/GAL +\S+/, area: 'L', row: 4}},
		{id: 'res', find: {re: /RES: +\d+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /OTH 6/, area: 'S'}},
	],
});
