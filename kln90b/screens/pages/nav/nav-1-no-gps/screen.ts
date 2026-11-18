import {defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 after the unit has lost its position',
	show: 'left',
	boot: BOOT,
	// The loss of the position raises a message that persists; the left half shows only the page name of the status line
	keepMessages: true,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'NAV 1');
		// The receiver loses the position, as it does when it is reset
		u.props.sensors.in.gps.reset();
		await wait(1500);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'from', find: {area: 'L', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {re: /›/, area: 'L', row: 0}},
		{id: 'to', find: {area: 'L', row: 0, from: 6, to: 11}},
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'L'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'L'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'L'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'L'}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
