import {defineScreen} from '../../../generator/api.ts';
import {GROUND_BOOT, onArc} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 on the DME arc',
	show: 'right',
	boot: GROUND_BOOT,
	steps: async u => {
		await onArc(u);
		await u.panel.selectPage('R', 'NAV 1');
	},
	fields: [
		{id: 'leg', find: {re: /D215I.OHKAR/, area: 'R', row: 0}},
		{id: 'cdi', find: {area: 'R', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
