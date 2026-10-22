import {defineScreen} from '../../generator/api.ts';
import {cursorOnRw32l, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Choosing the runway of the arrival on APT 7',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnRw32l,
	fields: [
		{id: 'title', find: {re: /CHINS5-Æ/, area: 'R', row: 0}},
		{id: 'runway', find: {re: /RUNWAY/, area: 'R'}},
		// The runways of the arrival, each with its number in the list
		{id: 'rw14l', find: {re: /1 RW14L/, area: 'R'}},
		{id: 'rw14r', find: {re: /2 RW14R/, area: 'R'}},
		{id: 'rw32r', find: {re: /3 RW32R/, area: 'R'}},
		{id: 'rw32l', find: {re: /4 RW32L/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
