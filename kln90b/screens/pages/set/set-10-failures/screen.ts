import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 10 page, cursor on FAILURES?',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 10');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'FAILURES?');
	},
	fields: [
		{id: 'gps', find: {re: /GPS: +\S+/, area: 'L'}},
		{id: 'failures', find: {re: /FAILURES\?/, area: 'L'}},
		{id: 'page', find: {re: /CRSR/, area: 'S'}},
	],
});
