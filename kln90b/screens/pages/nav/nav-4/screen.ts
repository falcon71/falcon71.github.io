import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 4 page with an altitude input',
	show: 'left',
	boot: {...BOOT, altitudeFt: 7500},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 4');
		// The selected altitude 3,000 ft and a descent that ends 5 NM before the waypoint
		await u.panel.cursor('L');
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 3);
		await u.panel.outer('L', 3);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 5);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'ind', find: {re: /IND.\S+ft/, area: 'L', row: 2}},
		{id: 'sel', find: {re: /SEL:\S+ft/, area: 'L', row: 3}},
		{id: 'wpt', find: {area: 'L', row: 4, from: 0, to: 5}},
		{id: 'dist', find: {re: /:-\d+nm/, area: 'L', row: 4}},
		{id: 'angle', find: {re: /ANGLE:\S+°/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 4/, area: 'S'}},
	],
});
