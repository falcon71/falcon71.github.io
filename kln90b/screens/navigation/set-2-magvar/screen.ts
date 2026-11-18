import {defineScreen, place, pointFrom, wait} from '../../../generator/api.ts';

// A position about 75.8° N, north of the area in which the unit knows the magnetic variation; no waypoint is shown
defineScreen(import.meta.url, {
	title: 'SET 2 without a magnetic variation',
	show: 'left',
	// MAGNETIC VAR INVALID stays in the list of messages while the unit has no variation
	keepMessages: true,
	boot: {position: pointFrom(place('KSEA'), 0, 1700)},
	steps: async u => {
		await wait(2000);
		await u.panel.selectPage('L', 'SET 2');
	},
	fields: [
		{id: 'title', find: {re: /DATE\/TIME/, area: 'L'}},
		{id: 'date', find: {re: /\d\d [A-Z]{3} \d\d/, area: 'L', row: 2}},
		{id: 'time', find: {re: /\d\d:\d\d/, area: 'L', row: 3}},
		{id: 'seconds', find: {re: /(?<=:\d\d:)\d\d/, area: 'L', row: 3}},
		{id: 'zone', find: {re: /[A-Z]{3}$/, area: 'L', row: 3}},
		{id: 'zonename', find: {area: 'L', row: 4}},
		{id: 'magvar', find: {re: /MAG V.+/, area: 'L', row: 5}},
		{id: 'page', find: {re: /SET 2/, area: 'S'}},
	],
});
