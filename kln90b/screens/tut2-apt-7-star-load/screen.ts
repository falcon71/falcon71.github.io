import {defineScreen} from '../../generator/api.ts';
import {cursorOnLoadStar, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Loading the arrival into FPL 0 on APT 7',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnLoadStar,
	fields: [
		{id: 'title', find: {re: /CHINS5-Æ/, area: 'R', row: 0}},
		// The waypoints of the arrival, each with its number in the list; the list shows its last waypoint always
		{id: 'ykm', find: {re: /1 YKM/, area: 'R'}},
		{id: 'chins', find: {re: /2 CHINS/, area: 'R'}},
		{id: 'raddy', find: {re: /3 RADDY/, area: 'R'}},
		{id: 'aubrn', find: {re: /5 AUBRN/, area: 'R'}},
		{id: 'load', find: {re: /LOAD IN FPL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
