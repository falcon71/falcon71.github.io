import {defineScreen, showSuperNav5} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../snav5-state.ts';

defineScreen(import.meta.url, {
	title: 'Super NAV 5 with the window open on KPAE',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await showSuperNav5(u);
		// Pulling the right inner knob opens the window on the active waypoint; one step of the knob counterclockwise goes back
		// to the first waypoint of FPL 0
		await u.panel.scan();
		await u.panel.inner('R', -1);
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
		{id: 'range', find: {re: /(?<=° )\d+/, area: 'F', row: 6}},
		// The window: the waypoint of FPL 0 that the scan has reached
		{id: 'window', find: {re: /.{6}$/, area: 'F', row: 6}},
		{id: 'active-leg', find: {map: 'F', draw: /^arrow KPAE KSEA$/}},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ /, many: true}, {map: 'F', draw: /^label (KPAE|KSEA) /, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
