import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'MOD 2 in OBS mode with the cursor on the selected course',
	show: 'left',
	// An installation without an indicator that the unit reads or turns: the pilot sets the course on the unit
	boot: {...BOOT, panelXml: panelXml({'Input.ObsSource': 0})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		await u.panel.cursor('L');
		await u.panel.inner('L', 3);
	},
	fields: [
		{id: 'title', find: {re: /ACTIVE MODE/, area: 'L', row: 0}},
		{id: 'course', find: {re: /OBS.\S+°/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'page', find: {re: /MOD 2|CRSR/, area: 'S'}},
	],
});
