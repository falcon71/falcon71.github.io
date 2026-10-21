import {defineScreen} from '../../generator/api.ts';
import {BOOT, fly, showNav1AndApt1} from '../shared/kpdx-ksea.ts';

const HALF_ROWS = [0, 1, 2, 3, 4, 5];

defineScreen(import.meta.url, {
	title: 'Screen layout: left page, right page and status line',
	show: 'both',
	boot: BOOT,
	// The status line flashes msg here, because the field of the message is part of the figure
	keepMessages: true,
	steps: async u => {
		await fly(u);
		await showNav1AndApt1(u);
	},
	fields: [
		{id: 'left', find: HALF_ROWS.map(row => ({area: 'L' as const, row, from: 0, to: 11}))},
		{id: 'right', find: HALF_ROWS.map(row => ({area: 'R' as const, row, from: 0, to: 11}))},
		{id: 'lname', find: {re: /NAV 1/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
		{id: 'rname', find: {re: /APT 1/, area: 'S'}},
	],
});
