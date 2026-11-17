import {defineScreen, place, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'ACT page without an active waypoint',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		// No flight plan and no direct-to. The boot page is SUP; its own message NO SUP WPTS is gone after 5 seconds
		await wait(6000);
		await u.panel.selectPage('R', 'ACT');
	},
	fields: [
		{id: 'text', find: [{re: /NO ACTIVE/, area: 'R'}, {re: /WAYPOINT/, area: 'R'}]},
		{id: 'page', find: {re: /ACT/, area: 'S'}},
	],
});
