import {defineScreen, showSuperNav5} from '../../../generator/api.ts';
import {BOOT, inTurn} from '../olm-turn.ts';

defineScreen(import.meta.url, {
	title: 'Super NAV 5 in the transition at KOLM, before the unit sequences to KSEA',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await inTurn(u);
		await showSuperNav5(u);
	},
	fields: [
		// The left column: the distance to the active waypoint and its identifier, the mode, the groundspeed and the three
		// fields the pilot chooses (here ETE, DTK and TK)
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		// The identifier of the active waypoint, which flashes by blanking during the alert before turn anticipation begins
		{id: 'ident', find: {area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'ete', find: {re: /Ð\S+/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		// The range of the map in NM, over the map
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		// What the map draws: the active leg with its arrow, the next leg, KOLM and KSEA with their names, and the aircraft
		{id: 'active-leg', find: {map: 'F', draw: /^arrow KPDX KOLM$/}},
		{id: 'next-leg', find: {map: 'F', draw: /^line KOLM KSEA$/}},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ /, many: true}, {map: 'F', draw: /^label /, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
