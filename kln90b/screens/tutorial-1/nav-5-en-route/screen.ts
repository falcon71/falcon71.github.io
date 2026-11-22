import {defineScreen} from '../../../generator/api.ts';
import {directToKtiw, flyAlong, tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'NAV 5 en route in actual track up, 40 NM from Friday Harbor',
	show: 'left',
	boot: tut1Boot,
	steps: async u => {
		await directToKtiw(u);
		await flyAlong(u, 40);
		await u.panel.selectPage('L', 'NAV 5');
		// The way the tutorial turns the map: the cursor comes on at the range, the outer knob moves it to the
		// orientation, two steps of the inner knob turn it from north up to actual track up, and the cursor goes off
		await u.panel.cursor('L');
		await u.panel.outer('L', -1);
		await u.panel.inner('L', 2);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'orientation', find: {re: /\d{3}°/, area: 'L', row: 5}},
		{id: 'range', find: {re: /\d+$/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 5/, area: 'S'}},
		// What the map draws: the direct-to from KFHR, the active waypoint and the aircraft
		{id: 'leg', find: {map: 'L', draw: /^arrow KFHR KTIW$/}},
		{id: 'active-waypoint', find: {map: 'L', draw: /^icon % KTIW$/}},
		{id: 'aircraft', find: {map: 'L', draw: /^icon # /}},
	],
});
