import {defineScreen} from '../../../../generator/api.ts';
import {EMPTY_BOOT} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'An empty FPL 0',
	show: 'left',
	boot: EMPTY_BOOT,
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 0');
	},
	fields: [
		{id: 'blank', find: {re: / +1: */, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
