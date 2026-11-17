import {defineScreen, place, pointFrom, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The SUP page of a user waypoint made from a reference waypoint',
	show: 'right',
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: async u => {
		await u.panel.selectPage('R', 'SUP  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'HOME');
		await u.panel.cursorTo('R', 'USER POS?');
		await u.panel.ent();
		// The cursor is on the latitude; the reference waypoint is entered and approved first
		await u.panel.cursorTo('R', '_____');
		await u.panel.enterIdent('R', 'SEA');
		await u.panel.ent();
		await u.panel.ent();
		// The cursor is on the radial now
		await u.panel.type('R', '2000');
		await u.panel.ent();
		await u.panel.type('R', '0100');
		await u.panel.ent();
		// The reminder ENT LAT/LON of the first ENT goes after 5 seconds
		await wait(6000);
	},
	fields: [
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'ref', find: {re: /REF:/, area: 'R', row: 1}},
		{id: 'rad', find: {re: /RAD:/, area: 'R', row: 2}},
		{id: 'dis', find: {re: /DIS:/, area: 'R', row: 3}},
		{id: 'lat', find: {re: /[NS] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'lon', find: {re: /[EW] *\d+°[\d.]+'/, area: 'R'}},
		{id: 'page', find: {re: /SUP/, area: 'S'}},
	],
});
