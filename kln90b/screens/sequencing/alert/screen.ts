import {defineScreen} from '../../../generator/api.ts';
import {BOOT, inAlert} from '../olm-turn.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 and NAV 1 during the waypoint alert before KOLM',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await inAlert(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'NAV 1');
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'from', find: {re: /KPDX/, area: 'R', row: 0}},
		{id: 'to', find: {re: /\S?KOLM/, area: 'R', row: 0}},
		{id: 'cdi', find: {area: 'R', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'left-page', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'right-page', find: {re: /NAV 1/, area: 'S'}},
	],
});
