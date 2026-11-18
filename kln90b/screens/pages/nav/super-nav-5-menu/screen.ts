import {defineScreen, showSuperNav5} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../snav5-state.ts';

defineScreen(import.meta.url, {
	title: 'Super NAV 5 with the pop-up menu open',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await showSuperNav5(u);
		// The right CRSR opens the menu, with the cursor on the VOR entry
		await u.panel.cursor('R');
	},
	fields: [
		// The left column: the distance to the active waypoint and its identifier, the mode, the groundspeed and the three
		// fields the pilot chooses (here ETE, DTK and TK)
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /KSEA/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'ete', find: {re: /Ð\S+/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		// The menu: the VOR layer, the NDB layer, the airport layer and the orientation of the map
		{id: 'vor', find: {re: /VOR: *\S+/, area: 'F', row: 0}},
		{id: 'ndb', find: {re: /NDB: *\S+/, area: 'F', row: 1}},
		{id: 'apt', find: {re: /APT: *\S+/, area: 'F', row: 2}},
		{id: 'orientation', find: {area: 'F', row: 3, from: 15, to: 23}},
		// What the map draws: the active leg with its arrow, the waypoints of FPL 0 with their identifiers, and the aircraft
		{id: 'active-leg', find: {map: 'F', draw: /^arrow KPAE KSEA$/}},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ /, many: true}, {map: 'F', draw: /^label /, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
