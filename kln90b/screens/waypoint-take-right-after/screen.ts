import {defineScreen, place} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'The waypoint field of SET 1 with the airport of the right page taken into it',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'KBFI');
		await u.panel.cursor('R');
		await u.panel.selectPage('L', 'SET 1');
		await u.panel.cursor('L');
		await u.panel.ent();
	},
	fields: [
		{id: 'title', find: {re: /INIT POSN/, area: 'L'}},
		{id: 'lpos', find: [{area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'speed', find: {area: 'L', row: 4}},
		{id: 'confirm', find: {re: /CONFIRM\?/, area: 'L'}},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'wpt', find: {area: 'L', row: 1}},
		{id: 'ident', find: {re: /KBFI/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'pos', find: positionRows('R')},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
