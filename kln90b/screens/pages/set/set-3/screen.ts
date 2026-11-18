import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 3 page with the default criteria',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 3');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'length', find: [{re: /MIN LENGTH:/, area: 'L'}, {area: 'L', row: 3}]},
		{id: 'surface', find: [{re: /SURFACE:/, area: 'L'}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /SET 3/, area: 'S'}},
	],
});
