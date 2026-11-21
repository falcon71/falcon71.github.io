import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'CAL 5 page',
	show: 'left',
	boot: {
		position: place('KSEA'),
		storage: {cal5TempC: 15, cal5TempF: 59, cal5SpeedKt: 120, cal5SpeedMph: 138.09},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 5');
	},
	fields: [
		{id: 'title', find: {re: /TEMP\/SPEED/, area: 'L', row: 0}},
		{id: 'celsius', find: {re: /\S+°C/, area: 'L', row: 1}},
		{id: 'fahrenheit', find: {re: /\S+°F/, area: 'L', row: 2}},
		{id: 'knots', find: {re: /\S+kt/, area: 'L', row: 4}},
		{id: 'mph', find: {re: /\S+mph/, area: 'L', row: 5}},
		{id: 'page', find: {re: /CAL 5/, area: 'S'}},
	],
});
