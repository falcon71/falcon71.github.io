import {defineScreen, adjustCourseIndicator, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 during a direct-to a waypoint of the flight plan',
	show: 'left',
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.directTo('KSEA');
		await wait(1000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'FPL 0');
	},
	fields: [
		{id: 'before', find: {re: / +2:KOLM/, area: 'L'}},
		{id: 'to', find: {re: /› +3:KSEA/, area: 'L'}},
		{id: 'rest', find: [{area: 'L', row: 1}, {area: 'L', row: 4}]},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
