import {defineScreen} from '../../../generator/api.ts';
import {tut2Boot, vnavActiveAndArmed} from '../../shared/tut2.ts';

// 2 NM before HUMPP at 10,000 ft: the descent point and the point 30 NM from KBFI lie together, so VNAV is active, the
// approach armed, and PRESS ALT TO SET BARO waits unread
defineScreen(import.meta.url, {
	title: 'NAV 4 and NAV 1 as VNAV becomes active and the approach arms',
	show: 'both',
	keepMessages: true,
	boot: tut2Boot,
	steps: vnavActiveAndArmed,
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'ind', find: {re: /IND.\S+ft/, area: 'L', row: 2}},
		{id: 'sel', find: {re: /SEL:\S+ft/, area: 'L', row: 3}},
		{id: 'wpt', find: {area: 'L', row: 4, from: 0, to: 5}},
		{id: 'dist', find: {re: /:-\d+nm/, area: 'L', row: 4}},
		{id: 'angle', find: {re: /ANGLE:\S+°/, area: 'L', row: 5}},
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /NAV 4/, area: 'S'}},
		{id: 'mode', find: {re: /arm-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
