import {defineScreen, place, pointFrom} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The Duplicate Waypoint page',
	show: 'left',
	// 5 NM south of KSEA, near the VORTAC SEA
	boot: {position: pointFrom(place('KSEA'), 180, 5)},
	steps: async u => {
		// A user waypoint SEA at the present position, a supplemental waypoint next to the VORTAC of the same ident
		await u.panel.selectPage('R', 'SUP  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'SEA');
		await u.panel.cursorTo('R', 'PRES POS?');
		await u.panel.ent();
		// SEA entered on the Direct To page: two waypoints have that identifier
		await u.panel.dct();
		await u.panel.enterIdent('L', 'SEA');
		await u.panel.ent();
	},
	fields: [
		{id: 'ident', find: {re: /SEA/, area: 'L', row: 0}},
		{id: 'count', find: {re: /\d+/, area: 'L', row: 0}},
		{id: 'header', find: {re: /TYPE AREA/, area: 'L'}},
		{id: 'first', find: {re: /1 SUP/, area: 'L'}},
		{id: 'second', find: {re: /2 VOR USA\?/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
