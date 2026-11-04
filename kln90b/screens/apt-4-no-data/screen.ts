import {defineScreen, place, pointFrom} from '../../generator/api.ts';
import {createUserAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 4 page of a user airport',
	show: 'right',
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: async u => {
		await createUserAirport(u, 'HOME');
		await u.panel.selectPage('R', 'APT 4');
	},
	fields: [
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'none', find: [{area: 'R', row: 2}, {area: 'R', row: 3}, {area: 'R', row: 4}]},
		{id: 'page', find: {re: /APT 4/, area: 'S'}},
	],
});
