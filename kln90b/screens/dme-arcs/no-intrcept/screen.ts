import {adjustCourseIndicator, defineScreen, moveAircraft, place, pointFrom, wait} from '../../../generator/api.ts';
import {cursorToMatch, EN_ROUTE_BOOT, loadVord27} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'NO INTRCEPT after MOVE ?',
	show: 'both',
	boot: EN_ROUTE_BOOT,
	steps: async u => {
		await loadVord27(u);
		// A turn to the west-northwest, away from the arc, which lies south of YKM
		await moveAircraft(u, pointFrom(place('ELN'), 182, 11), {groundspeedKt: 140, trackTrue: 300});
		await wait(2000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('R', 'NAV 3');
		await u.panel.cursor('L');
		await cursorToMatch(u, 'L', /D221M/);
		await u.panel.clr();
		await u.panel.ent();
		await wait(300);
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 0}, {area: 'L', row: 1}, {area: 'L', row: 3}, {area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'arc-waypoint', find: {re: /2 D221M./, area: 'L'}},
		{id: 'leg', find: {re: /ELN +.D221M/, area: 'R', row: 0}},
		{id: 'dtk', find: {re: /DTK +\S+/, area: 'R'}},
		{id: 'tk', find: {re: /TK +\d{3}°/, area: 'R', row: 2}},
		{id: 'fly', find: {re: /FLY.*/, area: 'R'}},
		{id: 'msa', find: {re: /MSA +\S+/, area: 'R'}},
		{id: 'esa', find: {re: /ESA +\S+/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'message', find: {re: /NO INTRCEPT/, area: 'S'}},
		{id: 'page', find: {re: /NAV 3/, area: 'S'}},
	],
});
