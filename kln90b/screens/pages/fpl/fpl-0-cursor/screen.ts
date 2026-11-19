import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with the cursor on',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'wpt', find: {re: /Á +1:KPDX/, area: 'L'}},
		{id: 'rest', find: [{area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
