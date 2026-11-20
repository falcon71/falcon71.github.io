import {defineScreen, showSuperNav5} from '../../../generator/api.ts';
import {GROUND_BOOT, onArc} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'Super NAV 5 on the DME arc',
	show: 'both',
	boot: GROUND_BOOT,
	steps: async u => {
		await onArc(u);
		await showSuperNav5(u);
		// The left cursor comes on at the range scale; 20 NM shows the arc and all the waypoints
		await u.panel.cursor('L');
		await u.panel.inner('L', -2);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /OHKAR/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'ete', find: {re: /Ð\d+:\d\d/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'arc-radial', find: {re: /Ø\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		// What the map draws: the arc, the active leg, with its arrow; the part of the arc before the moved DME arc
		// waypoint, dashed; the other legs; the waypoints of FPL 0; and the aircraft
		{id: 'arc', find: {map: 'F', draw: /^arc-arrow /}},
		{id: 'arc-skipped', find: {map: 'F', draw: /^arc .* dashed$/}},
		{id: 'legs', find: {map: 'F', draw: /^line /, many: true}},
		{id: 'arc-waypoint', find: [{map: 'F', draw: /^icon @ [-\d.]+,[-\d.]+$/}, {map: 'F', draw: /^label D215I /}]},
		{id: 'end-fix', find: [{map: 'F', draw: /^icon @ OHKAR$/}, {map: 'F', draw: /^label OHKAR /}]},
		{id: 'waypoints', find: [
			{map: 'F', draw: /^icon @ KYKM$/}, {map: 'F', draw: /^label KYKM /},
			{map: 'F', draw: /^icon @ PAPPS$/}, {map: 'F', draw: /^label PAPPS /},
		]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
