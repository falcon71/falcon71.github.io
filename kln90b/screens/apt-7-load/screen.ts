import {defineScreen} from '../../generator/api.ts';
import {aptBoot, bangr9Waypoints} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 7: the waypoints of a departure',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: bangr9Waypoints,
	fields: [
		{id: 'title', find: {re: /BANGR9-SID/, area: 'R', row: 0}},
		{id: 'waypoints', find: [{re: /1 NESOE/, area: 'R'}, {re: /2 WUREL/, area: 'R'}, {re: /3 ATOME/, area: 'R'}]},
		// The last waypoint, which the bottom row of the list keeps
		{id: 'last', find: {re: /6 ARRIE/, area: 'R'}},
		{id: 'load', find: {re: /LOAD IN FPL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
