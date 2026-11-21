import {defineScreen, facility, place, savedFlightplan} from '../../../../generator/api.ts';
import {TRIP_ENTRIES} from '../states.ts';

const ROUTE = ['KPDX', 'KOLM', 'KSEA', 'KGEG'];

defineScreen(import.meta.url, {
	title: 'TRI 5 page',
	show: 'left',
	boot: {position: place('KPDX'), storage: {...TRIP_ENTRIES, ...savedFlightplan(0, ROUTE.map(facility))}},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 5');
	},
	fields: [
		{id: 'plan', find: {re: /FP.\d+ +\d+nm/, area: 'L', row: 0}},
		{id: 'route', find: {re: /\S+ *-\S+/, area: 'L', row: 1}},
		{id: 'gs', find: {re: /\d+kt/, area: 'L', row: 2}},
		{id: 'ete', find: {re: /\d+:\d+$/, area: 'L', row: 2}},
		{id: 'ff', find: {area: 'L', row: 3}},
		{id: 'res', find: {area: 'L', row: 4}},
		{id: 'freq', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /TRI 5/, area: 'S'}},
	],
});
