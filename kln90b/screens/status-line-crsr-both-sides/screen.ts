import {defineScreen} from '../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../shared/fpl-0-olm.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'The status line with the cursor on both sides',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'KSEA');
		// Back to the first character of the identifier, where the cursor starts
		await u.panel.cursor('R');
		await u.panel.cursor('R');
		await u.panel.cursor('L');
	},
	fields: [
		// The marks of the active leg and the number of the first waypoint
		{id: 'lead', find: {area: 'L', row: 1, from: 0, to: 4}},
		{id: 'wpt', find: {re: /KPDX/, area: 'L'}},
		// The empty row at the end is where the next waypoint goes
		{id: 'rest', find: [{area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'lcrsr', find: {area: 'S', from: 1, to: 5}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rcrsr', find: {area: 'S', from: 18, to: 22}},
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'pos', find: positionRows('R')},
	],
});
