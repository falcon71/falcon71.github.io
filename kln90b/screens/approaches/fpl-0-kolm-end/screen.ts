import {defineScreen} from '../../../generator/api.ts';
import {BOOT, loadRnav17} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 at the end of the approach to KOLM',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await loadRnav17(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
		await u.panel.outer('L', 7);
	},
	fields: [
		{id: 'faf', find: {re: /4 OPOYUá/, area: 'L'}},
		{id: 'map', find: {re: /5 RW17ã/, area: 'L'}},
		{id: 'fence', find: {re: /\*NO WPT SEQ/, area: 'L'}},
		{id: 'missed', find: {re: /6 CORER/, area: 'L'}},
		{id: 'mahp', find: {re: /CETRAâ/, area: 'L'}},
		{id: 'last', find: {re: /8:KOLM/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
