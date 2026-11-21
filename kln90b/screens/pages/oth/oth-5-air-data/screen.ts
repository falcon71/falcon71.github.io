import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {AIR_DATA_SYSTEM, AIR_DATA_VARS, cruise, ON_ROUTE} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 5 of an installation with an air data system and no fuel management system',
	show: 'left',
	boot: {position: ON_ROUTE, panelXml: panelXml(AIR_DATA_SYSTEM), simVars: AIR_DATA_VARS},
	steps: async u => {
		await cruise(u, 106);
		await u.panel.selectPage('L', 'OTH 5');
	},
	fields: [
		{id: 'title', find: {re: /AIR DATA/, area: 'L', row: 0}},
		{id: 'tas', find: {re: /TAS +\d+kt/, area: 'L', row: 1}},
		{id: 'mach', find: {re: /MACH +\S+/, area: 'L', row: 2}},
		{id: 'page', find: {re: /OTH 5/, area: 'S'}},
	],
});
