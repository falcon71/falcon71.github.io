import {defineScreen, place, pointFrom, wait} from '../../../generator/api.ts';

// A position about 75.8° N, north of the area in which the unit knows the magnetic variation; no waypoint is shown
defineScreen(import.meta.url, {
	title: 'MSG page with MAGNETIC VAR INVALID',
	show: 'both',
	keepMessages: true,
	boot: {position: pointFrom(place('KSEA'), 0, 1700)},
	steps: async u => {
		await wait(2000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: [{re: /MAGNETIC VAR INVALID/, area: 'F'}, {re: /ALL DATA REFERENCED/, area: 'F'}, {re: /TO TRUE NORTH/, area: 'F'}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
