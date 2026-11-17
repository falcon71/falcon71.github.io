import {defineScreen, panelXml, place, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The OBS warning page',
	show: 'both',
	boot: {
		position: place('KSEA'),
		panelXml: panelXml({'Input.ExternalSwitches.LegObsSwitchInstalled': true}),
		simVars: [{name: 'GPS OBS ACTIVE', unit: 'bool', value: true}],
	},
	steps: async u => {
		await u.panel.powerCycle();
		await wait(19000);
		await u.panel.cursorTo('R', 'APPROVE?');
		await u.panel.ent();
		await wait(1000);
	},
	fields: [
		{id: 'warning', find: {re: /WARNING/, area: 'F'}},
		{id: 'mode', find: {re: /enr:\d+/, area: 'S'}},
		{id: 'text', find: [{re: /SYSTEM IS IN OBS MODE/, area: 'F'}, {re: /PRESS GPS CRS BUTTON/, area: 'F'}, {re: /TO CHANGE TO LEG MODE/, area: 'F'}]},
	],
});
