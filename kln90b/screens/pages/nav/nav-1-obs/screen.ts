import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 in OBS mode',
	show: 'left',
	// An installation without an indicator that the unit reads or turns: the pilot sets the course on the unit
	boot: {...BOOT, panelXml: panelXml({'Input.ObsSource': 0})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		// The selected course 3 degrees to the right of the leg's
		await u.panel.cursor('L');
		await u.panel.inner('L', 3);
		await u.panel.cursor('L');
		await u.panel.selectPage('L', 'NAV 1');
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
