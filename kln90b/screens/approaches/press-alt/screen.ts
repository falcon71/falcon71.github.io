import {adjustCourseIndicator, courseDeg, defineScreen, moveAircraft, pointFrom, wait} from '../../../generator/api.ts';
import {BOOT, CARRO, KSEA, loadRnav17} from '../states.ts';

// The approach loaded, then the aircraft within the 30 NM at which it arms; the message stays until the ALT page is shown
defineScreen(import.meta.url, {
	title: 'MSG page with PRESS ALT TO SET BARO',
	show: 'both',
	keepMessages: true,
	boot: BOOT,
	steps: async u => {
		await loadRnav17(u);
		const at = pointFrom(CARRO, courseDeg(CARRO, KSEA), 7);
		await moveAircraft(u, at, {groundspeedKt: 120, trackTrue: courseDeg(at, CARRO)});
		await wait(5000);
		await adjustCourseIndicator(u);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: {area: 'F', row: 0}},
		{id: 'mode', find: {re: /arm-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
