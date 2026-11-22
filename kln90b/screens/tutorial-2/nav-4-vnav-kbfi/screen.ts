import {defineScreen} from '../../../generator/api.ts';
import {tut2NoApproachBoot, vnavToKbfi} from '../../shared/tut2.ts';

// A unit without approaches, 12 NM past CHINS at 10,000 ft: VNAV planned at 3.0° to 700 ft 3 NM before KBFI
defineScreen(import.meta.url, {
	title: 'NAV 4 with VNAV armed for the descent toward KBFI',
	show: 'left',
	boot: tut2NoApproachBoot,
	steps: vnavToKbfi,
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
