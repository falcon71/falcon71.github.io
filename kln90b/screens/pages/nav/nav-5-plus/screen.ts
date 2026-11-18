import {defineScreen, place, pointFrom} from '../../../../generator/api.ts';
import {positionRows} from '../../../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'NAV 5 page with the VOR page of PAE on the right side',
	show: 'both',
	// 5 NM south of KSEA, with no active waypoint
	boot: {position: pointFrom(place('KSEA'), 180, 5)},
	steps: async u => {
		await u.panel.selectPage('R', 'VOR  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'PAE');
		await u.panel.cursor('R');
		await u.panel.selectPage('L', 'NAV 5');
	},
	fields: [
		// NAV 5 on the left: the orientation and the range, the mark of the VOR of the right page, and the aircraft
		{id: 'orientation', find: {re: /N\^/, area: 'L', row: 5}},
		{id: 'range', find: {re: /\d+$/, area: 'L', row: 5}},
		{id: 'plus', find: {map: 'L', draw: /^icon \+ PAE$/}},
		{id: 'aircraft', find: {map: 'L', draw: /^icon \$ /}},
		// The VOR page of PAE on the right
		{id: 'ident', find: {re: /PAE/, area: 'R', row: 0}},
		{id: 'dme', find: {re: /D/, area: 'R', row: 0}},
		{id: 'name', find: {area: 'R', row: 1}},
		{id: 'class', find: {re: /[A-Z]/, area: 'R', row: 2}},
		{id: 'freq', find: {re: /\d+\.\d\d/, area: 'R', row: 3}},
		{id: 'magvar', find: {re: /\d+°[EW]/, area: 'R', row: 3}},
		{id: 'pos', find: positionRows('R')},
		{id: 'page-left', find: {re: /NAV 5/, area: 'S'}},
		{id: 'page-right', find: {re: /VOR/, area: 'S'}},
	],
});
