import {defineScreen, facility, place, savedFlightplan} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'CTR 2 before the center waypoints are computed',
	show: 'right',
	boot: {position: place('KPDX'), storage: savedFlightplan(1, ['KPDX', 'KBKE'].map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 1');
		await u.panel.selectPage('R', 'CTR 1');
		await u.panel.inner('R', 1);
	},
	fields: [
		{id: 'text', find: [{re: /NO CTR/, area: 'R'}, {re: /WAYPOINTS/, area: 'R'}]},
		{id: 'page', find: {re: /CTR 2/, area: 'S'}},
	],
});
