import {adjustCourseIndicator, defineScreen, place, wait} from '../../../generator/api.ts';

// At KPDX, flying direct to KGEG, 242 NM away, in OBS mode
defineScreen(import.meta.url, {
	title: 'MSG page with OBS WPT > 200NM',
	show: 'both',
	keepMessages: true,
	boot: {position: place('KPDX')},
	steps: async u => {
		await u.panel.directTo('KGEG');
		await wait(15000);
		await adjustCourseIndicator(u);
		await u.panel.obsMode();
		await wait(2000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: {re: /OBS WPT > 200NM/, area: 'F'}},
		{id: 'mode', find: {re: /enr:\d+/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
