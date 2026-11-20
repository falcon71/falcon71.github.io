import {defineScreen, facility, savedFlightplan} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'D/T 1 beside an FPL 0 of more waypoints than the page shows',
	show: 'both',
	// The same position and flight, with a longer FPL 0
	boot: {...BOOT, storage: savedFlightplan(0, ['KPDX', 'KOLM', 'KHIO', 'KSLE', 'KCVO', 'KEUG', 'KTIW', 'KSEA'].map(facility))},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'D/T 1');
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 0}, {area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'last', find: {re: / +8:KSEA/, area: 'L'}},
		{id: 'header', find: {re: /DIS +ETE/, area: 'R'}},
		{id: 'active', find: {area: 'R', row: 1}},
		{id: 'next', find: [{area: 'R', row: 2}, {area: 'R', row: 3}, {area: 'R', row: 4}]},
		{id: 'total', find: {area: 'R', row: 5}},
		{id: 'lname', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rname', find: {re: /D\/T 1/, area: 'S'}},
	],
});
