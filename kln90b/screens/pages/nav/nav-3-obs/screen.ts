import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 3 page in OBS mode, with the cursor on the selected course',
	show: 'left',
	// An installation without an indicator that the unit reads or turns: the pilot sets the course on the unit
	boot: {...BOOT, panelXml: panelXml({'Input.ObsSource': 0})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		await u.panel.selectPage('L', 'NAV 3');
		// The selected course 3 degrees to the right of the leg's, with the cursor left on it
		await u.panel.cursor('L');
		await u.panel.inner('L', 3);
	},
	fields: [
		{id: 'to', find: {area: 'L', row: 0, from: 5, to: 11}},
		{id: 'obs', find: {re: /OBS: +\S+/, area: 'L', row: 1}},
		{id: 'tk', find: {re: /TK +\S+/, area: 'L', row: 2}},
		{id: 'fly', find: {re: /FLY.+/, area: 'L', row: 3}},
		{id: 'msa', find: {re: /MSA.+/, area: 'L', row: 4}},
		{id: 'esa', find: {re: /ESA.+/, area: 'L', row: 5}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
