import {defineScreen, moveAircraft, wait} from '../../../generator/api.ts';
import {SOUTH} from '../states.ts';

// 8 NM south of the area, flying north at 90 kt: the track of the next 10 minutes, 15 NM, meets the area
defineScreen(import.meta.url, {
	title: 'MSG page with AIRSPACE ALERT',
	show: 'both',
	keepMessages: true,
	boot: {position: SOUTH, altitudeFt: 6000, storage: {airspaceAlertEnabled: true}},
	steps: async u => {
		await moveAircraft(u, SOUTH, {groundspeedKt: 90, trackTrue: 0});
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
