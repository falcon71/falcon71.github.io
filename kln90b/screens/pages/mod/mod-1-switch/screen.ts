import {defineScreen, panelXml, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'MOD 1 in OBS mode with the GPS CRS switch of the aircraft',
	show: 'left',
	boot: {...BOOT, panelXml: panelXml({'Input.ExternalSwitches.LegObsSwitchInstalled': true})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'MOD 1');
		// The pilot sets the GPS CRS switch to OBS, and the unit follows it
		u.env.sim.set('GPS OBS ACTIVE', 'bool', true);
		await wait(2000);
	},
	fields: [
		{id: 'title', find: [{re: /PRESS ENT|PRESS GPS/, area: 'L', row: 0}, {re: /TO ACTIVATE|CRS FOR/, area: 'L', row: 1}]},
		{id: 'leg', find: {re: /LEG/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'page', find: {re: /MOD 1|CRSR/, area: 'S'}},
	],
});
