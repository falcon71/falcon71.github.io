import {defineScreen, panelXml} from '../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'The course message after a direct-to in OBS mode',
	show: 'both',
	// An installation without an indicator that the unit reads or turns
	boot: {...BOOT, panelXml: panelXml({'Input.ObsSource': 0})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.dct();
		await u.panel.enterIdent('L', 'KBFI');
		await u.panel.ent();
		await u.panel.ent();
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'active', find: {re: /›KBFI/, area: 'R', row: 0}},
		{id: 'cdi', find: {area: 'R', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /FPL 0/, area: 'S'}},
		{id: 'msg', find: {re: /d› CRS \d+°/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
