import {defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';
defineScreen(import.meta.url, {
	title: 'STA 5 page, calculating',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'STA 5');
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'dest', find: {area: 'L', row: 1, from: 0, to: 11}},
		{id: 'eta', find: {area: 'L', row: 2, from: 0, to: 11}},
		{id: 'zone', find: {area: 'L', row: 3}},
		{id: 'result', find: {area: 'L', row: 4}},
		{id: 'scale', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /STA 5/, area: 'S'}},
	],
});
