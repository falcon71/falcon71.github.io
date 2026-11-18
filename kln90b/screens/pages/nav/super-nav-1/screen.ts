import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'Super NAV 1',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 1');
		await u.panel.selectPage('R', 'NAV 1');
	},
	fields: [
		{id: 'from', find: {area: 'F', row: 0, from: 6, to: 11}},
		{id: 'arrow', find: {re: /›/, area: 'F', row: 0}},
		{id: 'to', find: {area: 'F', row: 0, from: 12, to: 18}},
		{id: 'cdi', find: {area: 'F', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'F'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'F'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'F'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'F'}},
		{id: 'lpage', find: {area: 'S', from: 0, to: 5}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'prompt', find: {area: 'S', from: 14, to: 17}},
		{id: 'rpage', find: {area: 'S', from: 18, to: 23}},
	],
});
