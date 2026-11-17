import {defineScreen, place} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'NO SUCH WPT on SET 1',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 1');
		await u.panel.cursor('L');
		// An identifier that no waypoint has; SET 1 offers no user waypoint
		await u.panel.enterIdent('L', 'HOME');
		await u.panel.ent();
		// The right side shows NAV 2, so that no waypoint page is on offer there
		await u.panel.selectPage('R', 'NAV 2');
	},
	fields: [
		{id: 'title', find: {re: /INIT POSN/, area: 'L'}},
		{id: 'wpt', find: {re: /WPT: HOME/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'other', find: [0, 2, 3, 4, 5].map(row => ({area: 'R', row}))},
		{id: 'page', find: {re: /NAV 2/, area: 'S'}},
		{id: 'message', find: {re: /NO SUCH WPT/, area: 'S'}},
	],
});
