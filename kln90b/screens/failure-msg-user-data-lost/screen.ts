import {defineScreen, place, wait} from '../../generator/api.ts';

// A power-on with the battery failed loses the user data: the messages after the self test and the data base page
defineScreen(import.meta.url, {
	title: 'MSG page after a loss of the user data',
	show: 'both',
	keepMessages: true,
	boot: {position: place('KSEA')},
	steps: async u => {
		u.props.failures.fail('battery');
		await u.panel.powerCycle();
		await u.panel.approveSelfTest();
		await wait(3000);
		await u.panel.msg();
	},
	fields: [
		{id: 'hardware', find: [{re: /RCVR HARDWARE ERROR:/, area: 'F', row: 0}, {re: /0008/, area: 'F', row: 1}]},
		{id: 'battery', find: [{re: /BATTERY LOW: SERVICE/, area: 'F', row: 2}, {re: /REQUIRED TO PREVENT/, area: 'F', row: 3}, {re: /LOSS OF USER DATA/, area: 'F', row: 4}]},
		{id: 'lost', find: {re: /USER DATA LOST/, area: 'F', row: 5}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
