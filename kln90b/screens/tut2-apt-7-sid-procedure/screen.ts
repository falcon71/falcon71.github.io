import {defineScreen} from '../../generator/api.ts';
import {cursorOnYkm7, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Choosing the departure on APT 7',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnYkm7,
	fields: [
		{id: 'ident', find: {re: /KYKM/, area: 'R', row: 0}},
		{id: 'title', find: {re: /SELECT SID/, area: 'R'}},
		// The departures of the airport, each with its number in the list
		{id: 'gromo4', find: {re: /1 GROMO4/, area: 'R'}},
		{id: 'wenas7', find: {re: /2 WENAS7/, area: 'R'}},
		{id: 'ykm7', find: {re: /3 YKM7/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
