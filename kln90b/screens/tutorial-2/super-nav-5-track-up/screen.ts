import {defineScreen, showSuperNav5} from '../../../generator/api.ts';
import {pastChins, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'Super NAV 5 in actual track up between CHINS and RADDY',
	show: 'both',
	boot: tut2Boot,
	steps: async u => {
		await pastChins(u, 8);
		await showSuperNav5(u);
		// The way the tutorial turns the map: the right CRSR opens the pop-up menu, the right outer knob moves its cursor
		// down to the map orientation, two steps of the right inner knob turn it from north up to actual track up, and
		// the right CRSR closes the menu
		await u.panel.cursor('R');
		await u.panel.outer('R', 3);
		await u.panel.inner('R', 2);
		await u.panel.cursor('R');
		// The left CRSR puts the cursor on the range scale, and the left inner knob turns it from 40 to 30 NM
		await u.panel.cursor('L');
		await u.panel.inner('L', -1);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /RADDY/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'ete', find: {re: /Ð\S+/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		// What the map draws: the legs of FPL 0, the active one with an arrow; the waypoints of FPL 0 on the map, each
		// with its icon and name; and the aircraft
		{id: 'active-leg', find: {map: 'F', draw: /^arrow CHINS RADDY$/}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{id: 'active-waypoint', find: [{map: 'F', draw: /^icon @ RADDY$/}, {map: 'F', draw: /^label RADDY /}]},
		{id: 'chins', find: [{map: 'F', draw: /^icon @ CHINS$/}, {map: 'F', draw: /^label CHINS /}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon # /}},
	],
});
