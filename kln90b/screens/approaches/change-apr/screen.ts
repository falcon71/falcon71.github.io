import {defineScreen} from '../../../generator/api.ts';
import {BOOT, loadRnav17} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0: CHANGE APR? on the approach header',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await loadRnav17(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'CHANGE APR?');
	},
	fields: [
		{id: 'from', find: {re: /Á 1:KSEA/, area: 'L'}},
		{id: 'change', find: {re: /CHANGE APR\?/, area: 'L'}},
		{id: 'iaf', find: {re: /À 2 CARROà/, area: 'L'}},
		{id: 'if', find: {re: /3 BOSTO/, area: 'L'}},
		{id: 'faf', find: {re: /4 OPOYUá/, area: 'L'}},
		{id: 'last', find: {re: /8:KOLM/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
