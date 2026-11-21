import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 0 with LOADER NOT READY',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 0');
		await u.panel.cursor('L');
		await u.panel.ent();
		await wait(250);
		await u.panel.ent();
		await wait(250);
	},
	fields: [
		{id: 'title', find: [{area: 'F', row: 0}, {area: 'F', row: 1}]},
		{id: 'loader', find: [{re: /L O A D E R/, area: 'F'}, {re: /N O T   R E A D Y/, area: 'F'}]},
		{id: 'page', find: {re: /SET 0/, area: 'S'}},
	],
});
