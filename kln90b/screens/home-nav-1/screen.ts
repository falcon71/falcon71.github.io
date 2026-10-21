import {defineScreen} from '../../generator/api.ts';
import {BOOT, flyAndAdjust, showNav1AndApt1} from '../shared/kpdx-ksea.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 and APT 1, the most used pair of pages',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await showNav1AndApt1(u);
	},
	fields: [
		// The idents are free contents, so they stay places; the arrow between them is fixed
		{id: 'from', find: {area: 'L', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {re: /\u203A/, area: 'L', row: 0}},
		{id: 'to', find: {area: 'L', row: 0, from: 6, to: 11}},
		// The course deviation bar is free
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'L'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'L'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'L'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'L'}},
		// With the arrow of the active waypoint, which the unit shows in front of its ident
		{id: 'ident', find: {re: /\u203A\S+/, area: 'R', row: 0}},
		// The name of the airport takes two rows and is free
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		// Latitude and longitude
		{id: 'pos', find: positionRows('R')},
		{id: 'lpage', find: {re: /NAV 1/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rpage', find: {re: /APT 1/, area: 'S'}},
	],
});
