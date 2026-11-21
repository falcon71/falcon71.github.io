import {defineScreen, place} from '../../../../generator/api.ts';
import {TRIP_ENTRIES} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'TRI 5 page for a flight plan without waypoints',
	show: 'left',
	boot: {position: place('KPDX'), storage: {...TRIP_ENTRIES, tri5Fpl: 3}},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 5');
	},
	fields: [
		{id: 'plan', find: {re: /FP.\d+ +\S+/, area: 'L', row: 0}},
		{id: 'route', find: {area: 'L', row: 1}},
		{id: 'gs', find: {re: /\d+kt/, area: 'L', row: 2}},
		{id: 'ete', find: {re: /--:--$/, area: 'L', row: 2}},
		{id: 'ff', find: {area: 'L', row: 3}},
		{id: 'res', find: {area: 'L', row: 4}},
		{id: 'freq', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /TRI 5/, area: 'S'}},
	],
});
