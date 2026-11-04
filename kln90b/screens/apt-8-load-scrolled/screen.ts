import {defineScreen} from '../../generator/api.ts';
import {aptBoot, rnav34lWaypointsScrolled} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 8: the end of the waypoints of an approach',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: rnav34lWaypointsScrolled,
	fields: [
		{id: 'title', find: {re: /R34L-KSEA/, area: 'R', row: 0}},
		// Each waypoint with its number and the mark of its role in the approach
		{id: 'jalon', find: {re: /4 JALONá/, area: 'R'}},
		{id: 'hovos', find: {re: /5 HOVOS/, area: 'R'}},
		{id: 'rw34l', find: {re: /6 RW34Lã/, area: 'R'}},
		{id: 'lofal', find: {re: /7 LOFALâ/, area: 'R'}},
		{id: 'load', find: {re: /LOAD IN FPL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
