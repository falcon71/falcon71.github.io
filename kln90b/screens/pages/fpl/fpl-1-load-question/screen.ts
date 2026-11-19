import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'The question to copy FPL 0 into an empty flight plan',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 2');
		await u.panel.cursor('L');
		// The cursor comes on the first waypoint position; one step back is the question
		await u.panel.outer('L', -1);
	},
	fields: [
		{id: 'load', find: {re: /LOAD FPL 0\?/, area: 'L'}},
		{id: 'blank', find: {re: / +1: */, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
