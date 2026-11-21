import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {AIR_DATA_SYSTEM, AIR_DATA_VARS, cruise, FUEL_SYSTEM, ON_ROUTE} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 10, temperatures and altitudes',
	show: 'left',
	boot: {
		position: ON_ROUTE,
		panelXml: panelXml({...AIR_DATA_SYSTEM, ...FUEL_SYSTEM}),
		simVars: AIR_DATA_VARS,
	},
	steps: async u => {
		await cruise(u, 106);
		await u.panel.selectPage('L', 'OTH10');
	},
	fields: [
		{id: 'title', find: {re: /AIR DATA/, area: 'L', row: 0}},
		{id: 'sat', find: {re: /SAT +\S+/, area: 'L', row: 2}},
		{id: 'tat', find: {re: /TAT +\S+/, area: 'L', row: 3}},
		{id: 'prs', find: {re: /PRS +\d+ft/, area: 'L', row: 4}},
		{id: 'den', find: {re: /DEN +\d+ft/, area: 'L', row: 5}},
		{id: 'page', find: {re: /OTH10/, area: 'S'}},
	],
});
