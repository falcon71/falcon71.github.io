import {defineScreen} from '../../generator/api.ts';
import {aptBoot, apt7} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 7 of an airport without departures and arrivals',
	show: 'right',
	boot: aptBoot('KTIW'),
	steps: u => apt7(u, 'KTIW'),
	fields: [
		{id: 'ident', find: {re: /KTIW/, area: 'R', row: 0}},
		{id: 'none', find: [
			{re: /NO SID\/STAR/, area: 'R'}, {re: /FOR THIS/, area: 'R'}, {re: /AIRPORT/, area: 'R'}, {re: /IN DATABASE/, area: 'R'},
		]},
		{id: 'page', find: {re: /APT 7/, area: 'S'}},
	],
});
