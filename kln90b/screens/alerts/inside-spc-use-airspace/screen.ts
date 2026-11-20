import {defineScreen, wait} from '../../../generator/api.ts';
import {INSIDE} from '../states.ts';

// The aircraft inside an area at 6,000 ft with the airspace alert on; the unit checks every 10 seconds
defineScreen(import.meta.url, {
	title: 'MSG page with INSIDE SPC USE AIRSPACE',
	show: 'both',
	keepMessages: true,
	boot: {position: INSIDE, altitudeFt: 6000, storage: {airspaceAlertEnabled: true}},
	steps: async u => {
		await wait(25000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: {area: 'F', row: 0}},
		{id: 'name', find: {re: /SEATTLE CLASS B/, area: 'F'}},
		{id: 'type', find: {re: /CL B/, area: 'F'}},
		{id: 'limits', find: {re: /BELOW \d+ft/, area: 'F'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
