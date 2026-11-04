import {defineScreen} from '../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../shared/kpdx-ksea.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'ACT page of an airport',
	show: 'right',
	// Flying the stored flight plan from KPDX to KSEA, so that KSEA is the active waypoint
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('R', 'ACT');
	},
	fields: [
		{id: 'arrow', find: {re: /›/, area: 'R', row: 0}},
		{id: 'number', find: {re: /\d/, area: 'R', row: 0}},
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		{id: 'type', find: {re: /A$/, area: 'R', row: 0}},
		// The name of the airport takes two rows and is free
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'pos', find: positionRows('R')},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'page', find: {re: /ACT 1/, area: 'S'}},
	],
});
