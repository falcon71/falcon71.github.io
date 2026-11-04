import {defineScreen, place, pointFrom} from '../../generator/api.ts';
import {createUserAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 2 page of a user airport',
	show: 'right',
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: async u => {
		await createUserAirport(u, 'HOME');
		await u.panel.selectPage('R', 'APT 2');
		await u.panel.cursor('R');
		await u.panel.cursorTo('R', '_____');
		await u.panel.type('R', '00300');
		await u.panel.ent();
		await u.panel.cursor('R');
	},
	fields: [
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'elevation', find: {re: /ELV +\d+ft/, area: 'R'}},
		{id: 'page', find: {re: /APT 2/, area: 'S'}},
	],
});
