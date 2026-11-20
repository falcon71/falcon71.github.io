import {defineScreen} from '../../../generator/api.ts';
import {BOOT, loadRnav17, rnav17Waypoints} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'APT 8: the question to replace the approach',
	show: 'right',
	boot: BOOT,
	steps: async u => {
		await loadRnav17(u);
		await rnav17Waypoints(u);
		await u.panel.ent();
	},
	fields: [
		{id: 'title', find: {re: /R17-KOLM/, area: 'R', row: 0}},
		{id: 'question', find: [{area: 'R', row: 1}, {area: 'R', row: 2}, {area: 'R', row: 3}, {area: 'R', row: 4}]},
		{id: 'approve', find: {re: /APPROVE\?/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
