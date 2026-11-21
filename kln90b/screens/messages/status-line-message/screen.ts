import {defineScreen, facility, place, savedFlightplan} from '../../../generator/api.ts';

// A date that does not exist: the 30th of February
defineScreen(import.meta.url, {
	title: 'A status line message',
	show: 'both',
	keepMessages: true,
	boot: {
		position: place('KBFI'),
		storage: {...savedFlightplan(0, [facility('KBFI'), facility('KPDX')]), timezone: 12},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 7');
		await u.panel.selectPage('R', 'NAV 2');
		await u.panel.cursor('L');
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 1);
		await u.panel.inner('L', 29);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 2);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 3);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 7);
		await u.panel.ent();
	},
	fields: [
		{id: 'left', find: [0, 1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row}))},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'message', find: {re: /INVALID ENT/, area: 'S'}},
		{id: 'right', find: [0, 2, 3, 4, 5].map(row => ({area: 'R' as const, row}))},
		{id: 'rname', find: {re: /NAV 2/, area: 'S'}},
	],
});
