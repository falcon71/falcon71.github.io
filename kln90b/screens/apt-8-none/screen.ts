import {defineScreen} from '../../generator/api.ts';
import {aptBoot, apt8} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 8 of an airport without approaches',
	show: 'right',
	boot: aptBoot('2S1'),
	steps: u => apt8(u, '2S1'),
	fields: [
		{id: 'ident', find: {re: /2S1 +IAP/, area: 'R', row: 0}},
		{id: 'none', find: [
			{re: /NO APPROACH/, area: 'R'}, {re: /FOR THIS/, area: 'R'}, {re: /AIRPORT/, area: 'R'}, {re: /IN DATABASE/, area: 'R'},
		]},
		{id: 'page', find: {re: /APT 8/, area: 'S'}},
	],
});
