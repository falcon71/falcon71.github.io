import {defineScreen} from '../../../../generator/api.ts';
import {flyIntoSpoofer, spooferBoot} from '../../../shared/spoofer.ts';

defineScreen(import.meta.url, {
	title: 'STA 1 page, spoofing, mixed',
	show: 'left',
	boot: spooferBoot,
	keepMessages: true,
	steps: async u => {
		await u.panel.selectPage('L', 'STA 1');
		await flyIntoSpoofer(u, 'mixed', 5);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'state', find: {re: /STATE +\S+( \S)?/, area: 'L', row: 0}},
		{id: 'list', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row}))},
		{id: 'page', find: {re: /STA.1/, area: 'S'}},
	],
});
