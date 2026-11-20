import {defineScreen, facility, place, savedFlightplan, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'INVALID REF: no leg of the flight plan has a line at right angles to the entered waypoint',
	show: 'both',
	// Eugene lies south of Portland, so the line at right angles meets the extension of the leg behind its start
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KSEA'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'REF');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'EUG');
		await u.panel.ent();
		await u.panel.ent();
		await wait(1000);
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'first', find: {re: /1:KPDX/, area: 'L'}},
		{id: 'second', find: {re: /2:KSEA/, area: 'L'}},
		{id: 'blank', find: {re: /3: +/, area: 'L'}},
		{id: 'prompt', find: {re: /ENTER REF/, area: 'R'}},
		{id: 'entry', find: {re: /WPT: +\S+/, area: 'R'}},
		{id: 'left-page', find: {re: /FPL 1/, area: 'S'}},
		{id: 'message', find: {re: /INVALID REF/, area: 'S'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
