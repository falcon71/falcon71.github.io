import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'The question to delete a numbered flight plan',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.clr();
	},
	fields: [
		{id: 'question', find: {re: /DELETE FPL\?/, area: 'L'}},
		{id: 'plan', find: [{re: /1:KPDX/, area: 'L'}, {re: /2:KOLM/, area: 'L'}, {re: /3:KSEA/, area: 'L'}]},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
