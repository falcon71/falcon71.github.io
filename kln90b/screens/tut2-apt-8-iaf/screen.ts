import {defineScreen} from '../../generator/api.ts';
import {cursorOnHumpp, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Choosing the initial approach fix on APT 8',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnHumpp,
	fields: [
		{id: 'title', find: {re: /R32L-KBFI/, area: 'R', row: 0}},
		{id: 'iaf', find: {re: /IAF/, area: 'R'}},
		// The IAFs of the approach, each with its number in the list
		{id: 'arvad', find: {re: /1 ARVAD/, area: 'R'}},
		{id: 'humpp', find: {re: /2 HUMPP/, area: 'R'}},
		{id: 'woodi', find: {re: /3 WOODI/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
