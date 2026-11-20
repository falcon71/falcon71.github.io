import {defineScreen} from '../../../generator/api.ts';
import {GROUND_BOOT, movedOnSuperNav5} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 after the DME arc waypoint was moved',
	show: 'left',
	boot: GROUND_BOOT,
	steps: async u => {
		await movedOnSuperNav5(u);
		await u.panel.selectPage('L', 'FPL 0');
	},
	fields: [
		{id: 'from', find: {re: /1:KYKM/, area: 'L'}},
		{id: 'header', find: {re: /GROMO4-SID/, area: 'L'}},
		{id: 'arc-waypoint', find: {re: /2\.D215I/, area: 'L'}},
		{id: 'end-fix', find: {re: /3\.OHKAR/, area: 'L'}},
		{id: 'papps', find: {re: /4\.PAPPS/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
