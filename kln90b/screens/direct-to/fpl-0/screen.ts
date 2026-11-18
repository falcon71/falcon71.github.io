import {defineScreen} from '../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../shared/fpl-0-olm.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 after a direct-to to a waypoint of the flight plan',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'KOLM');
		// The Direct To page offers the waypoint under the cursor; ENT approves it
		await u.panel.dct();
		await u.panel.ent();
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
