import {defineScreen} from '../../generator/api.ts';
import {BOOT, flyAndAdjust, showNav1AndApt1} from '../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 and APT 1, the most used pair of pages',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await showNav1AndApt1(u);
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
		// With the arrow of the active waypoint, which the unit shows in front of its ident
		{id: 'ident', find: {area: 'R', row: 0}},
		// The name of the airport takes two rows
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		// Latitude and longitude
		{id: 'pos', find: [{area: 'R', row: 4}, {area: 'R', row: 5}]},
		{id: 'lpage', find: {re: /NAV 1/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rpage', find: {re: /APT 1/, area: 'S'}},
	],
});
