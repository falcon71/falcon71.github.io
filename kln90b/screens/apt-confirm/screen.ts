import {defineScreen, place, pointFrom} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'Waypoint confirmation of an airport',
	show: 'both',
	// 20 NM south of KSEA
	boot: {position: pointFrom(place('KSEA'), 180, 20)},
	steps: async u => {
		// KSEA entered on the Direct To page; the first ENT shows the airport for confirmation, which a second ENT
		// would approve
		await u.panel.dct();
		await u.panel.enterIdent('L', 'KSEA');
		await u.panel.ent();
	},
	fields: [
		{id: 'dto-title', find: {re: /DIRECT TO:/, area: 'L', row: 0}},
		{id: 'dto-ident', find: {re: /KSEA/, area: 'L', row: 2}},
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
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
