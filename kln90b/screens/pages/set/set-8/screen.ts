import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 8 page with the airspace alert enabled',
	show: 'left',
	boot: {position: place('KSEA'), storage: {airspaceAlertEnabled: true}},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 8');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'enable', find: {area: 'L', row: 2}},
		{id: 'buffer', find: [{re: /VERT BUFFER/, area: 'L'}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /SET 8/, area: 'S'}},
	],
});
