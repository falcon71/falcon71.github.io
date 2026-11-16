import {defineScreen, place, wait} from '../../generator/api.ts';

// A failed antenna: the receiver reports it in its error word, which the unit shows as a message. The message stays on
// the MSG page while the failure lasts, so the status line keeps msg
defineScreen(import.meta.url, {
	title: 'MSG page with RCVR HARDWARE ERROR',
	show: 'both',
	keepMessages: true,
	boot: {position: place('KSEA')},
	steps: async u => {
		u.props.failures.fail('gpsAntenna');
		await wait(8000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: [{area: 'F', row: 0}, {area: 'F', row: 1}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
