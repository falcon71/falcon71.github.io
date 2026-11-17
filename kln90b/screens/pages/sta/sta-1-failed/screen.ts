import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'STA 1 page, failed receiver',
	show: 'left',
	boot: {position: place('KSEA')},
	// A failed receiver leaves its message on the message page, which stays listed after it was read: the status line
	// keeps showing msg, which this half of the screen does not show
	keepMessages: true,
	steps: async u => {
		await u.panel.selectPage('L', 'STA 1');
		u.props.failures.fail('gpsReceiver');
		await wait(8000);
		await u.panel.readMessages();
	},
	fields: [
		{id: 'state', find: {re: /STATE +\S+/, area: 'L', row: 0}},
		{id: 'header', find: {area: 'L', row: 1}},
		{id: 'page', find: {re: /STA.1/, area: 'S'}},
	],
});
