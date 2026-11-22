import {defineScreen} from '../../../generator/api.ts';
import {tut2Boot, vnavCountdown} from '../../shared/tut2.ts';

// 10 NM before HUMPP at 10,000 ft and 120 kt: the descent point, about 2 NM before HUMPP, is less than 10 minutes ahead
defineScreen(import.meta.url, {
	title: 'NAV 4 counting down to the descent to COVOG',
	show: 'left',
	boot: tut2Boot,
	steps: vnavCountdown,
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
