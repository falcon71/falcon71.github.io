import {defineScreen, place, wait} from '../../../../generator/api.ts';
import {TRIP_ENTRIES, enterRoute} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'TRI 4 page',
	show: 'left',
	boot: {position: place('KSEA'), storage: TRIP_ENTRIES},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 3');
		await enterRoute(u, 'KGEG', 'KSFF');
		await u.panel.selectPage('L', 'TRI 4');
		await wait(3000);
	},
	fields: [
		{id: 'route', find: {re: /\S+ *-\S+/, area: 'L', row: 0}},
		{id: 'esa', find: {re: /ESA +\S+/, area: 'L', row: 1}},
		{id: 'area-1', find: [{area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'area-2', find: [{area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /TRI.4/, area: 'S'}},
	],
});
