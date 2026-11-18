import {defineScreen, panelXml} from '../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 after the change from OBS mode back to leg mode',
	show: 'left',
	boot: {...BOOT, panelXml: panelXml({'Input.ObsSource': 0})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		await u.panel.cursor('L');
		await u.panel.inner('L', 3);
		await u.panel.cursor('L');
		await u.panel.selectPage('L', 'MOD 1');
		await u.panel.ent();
		await u.panel.selectPage('L', 'NAV 1');
	},
	fields: [
		{id: 'from', find: {area: 'L', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {re: /\u203A/, area: 'L', row: 0}},
		{id: 'to', find: {area: 'L', row: 0, from: 6, to: 11}},
		{id: 'cdi', find: {area: 'L', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'L'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'L'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'L'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'L'}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
