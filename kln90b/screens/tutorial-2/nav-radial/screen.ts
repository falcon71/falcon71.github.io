import {defineScreen} from '../../../generator/api.ts';
import {outboundOnRadial, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'NAV 3 and NAV 1 in OBS mode, 5 NM out on the radial 284 of YKM',
	show: 'both',
	boot: tut2Boot,
	steps: async u => {
		await outboundOnRadial(u, 5);
		await u.panel.selectPage('L', 'NAV 3');
	},
	fields: [
		{id: 'to', find: {area: 'L', row: 0}},
		{id: 'obs', find: {re: /OBS +\S+/, area: 'L', row: 1}},
		{id: 'tk', find: {re: /TK +\S+/, area: 'L', row: 2}},
		{id: 'fly', find: {re: /FLY.+/, area: 'L', row: 3}},
		{id: 'msa', find: {re: /MSA.+/, area: 'L', row: 4}},
		{id: 'esa', find: {re: /ESA.+/, area: 'L', row: 5}},
		// NAV 1 on the right
		{id: 'r-to', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /NAV 3/, area: 'S'}},
		{id: 'mode', find: {re: /enr:\d+/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
