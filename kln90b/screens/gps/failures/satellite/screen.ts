import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'STA 1 page, a faulty satellite',
	show: 'left',
	boot: {position: place('KSEA')},
	// RAIM POSITION ERROR stays listed on the message page while the error is detected: the status line keeps showing
	// msg, which this half of the screen does not show
	keepMessages: true,
	steps: async u => {
		await u.panel.selectPage('L', 'STA 1');
		u.props.failures.fail('faultySatellite');
		// Every ramp is complete after 300 s
		await wait(300_000);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'state', find: {re: /STATE +\S+( \S)?/, area: 'L', row: 0}},
		{id: 'list', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row}))},
		{id: 'page', find: {re: /STA.1/, area: 'S'}},
	],
});
