import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 0, the update page',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 0');
		await wait(250);
	},
	fields: [
		{id: 'title', find: [{area: 'F', row: 0}, {area: 'F', row: 1}]},
		{id: 'text', find: [{re: /O N   G R O U N D/, area: 'F'}, {re: /O N L Y/, area: 'F'}]},
		{id: 'key', find: {re: /KEY \w+/, area: 'F'}},
		{id: 'page', find: {re: /SET 0/, area: 'S'}},
	],
});
