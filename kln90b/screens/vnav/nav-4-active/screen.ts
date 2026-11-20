import {defineScreen} from '../../../generator/api.ts';
import {boot, fly, planDescent} from '../vnav-state.ts';

// 12 NM short of KSEA at 5,300 ft the aircraft is on the descent at 3.0°, a little above the path
defineScreen(import.meta.url, {
	title: 'NAV 4 with VNAV active',
	show: 'left',
	boot: boot(12, 5300),
	steps: async u => {
		await fly(u, 12);
		await planDescent(u);
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
