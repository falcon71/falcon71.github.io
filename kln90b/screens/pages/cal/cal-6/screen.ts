import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'CAL 6 page',
	show: 'left',
	// The time zone of SET 2 is Pacific daylight time (zone 12 of the list); the unit starts at 12:00 UTC
	boot: {position: place('KSEA'), storage: {timezone: 12}},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 6');
	},
	fields: [
		{id: 'title', find: {re: /TIME CONV/, area: 'L', row: 0}},
		{id: 'time-top', find: {re: /\d\d:\d\d/, area: 'L', row: 1}},
		{id: 'zone-top', find: {re: /[A-Z]{3}(?= *$)/, area: 'L', row: 1}},
		{id: 'name-top', find: {area: 'L', row: 2}},
		{id: 'time-bottom', find: {re: /\d\d:\d\d/, area: 'L', row: 4}},
		{id: 'zone-bottom', find: {re: /[A-Z]{3}(?= *$)/, area: 'L', row: 4}},
		{id: 'name-bottom', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /CAL 6/, area: 'S'}},
	],
});
