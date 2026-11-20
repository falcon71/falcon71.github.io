import {defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'D/T 4',
	show: 'right',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await wait(60000);
		await u.panel.selectPage('R', 'D/T 4');
	},
	fields: [
		{id: 'dest', find: {area: 'R', row: 0, from: 0, to: 7}},
		{id: 'zone', find: {re: /[A-Z]{3}$/, area: 'R', row: 0}},
		{id: 'dep', find: {area: 'R', row: 1}},
		{id: 'time', find: {area: 'R', row: 2}},
		{id: 'eta', find: {area: 'R', row: 3}},
		{id: 'flt', find: {area: 'R', row: 4}},
		{id: 'ete', find: {area: 'R', row: 5}},
		{id: 'rname', find: {re: /D\/T 4/, area: 'S'}},
	],
});
