import {defineScreen} from '../../../generator/api.ts';
import {showAirport} from '../../shared/apt-pages.ts';
import {positionRows} from '../../shared/positions.ts';
import {tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'The Direct To page offering Friday Harbor',
	show: 'both',
	boot: tut1Boot,
	steps: async u => {
		// KFHR is on the right APT 1, so the Direct To page offers it
		await showAirport(u, 'KFHR');
		await u.panel.dct();
	},
	fields: [
		{id: 'dto-title', find: {re: /DIRECT TO:/, area: 'L', row: 0}},
		{id: 'dto-ident', find: {re: /KFHR/, area: 'L', row: 2}},
		{id: 'ident', find: {re: /KFHR/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'pos', find: positionRows('R')},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
