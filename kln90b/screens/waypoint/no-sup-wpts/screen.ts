import {defineScreen, place} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The SUP page of a unit without user waypoints',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		// The unit shows the SUP page on the right at its start, and the message belongs to selecting it
		await u.panel.selectPage('R', 'NAV 2');
		await u.panel.selectPage('R', 'SUP  ');
	},
	fields: [
		{id: 'ident', find: {re: /0/, area: 'R', row: 0}},
		{id: 'offer', find: [{re: /CREATE NEW/, area: 'R'}, {re: /WPT AT:/, area: 'R'}]},
		{id: 'user', find: {re: /USER POS\?/, area: 'R'}},
		{id: 'pres', find: {re: /PRES POS\?/, area: 'R'}},
		{id: 'other', find: [0, 2, 3, 4, 5].map(row => ({area: 'L', row}))},
		{id: 'page', find: {re: /NAV 2/, area: 'S'}},
		{id: 'message', find: {re: /NO SUP WPTS/, area: 'S'}},
	],
});
