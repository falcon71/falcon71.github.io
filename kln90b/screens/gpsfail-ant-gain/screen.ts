import {defineScreen, place, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'STA 1 page, a lower antenna gain',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'STA 1');
		u.props.failures.fail('antennaGain');
		await wait(30_000);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'state', find: {re: /STATE +\S+( \S)?/, area: 'L', row: 0}},
		{id: 'list', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row}))},
		{id: 'page', find: {re: /STA.1/, area: 'S'}},
	],
});
