import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'Entering the destination on the direct-to page',
	show: 'left',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.dct();
		// The whole ident of an airport, turned with the knobs. The cursor stays on, in the cell after the ident.
		await u.panel.enterIdent('L', 'KBFI');
	},
	fields: [
		{id: 'title', find: {re: /DIRECT TO:/, area: 'L'}},
		// The five cells of the selector: the ident and the cell the cursor has moved to
		{id: 'ident', find: {re: /KBFI /, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
