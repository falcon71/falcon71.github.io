import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'A numbered flight plan',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 1');
	},
	fields: [
		{id: 'top', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'plan', find: [{re: /1:KPDX/, area: 'L'}, {re: /2:KOLM/, area: 'L'}, {re: /3:KSEA/, area: 'L'}]},
		{id: 'blank', find: {re: / +4: */, area: 'L'}},
		{id: 'page', find: {re: /FPL 1/, area: 'S'}},
	],
});
