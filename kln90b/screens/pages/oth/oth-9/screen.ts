import {defineScreen, HEADING_INPUT, panelXml} from '../../../../generator/api.ts';
import {AIR_DATA_SYSTEM, AIR_DATA_VARS, cruise, FUEL_SYSTEM, ON_ROUTE} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 9, true airspeed and wind',
	show: 'left',
	// With an air data system, a fuel management system and a heading input; heading 350 magnetic
	boot: {
		position: ON_ROUTE,
		panelXml: panelXml({...AIR_DATA_SYSTEM, ...FUEL_SYSTEM, ...HEADING_INPUT}),
		simVars: [...AIR_DATA_VARS, {name: 'PLANE HEADING DEGREES GYRO', unit: 'degrees', value: 350}],
	},
	steps: async u => {
		await cruise(u, 106);
		await u.panel.selectPage('L', 'OTH 9');
	},
	fields: [
		{id: 'title', find: {re: /AIR DATA/, area: 'L', row: 0}},
		{id: 'tas', find: {re: /TAS +\d+kt/, area: 'L', row: 1}},
		{id: 'mach', find: {re: /MACH +\S+/, area: 'L', row: 2}},
		{id: 'component', find: {re: /[HT][DL]WND +\S+/, area: 'L', row: 3}},
		{id: 'direction', find: {re: /WIND +\S+/, area: 'L', row: 4}},
		{id: 'speed', find: {re: /\d+kt/, area: 'L', row: 5}},
		{id: 'page', find: {re: /OTH 9/, area: 'S'}},
	],
});
