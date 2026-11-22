import {defineScreen} from '../../../generator/api.ts';
import {tut2Boot, vnavToCovog} from '../../shared/tut2.ts';

// 12 NM past CHINS at 11,000 ft, the descent at 3.0° to 6,000 ft at COVOG starts about 25 NM ahead, more than 10 minutes
// away at 120 kt
defineScreen(import.meta.url, {
	title: 'NAV 4 with VNAV armed for the descent to COVOG',
	show: 'left',
	boot: tut2Boot,
	steps: vnavToCovog,
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
