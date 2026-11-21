import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 0 with the cursor on the update button',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 0');
		await u.panel.cursor('L');
		await wait(250);
	},
	fields: [
		{id: 'title', find: [{area: 'F', row: 0}, {area: 'F', row: 1}]},
		{id: 'button', find: {re: /UPDATE PUBLISHED DB/, area: 'F'}},
		{id: 'prompt', find: {area: 'S', from: 14, to: 17}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
