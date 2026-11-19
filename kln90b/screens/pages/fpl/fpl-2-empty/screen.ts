import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'An empty numbered flight plan',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 2');
	},
	fields: [
		{id: 'load', find: {re: /LOAD FPL 0\?/, area: 'L'}},
		{id: 'blank', find: {re: / +1: */, area: 'L'}},
		{id: 'page', find: {re: /FPL 2/, area: 'S'}},
	],
});
