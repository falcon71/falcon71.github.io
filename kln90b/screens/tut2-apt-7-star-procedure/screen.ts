import {defineScreen} from '../../generator/api.ts';
import {cursorOnChins5, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Choosing the arrival on APT 7',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnChins5,
	fields: [
		{id: 'ident', find: {re: /KBFI/, area: 'R', row: 0}},
		{id: 'title', find: {re: /SELECT STAR/, area: 'R'}},
		// The arrivals of the airport, each with its number in the list
		{id: 'chins5', find: {re: /1 CHINS5/, area: 'R'}},
		{id: 'olm2', find: {re: /2 OLM2/, area: 'R'}},
		{id: 'skyko1', find: {re: /3 SKYKO1/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
