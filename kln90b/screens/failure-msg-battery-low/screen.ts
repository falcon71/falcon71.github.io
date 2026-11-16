import {defineScreen, place, wait} from '../../generator/api.ts';

// The internal battery at 1 % of its charge, at or below the limit of the warning
defineScreen(import.meta.url, {
	title: 'MSG page with BATTERY LOW',
	show: 'both',
	keepMessages: true,
	boot: {position: place('KSEA'), storage: {batteryHealth: 1}},
	steps: async u => {
		await wait(8000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: [{area: 'F', row: 0}, {area: 'F', row: 1}, {area: 'F', row: 2}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
