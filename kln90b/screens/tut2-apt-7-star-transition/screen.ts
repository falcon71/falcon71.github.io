import {defineScreen} from '../../generator/api.ts';
import {cursorOnYkmTransition, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Choosing the transition of the arrival on APT 7',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnYkmTransition,
	fields: [
		{id: 'title', find: {re: /CHINS5-Æ/, area: 'R', row: 0}},
		{id: 'transition', find: {re: /TRANSITION/, area: 'R'}},
		// The transitions of the arrival, each with its number in the list
		{id: 'pdt', find: {re: /1 PDT/, area: 'R'}},
		{id: 'suned', find: {re: /2 SUNED/, area: 'R'}},
		{id: 'ykm', find: {re: /3 YKM/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
