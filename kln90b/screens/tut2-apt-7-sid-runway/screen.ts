import {defineScreen} from '../../generator/api.ts';
import {cursorOnRw27, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Choosing the runway of the departure on APT 7',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnRw27,
	fields: [
		{id: 'title', find: {re: /YKM7-SID/, area: 'R', row: 0}},
		{id: 'runway', find: {re: /RUNWAY/, area: 'R'}},
		// The runways of the departure, each with its number in the list
		{id: 'rw09', find: {re: /1 RW09/, area: 'R'}},
		{id: 'rw22', find: {re: /2 RW22/, area: 'R'}},
		{id: 'rw27', find: {re: /3 RW27/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
