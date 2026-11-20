import {defineScreen} from '../../../generator/api.ts';
import {BOOT, pastMap} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 and NAV 1 past the missed approach point',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await pastMap(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'NAV 1');
	},
	fields: [
		{id: 'faf', find: {re: /Á 4 OPOYUá/, area: 'L'}},
		{id: 'map', find: {re: /À 5 RW17ã/, area: 'L'}},
		{id: 'fence', find: {re: /\*NO WPT SEQ/, area: 'L'}},
		{id: 'missed', find: {re: /6 CORER/, area: 'L'}},
		{id: 'mahp', find: {re: /7 CETRAâ/, area: 'L'}},
		{id: 'last', find: {re: /8:KOLM/, area: 'L'}},
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /apr-leg/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
