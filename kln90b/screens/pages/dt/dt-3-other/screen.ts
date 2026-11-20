import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'D/T 3 beside a page that is not an FPL page',
	show: 'right',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('R', 'D/T 3');
	},
	fields: [
		{id: 'active', find: {area: 'R', row: 0}},
		{id: 'active-dis', find: {area: 'R', row: 1}},
		{id: 'active-dtk', find: {area: 'R', row: 2}},
		{id: 'next', find: {area: 'R', row: 3}},
		{id: 'next-dis', find: {area: 'R', row: 4}},
		{id: 'next-dtk', find: {area: 'R', row: 5}},
		{id: 'rname', find: {re: /D\/T 3/, area: 'S'}},
	],
});
