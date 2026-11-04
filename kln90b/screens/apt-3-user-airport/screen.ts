import {defineScreen, place, pointFrom} from '../../generator/api.ts';
import {createUserAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 3 page of a user airport',
	show: 'right',
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: async u => {
		await createUserAirport(u, 'HOME');
		await u.panel.selectPage('R', 'APT 3');
		await u.panel.cursor('R');
		await u.panel.cursorTo('R', '_____');
		await u.panel.type('R', '03200');
		await u.panel.ent();
		await u.panel.inner('R', 2);
		await u.panel.ent();
		await u.panel.cursor('R');
	},
	fields: [
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'title', find: {re: /RWY LEN/, area: 'R'}},
		{id: 'length', find: {re: /\d+'/, area: 'R', row: 3}},
		{id: 'surface', find: {re: /[A-Z]{3}/, area: 'R', row: 3}},
		{id: 'page', find: {re: /APT 3/, area: 'S'}},
	],
});
