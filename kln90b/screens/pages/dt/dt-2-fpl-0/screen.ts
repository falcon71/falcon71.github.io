import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'D/T 2 beside FPL 0',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'D/T 2');
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'header', find: {re: /DIS/, area: 'R', row: 0}},
		{id: 'zone', find: {re: /[A-Z]{3}$/, area: 'R', row: 0}},
		{id: 'active', find: {area: 'R', row: 2}},
		{id: 'next', find: [{area: 'R', row: 3}, {area: 'R', row: 4}]},
		{id: 'lname', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rname', find: {re: /D\/T 2/, area: 'S'}},
	],
});
