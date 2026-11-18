import {defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 2 page after the unit has lost its position',
	show: 'left',
	boot: BOOT,
	// The loss of the position raises a message that persists; the left half shows only the page name of the status line
	keepMessages: true,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 2');
		// The receiver loses the position, as it does when it is reset
		u.props.sensors.in.gps.reset();
		await wait(1500);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'title', find: {re: /PRESENT POS/, area: 'L', row: 0}},
		{id: 'vor', find: {area: 'L', row: 2}},
		{id: 'dist', find: {area: 'L', row: 3}},
		{id: 'lat', find: {area: 'L', row: 4}},
		{id: 'lon', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 2/, area: 'S'}},
	],
});
