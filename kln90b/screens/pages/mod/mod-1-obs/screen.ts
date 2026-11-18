import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'MOD 1 in OBS mode',
	show: 'left',
	// An installation without an indicator that the unit reads or turns: the pilot sets the course on the unit
	boot: {...BOOT, panelXml: panelXml({'Input.ObsSource': 0})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		await u.panel.selectPage('L', 'MOD 1');
	},
	fields: [
		{id: 'title', find: [{re: /PRESS ENT|PRESS GPS/, area: 'L', row: 0}, {re: /TO ACTIVATE|CRS FOR/, area: 'L', row: 1}]},
		{id: 'leg', find: {re: /LEG/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'page', find: {re: /MOD 1|CRSR/, area: 'S'}},
	],
});
