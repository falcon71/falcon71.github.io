import {defineScreen} from '../../../generator/api.ts';
import {boot, fly, planDescent} from '../vnav-state.ts';

// 30 NM short of KSEA at 7,500 ft the descent at 3.0° starts about 11 NM ahead, about 5 minutes away at 123 kt
defineScreen(import.meta.url, {
	title: 'NAV 4 counting down to the descent',
	show: 'left',
	boot: boot(30, 7500),
	steps: async u => {
		await fly(u, 30);
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
