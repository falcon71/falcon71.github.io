import {defineScreen} from '../../../generator/api.ts';
import {GROUND_BOOT, gromo4Waypoints} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'The waypoints of GROMO4 with the DME arc waypoint',
	show: 'right',
	boot: GROUND_BOOT,
	steps: gromo4Waypoints,
	fields: [
		{id: 'title', find: {re: /GROMO4-SID/, area: 'R', row: 0}},
		{id: 'arc-waypoint', find: {re: /1 D247I/, area: 'R'}},
		{id: 'end-fix', find: {re: /2 OHKAR/, area: 'R'}},
		{id: 'papps', find: {re: /3 PAPPS/, area: 'R'}},
		{id: 'load', find: {re: /LOAD IN FPL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
