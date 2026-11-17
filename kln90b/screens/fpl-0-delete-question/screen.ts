import {defineScreen} from '../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../shared/fpl-0-olm.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with the question to delete a waypoint',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
		// The cursor starts on the first waypoint; one step of the outer knob moves it to the second
		await u.panel.outer('L', 1);
		await u.panel.clr();
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'question', find: {re: /DEL KOLM {2}\?/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
