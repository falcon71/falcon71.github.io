import {defineScreen, facility, place, savedFlightplan, wait} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'CTR 1 with a center waypoint to insert',
	show: 'both',
	// The leg from KPDX to KBKE leaves the Seattle Center and enters the Salt Lake City Center
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KBKE'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'CTR 1');
		await u.panel.ent();
		// The unit computes the waypoints for a few seconds
		await wait(3000);
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'plan', find: [{re: /1:KPDX/, area: 'L'}, {re: /2:KBKE/, area: 'L'}]},
		{id: 'blank', find: {re: /3: +/, area: 'L'}},
		{id: 'count', find: {re: /\d+ NEW WPTS?/, area: 'R'}},
		{id: 'prompt', find: [{re: /PRESS ENT/, area: 'R'}, {re: /TO INSERT/, area: 'R'}, {re: /INTO FPL/, area: 'R'}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'left-page', find: {re: /FPL 1/, area: 'S'}},
		{id: 'page', find: {re: /CTR 1/, area: 'S'}},
	],
});
