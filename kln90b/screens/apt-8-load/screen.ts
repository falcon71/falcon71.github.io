import {defineScreen} from '../../generator/api.ts';
import {aptBoot, rnav34lWaypoints} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 8: the waypoints of an approach',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: rnav34lWaypoints,
	fields: [
		{id: 'title', find: {re: /R34L-KSEA/, area: 'R', row: 0}},
		// Each waypoint with its number and the mark of its role in the approach
		{id: 'sondr', find: {re: /1 SONDRà/, area: 'R'}},
		{id: 'waypoints', find: [{re: /2 HIPRO/, area: 'R'}, {re: /3 JOSTA/, area: 'R'}]},
		{id: 'lofal', find: {re: /7 LOFALâ/, area: 'R'}},
		{id: 'load', find: {re: /LOAD IN FPL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
