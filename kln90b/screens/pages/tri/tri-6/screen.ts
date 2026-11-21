import {defineScreen, facility, place, savedFlightplan, wait} from '../../../../generator/api.ts';
import {TRIP_ENTRIES} from '../states.ts';

const ROUTE = ['KPDX', 'KOLM', 'KSEA', 'KGEG'];

defineScreen(import.meta.url, {
	title: 'TRI 6 page',
	show: 'left',
	boot: {position: place('KPDX'), storage: {...TRIP_ENTRIES, ...savedFlightplan(0, ROUTE.map(facility))}},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 6');
		await wait(3000);
	},
	fields: [
		{id: 'plan', find: {re: /FP.\d+/, area: 'L', row: 0}},
		{id: 'esa', find: {re: /ESA +\S+/, area: 'L', row: 1}},
		{id: 'area-1', find: [{area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'area-2', find: [{area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /TRI.6/, area: 'S'}},
	],
});
