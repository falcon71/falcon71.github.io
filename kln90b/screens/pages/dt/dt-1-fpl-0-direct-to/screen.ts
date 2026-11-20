import {adjustCourseIndicator, defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'D/T 1 beside FPL 0 during a direct-to outside the flight plan',
	show: 'both',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.directTo('KBFI');
		await wait(1000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'D/T 1');
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'header', find: {re: /DIS +ETE/, area: 'R'}},
		{id: 'lname', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rname', find: {re: /D\/T 1/, area: 'S'}},
	],
});
