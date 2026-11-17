import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 1 with the latitude being entered',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 1');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'N 47°26.99');
		// The first step of the inner knob opens the entry
		await u.panel.inner('L', 1);
	},
	fields: [
		{id: 'title', find: {re: /INIT POSN/, area: 'L'}},
		{id: 'wpt', find: {re: /WPT:/, area: 'L'}},
		// Latitude: the cells that are not entered yet show as underscores
		{id: 'lat', find: {re: /N __°__\.__'/, area: 'L'}},
		{id: 'lon', find: {re: /W\d+°[\d.]+'/, area: 'L'}},
		{id: 'speed', find: {area: 'L', row: 4}},
		{id: 'confirm', find: {re: /CONFIRM\?/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
