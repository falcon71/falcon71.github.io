import {defineScreen} from '../../../generator/api.ts';
import {positionRows} from '../../shared/positions.ts';
import {climbOut, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'The Direct To page offering YKM after takeoff',
	show: 'both',
	boot: tut2Boot,
	steps: async u => {
		await climbOut(u);
		await u.panel.dct();
	},
	fields: [
		{id: 'dto-title', find: {re: /DIRECT TO:/, area: 'L', row: 0}},
		{id: 'dto-ident', find: {re: /YKM/, area: 'L', row: 2}},
		{id: 'ident', find: {re: /›YKM/, area: 'R', row: 0}},
		{id: 'dme', find: {re: /D/, area: 'R', row: 0}},
		{id: 'name', find: {area: 'R', row: 1}},
		{id: 'class', find: {re: /[A-Z]/, area: 'R', row: 2}},
		{id: 'freq', find: {re: /\d+\.\d\d/, area: 'R', row: 3}},
		{id: 'magvar', find: {re: /\d+°[EW]/, area: 'R', row: 3}},
		{id: 'pos', find: positionRows('R')},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /VOR/, area: 'S'}},
	],
});
