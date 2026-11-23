import {defineScreen, panelXml, place, wait} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The VFR-only warning page',
	show: 'both',
	boot: {position: place('KSEA'), panelXml: panelXml({VFROnly: true})},
	steps: async u => {
		// The unit has been started with its engine running, which skips the pages, so this is the power cycle a pilot does
		await u.panel.powerCycle();
		await wait(19000);
		await u.panel.cursorTo('R', 'APPROVE?');
		await u.panel.ent();
		await wait(1000);
	},
	fields: [
		{id: 'text', find: {re: /FOR VFR USE ONLY/, area: 'F'}},
		{id: 'acknowledge', find: {re: /ACKNOWLEDGE\?/, area: 'F'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'prompt', find: {area: 'S', from: 14, to: 17}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
