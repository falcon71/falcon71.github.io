import {defineScreen, place, pointFrom, savedUserWaypoints} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The unit refuses to create a user waypoint because the user database is full',
	show: 'both',
	boot: {
		position: pointFrom(place('KSEA'), 220, 8),
		// 250 user waypoints far away from the aircraft, in the middle of the continent
		storage: savedUserWaypoints(Array.from({length: 250}, (_, i) => ({
			kind: 'sup' as const, ident: `S${String(i).padStart(3, '0')}`, lat: 40 + i * 0.01, lon: -100,
		}))),
	},
	steps: async u => {
		await u.panel.selectPage('R', 'SUP  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'HOME');
		await u.panel.cursorTo('R', 'PRES POS?');
		await u.panel.ent();
	},
	fields: [
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'offer', find: [{re: /CREATE NEW/, area: 'R'}, {re: /WPT AT:/, area: 'R'}]},
		{id: 'user', find: {re: /USER POS\?/, area: 'R'}},
		{id: 'pres', find: {re: /PRES POS\?/, area: 'R'}},
		{id: 'left-page', find: {re: /NAV 2/, area: 'S'}},
		{id: 'message', find: {re: /USR DB FULL/, area: 'S'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
