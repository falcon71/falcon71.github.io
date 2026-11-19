import {defineScreen} from '../../../generator/api.ts';
import {BOOT_FPL_1} from '../../shared/flight-plans.ts';

defineScreen(import.meta.url, {
	title: 'The waypoint of the right page waiting for approval in a flight plan',
	show: 'both',
	boot: BOOT_FPL_1,
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'KBFI');
		await u.panel.cursor('R');
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'KSEA');
		// The row of KSEA is filled, so ENT opens a row in front of it and takes the waypoint of the right page into it
		await u.panel.ent();
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'before', find: [{re: /1:KPDX/, area: 'L'}, {re: /2:KOLM/, area: 'L'}]},
		{id: 'entry', find: {re: /3:KBFI/, area: 'L'}},
		{id: 'after', find: {re: /4:KSEA/, area: 'L'}},
		{id: 'blank', find: {re: /5: +/, area: 'L'}},
		{id: 'ident', find: {re: /KBFI/, area: 'R', row: 0}},
		// The name of the airport takes two rows and is free
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
