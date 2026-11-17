import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 in keyboard mode after two waypoints are entered',
	show: 'left',
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
		await u.panel.press('KLN90B_LeftKeyboard_Toggle');
		// Each identifier: type it, press Enter for the waypoint page, press Enter again to approve it
		for (const ident of ['KPDX', 'KSEA']) {
			await u.panel.type('L', ident);
			await u.panel.ent();
			await u.panel.ent();
		}
	},
	fields: [
		{id: 'waypoints', find: [{area: 'L', row: 1}, {area: 'L', row: 2}]},
		{id: 'next', find: {re: /3: {2,6}/, area: 'L', row: 3}},
		{id: 'kybd', find: {re: /KYBD/, area: 'S'}},
	],
});
