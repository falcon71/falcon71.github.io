import {defineScreen, facility, place, savedFlightplan} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'CTR 1 asking to compute the center waypoints',
	show: 'right',
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KBKE'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'CTR 1');
	},
	fields: [
		{id: 'prompt', find: [{re: /PRESS ENT/, area: 'R'}, {re: /TO COMPUTE/, area: 'R'}, {re: /CTR WPTS/, area: 'R'}]},
		{id: 'page', find: {re: /CTR 1/, area: 'S'}},
	],
});
