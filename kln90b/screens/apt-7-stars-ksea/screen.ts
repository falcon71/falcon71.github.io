import {defineScreen} from '../../generator/api.ts';
import {aptBoot, apt7} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 7 with the arrivals of KSEA',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: u => apt7(u, 'KSEA'),
	fields: [
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		{id: 'heading', find: {re: /SELECT STAR/, area: 'R'}},
		{id: 'stars', find: [{re: /1 CHINS5/, area: 'R'}, {re: /2 HAWKZ8/, area: 'R'}, {re: /3 MARNR8/, area: 'R'}]},
		// The last entry, which the bottom row keeps while the list is longer than the page
		{id: 'last', find: {re: /5 SKYKO1/, area: 'R'}},
		{id: 'page', find: {re: /APT\+7/, area: 'S'}},
	],
});
