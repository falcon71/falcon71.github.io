import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 1 page',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 1');
	},
	fields: [
		{id: 'title', find: {re: /INIT POSN/, area: 'L'}},
		{id: 'wpt', find: {re: /WPT:/, area: 'L'}},
		{id: 'lat', find: {re: /[NS] ?\d+°[\d.]+'/, area: 'L'}},
		{id: 'lon', find: {re: /W\d+°[\d.]+'/, area: 'L'}},
		{id: 'speed', find: {area: 'L', row: 4}},
		{id: 'confirm', find: {re: /CONFIRM\?/, area: 'L'}},
		{id: 'page', find: {re: /SET 1/, area: 'S'}},
	],
});
