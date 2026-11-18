import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 4 page without an altitude input',
	show: 'left',
	boot: {...BOOT, panelXml: panelXml({'Input.AltimeterInterfaced': false})},
	// A unit without an altitude input keeps the message ALTITUDE FAIL; the left half shows only the page name of the status line
	keepMessages: true,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 4');
		// The altitude to start from, 7,500 ft, then the altitude to go to, 3,000 ft
		await u.panel.cursor('L');
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 7);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 5);
		await u.panel.outer('L', 2);
		await u.panel.inner('L', 3);
		// A descent that ends 5 NM before the waypoint
		await u.panel.outer('L', 4);
		await u.panel.inner('L', 5);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'fr', find: {re: /FR :\S+ft/, area: 'L', row: 2}},
		{id: 'to', find: {re: /TO :\S+ft/, area: 'L', row: 3}},
		{id: 'wpt', find: {area: 'L', row: 4, from: 0, to: 5}},
		{id: 'dist', find: {re: /:-\d+nm/, area: 'L', row: 4}},
		{id: 'angle', find: {re: /ANGLE:\S+°/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 4/, area: 'S'}},
	],
});
