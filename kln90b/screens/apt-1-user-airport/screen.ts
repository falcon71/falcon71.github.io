import {defineScreen, place, pointFrom} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';
import {createUserAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 1 page of a user airport',
	show: 'right',
	// 8 NM southwest of KSEA
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: u => createUserAirport(u, 'HOME'),
	fields: [
		{id: 'ident', find: {re: /HOME/, area: 'R', row: 0}},
		{id: 'pos', find: positionRows('R')},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
