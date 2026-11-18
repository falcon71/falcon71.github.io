import {defineScreen} from '../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 and NAV 3 in leg mode',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 1');
		await u.panel.selectPage('R', 'NAV 3');
	},
	fields: [
		{id: 'from', find: {area: 'L', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {re: /\u203A/, area: 'L', row: 0}},
		{id: 'to', find: {area: 'L', row: 0, from: 6, to: 11}},
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'L'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'L'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'L'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'L'}},
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-dtk', find: {re: /(DTK|OBS).+°/, area: 'R', row: 1}},
		{id: 'r-tk', find: {re: /TK +\S+/, area: 'R', row: 2}},
		{id: 'r-fly', find: {re: /FLY.+/, area: 'R', row: 3}},
		{id: 'r-msa', find: {re: /MSA.+/, area: 'R', row: 4}},
		{id: 'r-esa', find: {re: /ESA.+/, area: 'R', row: 5}},
		{id: 'lpage', find: {re: /NAV 1/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 3/, area: 'S'}},
	],
});
