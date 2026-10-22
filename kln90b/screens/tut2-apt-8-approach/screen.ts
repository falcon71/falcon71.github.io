import {defineScreen} from '../../generator/api.ts';
import {cursorOnRnav32l, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Choosing the approach on APT 8',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnRnav32l,
	fields: [
		{id: 'ident', find: {re: /KBFI/, area: 'R', row: 0}},
		{id: 'title', find: {re: /IAP/, area: 'R', row: 0}},
		// The approaches of the airport, each with its number in the list
		{id: 'rnav32l', find: {re: /1 RNAV 32L/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
