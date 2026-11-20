import {defineScreen} from '../../../generator/api.ts';
import {BOOT, loadRnav17} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'INVALID DEL on a waypoint of the approach',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await loadRnav17(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'NAV 1');
		await u.panel.cursor('L');
		await u.panel.outer('L', 3);
		await u.panel.clr();
	},
	fields: [
		{id: 'from', find: {re: /Á 1:KSEA/, area: 'L'}},
		{id: 'header', find: {re: /ÂR17-KOLM/, area: 'L'}},
		{id: 'iaf', find: {re: /À 2 CARROà/, area: 'L'}},
		{id: 'bosto', find: {re: /BOSTO/, area: 'L'}},
		{id: 'faf', find: {re: /4 OPOYUá/, area: 'L'}},
		{id: 'last', find: {re: /8:KOLM/, area: 'L'}},
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'message', find: {re: /INVALID DEL/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
