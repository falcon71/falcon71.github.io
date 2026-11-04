import {defineScreen} from '../../generator/api.ts';
import {aptBoot, cursorOnBangr9} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 7 with the departures of KSEA',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: cursorOnBangr9,
	fields: [
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		{id: 'heading', find: {re: /SELECT SID/, area: 'R'}},
		// The entry under the cursor, the entries above the bottom row, and the last entry, which the bottom row keeps
		{id: 'bangr9', find: {re: /1 BANGR9/, area: 'R'}},
		{id: 'sids', find: [{re: /2 ELMAA5/, area: 'R'}, {re: /3 HAROB6/, area: 'R'}]},
		{id: 'last', find: {re: /8 SUMMA2/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
