import {defineScreen} from '../../generator/api.ts';
import {cursorOnLoadSid, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Loading the departure into FPL 0 on APT 7',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnLoadSid,
	fields: [
		{id: 'title', find: {re: /YKM7-SID/, area: 'R', row: 0}},
		// The waypoints of the departure, each with its number in the list
		{id: 'ykm', find: {re: /1 YKM/, area: 'R'}},
		{id: 'titon', find: {re: /2 TITON/, area: 'R'}},
		{id: 'load', find: {re: /LOAD IN FPL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
