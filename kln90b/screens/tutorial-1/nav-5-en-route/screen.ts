import {defineScreen} from '../../../generator/api.ts';
import {directToKtiw, flyAlong, tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'NAV 5 en route, 40 NM from Friday Harbor',
	show: 'left',
	boot: tut1Boot,
	steps: async u => {
		await directToKtiw(u);
		await flyAlong(u, 40);
		await u.panel.selectPage('L', 'NAV 5');
	},
	fields: [
		{id: 'orientation', find: {re: /N\^/, area: 'L', row: 5}},
		{id: 'range', find: {re: /\d+$/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 5/, area: 'S'}},
		// What the map draws: the direct-to from KFHR, the active waypoint and the aircraft
		{id: 'leg', find: {map: 'L', draw: /^arrow KFHR KTIW$/}},
		{id: 'active-waypoint', find: {map: 'L', draw: /^icon % KTIW$/}},
		{id: 'aircraft', find: {map: 'L', draw: /^icon \$ /}},
	],
});
