import {defineScreen} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/fpl-0-olm.ts';

defineScreen(import.meta.url, {
	title: 'NAV 5 page, actual track up, on the first leg of a flight plan',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 5');
		// The cursor comes on at the range: two steps of the inner knob make it 80 NM, and the outer knob moves the cursor to
		// the orientation, which two steps of the inner knob turn to track up
		await u.panel.cursor('L');
		await u.panel.inner('L', 2);
		await u.panel.outer('L', -1);
		await u.panel.inner('L', 2);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'orientation', find: {re: /\d{3}°/, area: 'L', row: 5}},
		{id: 'range', find: {re: /\d+$/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 5/, area: 'S'}},
		// What the map draws: the active leg with its arrow, the next leg, the number of each waypoint of FPL 0 that lies on
		// the map, and the aircraft
		{id: 'active-leg', find: {map: 'L', draw: /^arrow KPDX KOLM$/}},
		{id: 'next-leg', find: {map: 'L', draw: /^line KOLM KSEA$/}},
		{id: 'numbers', find: {map: 'L', draw: /^icon \d+ /, many: true}},
		{id: 'aircraft', find: {map: 'L', draw: /^icon # /}},
	],
});
