import {defineScreen, place} from '../../../../generator/api.ts';
import {TRIP_ENTRIES, enterRoute} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'TRI 3 page',
	show: 'left',
	boot: {position: place('KSEA'), storage: TRIP_ENTRIES},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 3');
		await enterRoute(u, 'KPAE', 'KBFI');
	},
	fields: [
		{id: 'route', find: {re: /\S+ *-\S+/, area: 'L', row: 0}},
		{id: 'distance', find: {re: /\d+nm/, area: 'L', row: 1}},
		{id: 'bearing', find: {re: /\d+°/, area: 'L', row: 1}},
		{id: 'gs', find: {re: /\d+kt/, area: 'L', row: 2}},
		{id: 'ete', find: {re: /\d+:\d+$/, area: 'L', row: 2}},
		{id: 'ff', find: {area: 'L', row: 3}},
		{id: 'res', find: {area: 'L', row: 4}},
		{id: 'freq', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /TRI 3/, area: 'S'}},
	],
});
