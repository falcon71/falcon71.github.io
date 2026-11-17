import {defineScreen} from '../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../shared/fpl-0-olm.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 on the left and D/T 1 on the right',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'D/T 1');
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'header', find: {re: /DIS +ETE/, area: 'R'}},
		{id: 'active', find: {area: 'R', row: 2}},
		{id: 'next', find: {area: 'R', row: 3}},
		{id: 'lname', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rname', find: {re: /D\/T 1/, area: 'S'}},
	],
});
