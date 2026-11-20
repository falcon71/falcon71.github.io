import {courseDeg, defineScreen, moveAircraft, wait, adjustCourseIndicator} from '../../../generator/api.ts';
import {armed, BOOT, BOSTO, onFinal, OPOYU} from '../states.ts';

// The approach armed, then disarmed with the GPS APR switch; a direct-to the FAF OPOYU from 2.5 NM before it
defineScreen(import.meta.url, {
	title: 'MSG page with ARM GPS APPROACH',
	show: 'both',
	keepMessages: true,
	boot: BOOT,
	steps: async u => {
		await armed(u);
		await u.panel.press('KLN90B_ApprArm_Push');
		await wait(2000);
		const at = onFinal(2.5);
		await moveAircraft(u, at, {groundspeedKt: 100, trackTrue: courseDeg(BOSTO, OPOYU)});
		await u.panel.directTo('OPOYU');
		await wait(3000);
		await adjustCourseIndicator(u);
		await wait(2000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: [{area: 'F', row: 0}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
