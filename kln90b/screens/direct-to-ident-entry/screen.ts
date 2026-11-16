import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The Direct To page with an identifier waiting for ENT',
	show: 'left',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.dct();
		// The whole ident of an airport, turned with the knobs. The cursor stays on, in the cell after the ident.
		await u.panel.enterIdent('L', 'KBFI');
		// The harness pads the ident with a blank cell; a pilot who stops after the I has the cursor on the I
		await u.panel.outer('L', -1);
	},
	fields: [
		{id: 'title', find: {re: /DIRECT TO:/, area: 'L'}},
		// The cells of the entry
		{id: 'ident', find: {re: /KBFI/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
