import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 2 page',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 2');
	},
	fields: [
		{id: 'title', find: {re: /DATE\/TIME/, area: 'L'}},
		{id: 'date', find: {re: /\d\d [A-Z]{3} \d\d/, area: 'L', row: 2}},
		{id: 'time', find: {re: /\d\d:\d\d/, area: 'L', row: 3}},
		{id: 'seconds', find: {re: /(?<=:\d\d:)\d\d/, area: 'L', row: 3}},
		{id: 'zone', find: {re: /[A-Z]{3}$/, area: 'L', row: 3}},
		{id: 'zonename', find: {area: 'L', row: 4}},
		{id: 'page', find: {re: /SET 2/, area: 'S'}},
	],
});
