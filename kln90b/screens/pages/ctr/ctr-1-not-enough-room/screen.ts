import {defineScreen, facility, place, savedFlightplan, wait} from '../../../../generator/api.ts';

// Thirty waypoints, the most a numbered flight plan holds, flying back and forth between two places that lie in
// different Centers, so that the plan crosses a boundary and the new waypoint has no room
const ROUTE = Array.from({length: 30}, (_, i) => (i % 2 === 0 ? 'KPDX' : 'KBKE')).map(facility);

defineScreen(import.meta.url, {
	title: 'CTR 1 with no room in the flight plan for the center waypoints',
	show: 'right',
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ROUTE)},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'CTR 1');
		await u.panel.ent();
		// The unit computes the waypoints for a few seconds
		await wait(3000);
	},
	fields: [
		{id: 'full', find: [{re: /NOT ENOUGH/, area: 'R'}, {re: /ROOM/, area: 'R'}, {re: /IN FPL/, area: 'R'}]},
		{id: 'page', find: {re: /CTR 1/, area: 'S'}},
	],
});
