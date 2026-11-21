import {defineScreen, place} from '../../../../generator/api.ts';
import {TRIP_ENTRIES} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'TRI 0 page',
	show: 'left',
	boot: {position: place('KSEA'), storage: TRIP_ENTRIES},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 0');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'tas', find: {re: /TAS: +\S+/, area: 'L'}},
		{id: 'wind-dir', find: {re: /WIND: +\S+/, area: 'L'}},
		{id: 'wind-speed', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /TRI 0/, area: 'S'}},
	],
});
