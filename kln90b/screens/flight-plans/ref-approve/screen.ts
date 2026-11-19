import {defineScreen, facility, place, savedFlightplan} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'A reference waypoint inserted into a flight plan, waiting for approval',
	show: 'both',
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KSEA'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'REF');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'OLM');
		await u.panel.ent();
		await u.panel.ent();
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'before', find: {re: /1:KPDX/, area: 'L'}},
		{id: 'entry', find: {re: /2:OLMA/, area: 'L'}},
		{id: 'after', find: {re: /3:KSEA/, area: 'L'}},
		{id: 'blank', find: {re: /4: +/, area: 'L'}},
		{id: 'ident', find: {re: /OLMA/, area: 'R', row: 0}},
		{id: 'ref', find: {re: /REF: +\S+/, area: 'R'}},
		{id: 'rad', find: {re: /RAD: +\S+/, area: 'R'}},
		{id: 'dis', find: {re: /DIS: +\S+/, area: 'R'}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /SUP/, area: 'S'}},
	],
});
