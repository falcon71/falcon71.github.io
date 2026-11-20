import {defineScreen} from '../../../generator/api.ts';
import {cursorToMatch, EN_ROUTE_BOOT, loadVord27} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'MOVE ? on the DME arc waypoint of an approach in FPL 0',
	show: 'left',
	boot: EN_ROUTE_BOOT,
	steps: async u => {
		await loadVord27(u);
		await u.panel.cursor('L');
		await cursorToMatch(u, 'L', /D221M/);
		await u.panel.clr();
	},
	fields: [
		{id: 'from', find: {re: /1:ELN/, area: 'L'}},
		{id: 'header', find: {re: /D27-KYKM/, area: 'L'}},
		{id: 'move', find: {re: /MOVE +\?/, area: 'L'}},
		{id: 'approach', find: [{area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'last', find: {re: /\d+:KYKM/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
