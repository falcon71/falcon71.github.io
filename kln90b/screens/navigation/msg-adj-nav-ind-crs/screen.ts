import {defineScreen} from '../../../generator/api.ts';
import {BOOT, fly} from '../../shared/kpdx-ksea.ts';

// The default installation reads the course indicator, which is left off the desired track of the active leg
defineScreen(import.meta.url, {
	title: 'MSG page with ADJ NAV IND CRS TO',
	show: 'both',
	keepMessages: true,
	boot: BOOT,
	steps: async u => {
		await fly(u);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: {re: /ADJ NAV IND CRS TO \d+°/, area: 'F'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
