import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'Entering the destination on the direct-to page',
	show: 'left',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.dct();
		// The first letter, turned with the left inner knob; the unit completes the ident in the cells after it
		for (let clicks = 0; u.panel.focused('L').text[0] !== 'K'; clicks++) {
			if (clicks > 40) throw new Error('the knob does not reach K');
			await u.panel.inner('L', 1);
		}
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'ident', find: {area: 'L', row: 2}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
