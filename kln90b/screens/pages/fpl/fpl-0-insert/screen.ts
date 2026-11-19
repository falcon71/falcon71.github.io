import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with a new waypoint being entered',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
		await u.panel.outer('L', 1);
		// One step of the inner knob opens a new entry in front of KOLM
		await u.panel.inner('L', 1);
	},
	fields: [
		{id: 'first', find: {area: 'L', row: 1}},
		{id: 'entry', find: {re: /2:\S*/, area: 'L'}},
		{id: 'rest', find: [{area: 'L', row: 3}, {area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
