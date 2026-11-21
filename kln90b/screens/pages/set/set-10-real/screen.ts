import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 10 page with the cursor on the acquisition setting REAL',
	show: 'left',
	boot: {position: place('KSEA'), storage: {fastGpsAcquisition: false}},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 10');
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'gps', find: {re: /GPS: +\S+/, area: 'L'}},
		{id: 'failures', find: {re: /FAILURES\?/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
