import {defineScreen} from '../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 page',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 1');
	},
	fields: [
		// The idents are free contents, so they stay places; the arrow between them is fixed
		{id: 'from', find: {area: 'L', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {re: /\u203A/, area: 'L', row: 0}},
		{id: 'to', find: {area: 'L', row: 0, from: 6, to: 11}},
		// The course deviation bar is free
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'L'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'L'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'L'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'L'}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
