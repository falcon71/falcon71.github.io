import {defineScreen, wait} from '../../../generator/api.ts';
import {EN_ROUTE_BOOT, loadVord27} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'NAV 2 with a DME arc ahead',
	show: 'left',
	boot: EN_ROUTE_BOOT,
	steps: async u => {
		// 10 NM south of ELN the nearest VOR is ELN; YKM is the VOR of the arc ahead
		await loadVord27(u);
		await u.panel.selectPage('L', 'NAV 2');
		await wait(2000);
	},
	fields: [
		{id: 'title', find: {re: /PRESENT POS/, area: 'L'}},
		{id: 'vor', find: {re: /YKM +\d{3}°fr/, area: 'L'}},
		{id: 'dist', find: {re: /\d+\.\dnm/, area: 'L'}},
		{id: 'lat', find: {area: 'L', row: 4}},
		{id: 'lon', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 2/, area: 'S'}},
	],
});
