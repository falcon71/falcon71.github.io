import {defineScreen, panelXml, wait} from '../../../generator/api.ts';
import {BOOT, fly} from '../../shared/kpdx-ksea.ts';

// An installation in which the unit turns the external indicator and reads it back; the indicator is held on another
// course, so it does not follow the course the unit sends
defineScreen(import.meta.url, {
	title: 'MSG page with ADJ NAV IND CRS',
	show: 'both',
	keepMessages: true,
	boot: {...BOOT, panelXml: panelXml({'Output.ObsTarget': 1})},
	steps: async u => {
		await fly(u);
		for (let i = 0; i < 20; i++) {
			u.env.sim.set('Nav OBS:1', 'degrees', 300);
			await wait(1000);
		}
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: {re: /ADJ NAV IND CRS *$/, area: 'F', row: 0}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
