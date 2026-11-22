import {defineScreen} from '../../../generator/api.ts';
import {showAirport} from '../../shared/apt-pages.ts';
import {positionRows} from '../../shared/positions.ts';
import {tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'The waypoint page of Tacoma Narrows shown for approval',
	show: 'both',
	boot: tut1Boot,
	steps: async u => {
		await showAirport(u, 'KFHR');
		await u.panel.dct();
		// The first step of the left inner knob drops the offered KFHR and starts a new entry
		await u.panel.enterIdent('L', 'KTIW');
		await u.panel.ent();
	},
	fields: [
		{id: 'dto-title', find: {re: /DIRECT TO:/, area: 'L', row: 0}},
		{id: 'dto-ident', find: {re: /KTIW/, area: 'L', row: 2}},
		{id: 'ident', find: {re: /KTIW/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'pos', find: positionRows('R')},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
