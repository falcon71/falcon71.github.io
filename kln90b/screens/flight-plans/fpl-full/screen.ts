import {defineScreen, facility, place, savedFlightplan} from '../../../generator/api.ts';
import {FULL_PLAN} from '../../shared/flight-plans.ts';

defineScreen(import.meta.url, {
	title: 'FPL FULL after the approval of a 31st waypoint',
	show: 'both',
	boot: {position: place('KPDX'), storage: savedFlightplan(1, FULL_PLAN.map(facility))},
	steps: async u => {
		await u.panel.selectPage('R', 'NAV 2');
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'KSEA');
		await u.panel.inner('L', 1);
		await u.panel.enterIdent('L', 'KONP');
		await u.panel.ent();
		await u.panel.ent();
	},
	fields: [
		{id: 'wpts', find: [{area: 'L', row: 0}, {area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'last', find: {re: /30:KBDN/, area: 'L'}},
		{id: 'title', find: {re: /PRESENT POS/, area: 'R', row: 0}},
		{id: 'vor', find: {re: /\S{3} +\d{3}°fr/, area: 'R', row: 2}},
		{id: 'dist', find: {re: /\d+\.\dnm/, area: 'R', row: 3}},
		{id: 'lat', find: {area: 'R', row: 4}},
		{id: 'lon', find: {area: 'R', row: 5}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'message', find: {re: /FPL FULL/, area: 'S'}},
		{id: 'page', find: {re: /NAV 2/, area: 'S'}},
	],
});
