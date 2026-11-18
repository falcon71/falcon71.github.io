import {defineScreen, panelXml} from '../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 and NAV 3 in OBS mode',
	show: 'both',
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
		await u.panel.selectPage('R', 'NAV 3');
	},
	fields: [
		{id: 'to', find: {area: 'L', row: 0}},
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'L'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'L'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'L'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'L'}},
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-dtk', find: {re: /(DTK|OBS).+°/, area: 'R', row: 1}},
		{id: 'r-tk', find: {re: /TK +\S+/, area: 'R', row: 2}},
		{id: 'r-fly', find: {re: /FLY.+/, area: 'R', row: 3}},
		{id: 'r-msa', find: {re: /MSA.+/, area: 'R', row: 4}},
		{id: 'r-esa', find: {re: /ESA.+/, area: 'R', row: 5}},
		{id: 'lpage', find: {re: /NAV 1/, area: 'S'}},
		{id: 'mode', find: {re: /enr:\d+/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 3/, area: 'S'}},
	],
});
