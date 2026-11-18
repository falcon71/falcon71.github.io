import {defineScreen, NEAREST_SEARCH_WAIT_MS, place, pointFrom, wait} from '../../../generator/api.ts';

// 800 NM west of KSEA, over the Pacific: the extract has no airport within 200 NM
defineScreen(import.meta.url, {
	title: 'MSG and ENT with no airport in the nearest list',
	show: 'both',
	keepMessages: true,
	boot: {position: pointFrom(place('KSEA'), 270, 800)},
	steps: async u => {
		await wait(NEAREST_SEARCH_WAIT_MS);
		await u.panel.msg();
		await u.panel.ent();
	},
	fields: [
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
