import {defineScreen} from '../../generator/api.ts';
import {cursorOnLoadApproach, tut2Boot} from '../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Loading the approach into FPL 0 on APT 8',
	show: 'right',
	boot: tut2Boot,
	steps: cursorOnLoadApproach,
	fields: [
		{id: 'title', find: {re: /R32LY-KBFI/, area: 'R', row: 0}},
		// The waypoints of the approach, each with its number in the list and the mark of its kind of fix; the list
		// shows its last waypoint always
		{id: 'humpp', find: {re: /1 HUMPPà/, area: 'R'}},
		{id: 'covog', find: {re: /2 COVOG/, area: 'R'}},
		{id: 'aubrn', find: {re: /3 AUBRN/, area: 'R'}},
		{id: 'lofal', find: {re: /8 LOFALâ/, area: 'R'}},
		{id: 'load', find: {re: /LOAD IN FPL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
