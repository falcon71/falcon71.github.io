import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'MOD 2 in leg mode with the GPS CRS switch of the aircraft',
	show: 'left',
	boot: {...BOOT, panelXml: panelXml({'Input.ExternalSwitches.LegObsSwitchInstalled': true})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'MOD 2');
	},
	fields: [
		{id: 'title', find: [{re: /PRESS ENT|PRESS GPS/, area: 'L', row: 0}, {re: /TO ACTIVATE|CRS FOR/, area: 'L', row: 1}]},
		{id: 'course', find: {re: /OBS.\S+°/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'page', find: {re: /MOD 2|CRSR/, area: 'S'}},
	],
});
