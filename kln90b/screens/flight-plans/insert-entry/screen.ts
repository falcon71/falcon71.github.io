import {defineScreen} from '../../../generator/api.ts';
import {BOOT_FPL_1} from '../../shared/flight-plans.ts';

defineScreen(import.meta.url, {
	title: 'A new row in front of a waypoint, with an identifier entered',
	show: 'left',
	boot: BOOT_FPL_1,
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'KOLM');
		// One click of the inner knob opens the row, and the ident is entered as everywhere
		await u.panel.inner('L', 1);
		await u.panel.enterIdent('L', 'KBFI');
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'before', find: {re: /1:KPDX/, area: 'L'}},
		{id: 'entry', find: {re: /2:KBFI/, area: 'L'}},
		{id: 'after', find: [{re: /3:KOLM/, area: 'L'}, {re: /4:KSEA/, area: 'L'}]},
		{id: 'blank', find: {re: /5: +/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
