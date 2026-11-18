import {defineScreen} from '../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../shared/fpl-0-olm.ts';
import {positionRows} from '../../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'The Direct To page in OBS mode, set to ACTIVATE',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		// The cursor on a waypoint of FPL 0 that is not the active one: the Direct To page offers it
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'KSEA');
		await u.panel.dct();
		// In OBS mode the button toggles the title between DIRECT TO: and ACTIVATE:
		await u.panel.dct();
	},
	fields: [
		{id: 'title', find: {re: /ACTIVATE:/, area: 'L', row: 0}},
		{id: 'dto-ident', find: {re: /KSEA/, area: 'L', row: 2}},
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		// The name of the airport takes two rows and is free
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'pos', find: positionRows('R')},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr:\d+/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
