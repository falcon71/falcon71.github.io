import {defineScreen, place} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 2 with the time zone chosen',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 2');
		await u.panel.cursor('L');
		await u.panel.inner('L', 11);
	},
	fields: [
		{id: 'title', find: {re: /DATE\/TIME/, area: 'L'}},
		{id: 'date', find: {re: /\d\d [A-Z]{3} \d\d/, area: 'L', row: 2}},
		{id: 'time', find: {re: /\d\d:\d\d/, area: 'L', row: 3}},
		{id: 'seconds', find: {re: /(?<=:\d\d:)\d\d/, area: 'L', row: 3}},
		{id: 'zone', find: {re: /[A-Z]{3}$/, area: 'L', row: 3}},
		{id: 'zonename', find: {area: 'L', row: 4}},
		{id: 'cursor', find: {re: /CRSR/, area: 'S'}},
	],
});
