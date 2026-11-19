import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'A numbered flight plan of more waypoints than the page shows',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 12');
	},
	fields: [
		{id: 'top', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'last', find: {re: / +8:KSEA/, area: 'L'}},
		{id: 'page', find: {re: /FPL ?12/, area: 'S'}},
	],
});
