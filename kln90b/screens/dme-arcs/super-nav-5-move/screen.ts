import {defineScreen, showSuperNav5} from '../../../generator/api.ts';
import {GROUND_BOOT, onVector, windowTo} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'MOVE ? in the window of Super NAV 5',
	show: 'both',
	boot: GROUND_BOOT,
	steps: async u => {
		await onVector(u);
		await showSuperNav5(u);
		// The left cursor comes on at the range scale; 20 NM shows the arc large
		await u.panel.cursor('L');
		await u.panel.inner('L', -2);
		await u.panel.cursor('L');
		await windowTo(u, /D247I/);
		await u.panel.clr();
	},
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /D247I/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'ete', find: {re: /Ð\d+:\d\d/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'arc-radial', find: {re: /Ø\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= +MOVE)/, area: 'F', row: 6}},
		{id: 'move', find: {re: /MOVE \?/, area: 'F', row: 6}},
		// What the map draws: the active leg to the DME arc waypoint, with its arrow; the arc; the other legs; the
		// waypoints of FPL 0; and the aircraft
		{id: 'active-leg', find: {map: 'F', draw: /^arrow /}},
		{id: 'arc', find: {map: 'F', draw: /^arc /, many: true}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{id: 'arc-waypoint', find: [{map: 'F', draw: /^icon @ [-\d.]+,[-\d.]+$/}, {map: 'F', draw: /^label D247I /}]},
		{id: 'waypoints', find: [
			{map: 'F', draw: /^icon @ KYKM$/}, {map: 'F', draw: /^label KYKM /},
			{map: 'F', draw: /^icon @ OHKAR$/}, {map: 'F', draw: /^label OHKAR /},
			{map: 'F', draw: /^icon @ PAPPS$/}, {map: 'F', draw: /^label PAPPS /},
		]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
