import {defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 3 page after the unit has lost its position',
	show: 'left',
	boot: BOOT,
	// The loss of the position raises a message that persists; the left half shows only the page name of the status line
	keepMessages: true,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 3');
		// The receiver loses the position, as it does when it is reset
		u.props.sensors.in.gps.reset();
		await wait(1500);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'from', find: {area: 'L', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {re: /›/, area: 'L', row: 0}},
		{id: 'to', find: {area: 'L', row: 0, from: 6, to: 11}},
		{id: 'dtk', find: {re: /DTK +\S+/, area: 'L', row: 1}},
		{id: 'tk', find: {re: /TK +\S+/, area: 'L', row: 2}},
		{id: 'fly', find: {re: /FLY.+/, area: 'L', row: 3}},
		{id: 'msa', find: {re: /MSA.+/, area: 'L', row: 4}},
		{id: 'esa', find: {re: /ESA.+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 3/, area: 'S'}},
	],
});
