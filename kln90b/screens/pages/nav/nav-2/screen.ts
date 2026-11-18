import {defineScreen, NEAREST_SEARCH_WAIT_MS, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 2 page',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 2');
		// The search for the nearest VOR answers a few seconds after the page opens
		await wait(NEAREST_SEARCH_WAIT_MS);
	},
	fields: [
		{id: 'title', find: {re: /PRESENT POS/, area: 'L', row: 0}},
		{id: 'vor', find: {re: /\S{3} +\d{3}°fr/, area: 'L', row: 2}},
		{id: 'dist', find: {re: /\d+\.\dnm/, area: 'L', row: 3}},
		{id: 'lat', find: {area: 'L', row: 4}},
		{id: 'lon', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 2/, area: 'S'}},
	],
});
