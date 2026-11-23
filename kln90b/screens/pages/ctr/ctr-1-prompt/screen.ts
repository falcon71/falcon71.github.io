import {defineScreen, facility, place, savedFlightplan} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'CTR 1 asking to compute the center waypoints, with the flight plan on the left side',
	show: 'both',
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KBKE'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'CTR 1');
	},
	fields: [
		{id: 'use', find: {re: /USE\? INVRT\?/, area: 'L'}},
		{id: 'plan', find: [{re: /1:KPDX/, area: 'L'}, {re: /2:KBKE/, area: 'L'}]},
		{id: 'blank', find: {re: /3: +/, area: 'L'}},
		{id: 'prompt', find: [{re: /PRESS ENT/, area: 'R'}, {re: /TO COMPUTE/, area: 'R'}, {re: /CTR WPTS/, area: 'R'}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'left-page', find: {re: /FPL 1/, area: 'S'}},
		{id: 'page', find: {re: /CTR 1/, area: 'S'}},
	],
});
