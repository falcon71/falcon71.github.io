import {defineScreen} from '../../../../generator/api.ts';
import {cruise, FUEL_XML, KPDX_KSEA, ON_ROUTE, SINGLE_VARS} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 8, fuel used of a single',
	show: 'left',
	boot: {position: ON_ROUTE, panelXml: FUEL_XML, simVars: SINGLE_VARS, storage: KPDX_KSEA},
	steps: async u => {
		await cruise(u, 110);
		await u.panel.selectPage('L', 'OTH 8');
	},
	fields: [
		{id: 'title', find: {re: /FUEL USED/, area: 'L', row: 0}},
		{id: 'unit', find: {re: /GAL/, area: 'L', row: 2}},
		{id: 'total', find: {re: /(TOTAL +)?\d+ *$/, area: 'L', row: 5}},
		{id: 'page', find: {re: /OTH 8/, area: 'S'}},
	],
});
