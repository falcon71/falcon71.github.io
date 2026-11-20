import {defineScreen, facility, place, savedFlightplan} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The REF page with the cursor on the entry, beside a numbered flight plan',
	show: 'both',
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KSEA'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'REF');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'OLM');
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'first', find: {re: /1:KPDX/, area: 'L'}},
		{id: 'second', find: {re: /2:KSEA/, area: 'L'}},
		{id: 'blank', find: {re: /3: +/, area: 'L'}},
		{id: 'prompt', find: {re: /ENTER REF/, area: 'R'}},
		{id: 'entry', find: {re: /WPT: +\S+/, area: 'R'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'left-page', find: {re: /FPL 1/, area: 'S'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
	],
});
