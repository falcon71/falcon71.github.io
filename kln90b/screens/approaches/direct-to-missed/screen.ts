import {defineScreen} from '../../../generator/api.ts';
import {BOOT, pastMap} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'Direct To page with the first waypoint of the missed approach',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await pastMap(u);
		await u.panel.selectPage('R', 'NAV 2');
		await u.panel.dct();
	},
	fields: [
		{id: 'dto-title', find: {re: /DIRECT TO:/, area: 'L', row: 0}},
		{id: 'dto-ident', find: {re: /CORER/, area: 'L', row: 2}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
