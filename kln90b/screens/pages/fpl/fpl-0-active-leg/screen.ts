import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 flown on its first leg',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
	},
	fields: [
		{id: 'from', find: {re: /Á +1:KPDX/, area: 'L'}},
		{id: 'to', find: {re: /À +2:KOLM/, area: 'L'}},
		{id: 'wpt', find: {re: / +3:KSEA/, area: 'L'}},
		{id: 'blank', find: {re: / +4: */, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
