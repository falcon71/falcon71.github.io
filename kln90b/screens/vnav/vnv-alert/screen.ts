import {courseDeg, defineScreen, moveAircraft, wait} from '../../../generator/api.ts';
import {boot, fly, KSEA, planDescent, short} from '../vnav-state.ts';

// VNAV armed 45 NM short of KSEA, then NAV 1 on the left, and the aircraft 21.9 NM short of KSEA, about 80 seconds
// before the descent at 3.0° starts
defineScreen(import.meta.url, {
	title: 'MSG page with VNV ALERT',
	show: 'both',
	keepMessages: true,
	boot: boot(45),
	steps: async u => {
		await fly(u, 45);
		await planDescent(u);
		await u.panel.cursor('L');
		await u.panel.selectPage('L', 'NAV 1');
		const at = short(21.9);
		await moveAircraft(u, at, {groundspeedKt: 123, trackTrue: courseDeg(at, KSEA)});
		await wait(2000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: {area: 'F', row: 0}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
