import {defineScreen} from '../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../shared/kpdx-ksea.ts';
import {positionRows} from '../../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'The Direct To page offering the active waypoint',
	show: 'both',
	// On the way from KPDX to KSEA, with a page on the right that is no waypoint page
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 1');
		await u.panel.selectPage('R', 'D/T 1');
		// The active waypoint is offered, and its waypoint page is on the right for approval: one ENT makes the direct-to
		await u.panel.dct();
	},
	fields: [
		{id: 'dto-title', find: {re: /DIRECT TO:/, area: 'L', row: 0}},
		{id: 'dto-ident', find: {re: /KSEA/, area: 'L', row: 2}},
		{id: 'ident', find: {re: /›KSEA/, area: 'R', row: 0}},
		// The name of the airport takes two rows and is free
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'pos', find: positionRows('R')},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
