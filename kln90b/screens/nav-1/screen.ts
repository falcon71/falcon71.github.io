import {defineScreen} from '../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 page',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 1');
	},
	fields: [
		{id: 'from', find: {area: 'L', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {area: 'L', row: 0, from: 5, to: 6}},
		{id: 'to', find: {area: 'L', row: 0, from: 6, to: 11}},
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'dis', find: {area: 'L', row: 2}},
		{id: 'gs', find: {area: 'L', row: 3}},
		{id: 'ete', find: {area: 'L', row: 4}},
		{id: 'brg', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
