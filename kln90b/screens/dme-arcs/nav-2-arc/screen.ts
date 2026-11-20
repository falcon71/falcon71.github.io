import {defineScreen} from '../../../generator/api.ts';
import {GROUND_BOOT, onArc} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'NAV 2 on the DME arc',
	show: 'left',
	boot: GROUND_BOOT,
	steps: async u => {
		await onArc(u);
		await u.panel.selectPage('L', 'NAV 2');
	},
	fields: [
		{id: 'title', find: {re: /PRESENT POS/, area: 'L'}},
		{id: 'vor', find: {re: /YKM +\d{3}°fr/, area: 'L'}},
		{id: 'dist', find: {re: /\d+\.\dnm/, area: 'L'}},
		{id: 'lat', find: {area: 'L', row: 4}},
		{id: 'lon', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 2/, area: 'S'}},
	],
});
