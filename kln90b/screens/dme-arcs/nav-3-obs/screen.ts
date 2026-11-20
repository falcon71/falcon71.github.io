import {adjustCourseIndicator, defineScreen, wait} from '../../../generator/api.ts';
import {GROUND_BOOT, onArc} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'NAV 3 after the change to OBS mode on the DME arc',
	show: 'left',
	boot: GROUND_BOOT,
	steps: async u => {
		await onArc(u);
		await u.panel.selectPage('L', 'MOD 2');
		await u.panel.ent();
		await wait(2000);
		await adjustCourseIndicator(u);
		await u.panel.selectPage('L', 'NAV 3');
		await wait(1000);
	},
	fields: [
		{id: 'leg', find: {re: /.OHKAR/, area: 'L', row: 0}},
		{id: 'obs', find: {re: /OBS +\d{3}°/, area: 'L'}},
		{id: 'tk', find: {re: /TK +\d{3}°/, area: 'L'}},
		{id: 'fly', find: {re: /FLY.*/, area: 'L'}},
		{id: 'msa', find: {re: /MSA +\S+/, area: 'L'}},
		{id: 'esa', find: {re: /ESA +\S+/, area: 'L'}},
		{id: 'page', find: {re: /NAV 3/, area: 'S'}},
	],
});
