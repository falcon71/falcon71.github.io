import {defineScreen} from '../../../generator/api.ts';
import {BOOT, fly, showNav1AndApt1} from '../../shared/kpdx-ksea.ts';

// The active leg raises ADJ NAV IND CRS TO nnn°, which nobody has read: the message prompt flashes
defineScreen(import.meta.url, {
	title: 'The message prompt, flashing',
	show: 'both',
	keepMessages: true,
	boot: BOOT,
	steps: async u => {
		await fly(u);
		await showNav1AndApt1(u);
	},
	fields: [
		{id: 'left', find: [0, 1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row}))},
		{id: 'right', find: [0, 1, 2, 3, 4, 5].map(row => ({area: 'R' as const, row}))},
		{id: 'lname', find: {re: /NAV 1/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
		{id: 'rname', find: {re: /APT 1/, area: 'S'}},
	],
});
