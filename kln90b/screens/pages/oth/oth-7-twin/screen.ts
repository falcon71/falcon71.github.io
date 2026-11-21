import {defineScreen} from '../../../../generator/api.ts';
import {cruise, FUEL_XML, KPDX_KSEA, ON_ROUTE, TWIN_VARS} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 7, fuel flow of a twin',
	show: 'left',
	boot: {position: ON_ROUTE, panelXml: FUEL_XML, simVars: TWIN_VARS, storage: KPDX_KSEA},
	steps: async u => {
		await cruise(u, 110);
		await u.panel.selectPage('L', 'OTH 7');
	},
	fields: [
		{id: 'title', find: {re: /FUEL FLOW/, area: 'L', row: 0}},
		{id: 'unit', find: {re: /GAL\/HR/, area: 'L', row: 2}},
		{id: 'engines', find: [{re: /ENG 1 +\d+/, area: 'L'}, {re: /ENG 2 +\d+/, area: 'L'}]},
		{id: 'total', find: {re: /(TOTAL +)?\d+ *$/, area: 'L', row: 5}},
		{id: 'page', find: {re: /OTH 7/, area: 'S'}},
	],
});
