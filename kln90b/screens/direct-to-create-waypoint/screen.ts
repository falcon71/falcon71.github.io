import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The Direct To page with the offer to create a waypoint',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.dct();
		await u.panel.enterIdent('L', 'HOME');
		await u.panel.ent();
	},
	fields: [
		{id: 'title', find: {re: /DIRECT TO:/, area: 'L'}},
		{id: 'left-ident', find: {re: /HOME/, area: 'L'}},
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'offer', find: [{re: /CREATE NEW/, area: 'R'}, {re: /WPT AT:/, area: 'R'}]},
		{id: 'user', find: {re: /USER POS\?/, area: 'R'}},
		{id: 'pres', find: {re: /PRES POS\?/, area: 'R'}},
		{id: 'crsr-left', find: {area: 'S', from: 0, to: 6}},
		{id: 'mode', find: {area: 'S', from: 6, to: 17}},
		{id: 'crsr-right', find: {area: 'S', from: 17, to: 23}},
	],
});
