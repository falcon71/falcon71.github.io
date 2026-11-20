import {defineScreen} from '../../../generator/api.ts';
import {BOOT, flyStart, rnav17Waypoints} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'APT 8: the waypoints of RNAV 17 at KOLM',
	show: 'right',
	boot: BOOT,
	steps: async u => {
		await flyStart(u);
		await rnav17Waypoints(u);
	},
	fields: [
		{id: 'title', find: {re: /R17-KOLM/, area: 'R', row: 0}},
		{id: 'iaf', find: {re: /1 CARROà/, area: 'R'}},
		{id: 'waypoints', find: {re: /2 BOSTO/, area: 'R'}},
		{id: 'faf', find: {re: /3 OPOYUá/, area: 'R'}},
		{id: 'mahp', find: {re: /6 CETRAâ/, area: 'R'}},
		{id: 'load', find: {re: /LOAD IN FPL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
