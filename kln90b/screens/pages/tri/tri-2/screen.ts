import {defineScreen, place, wait} from '../../../../generator/api.ts';
import {TRIP_ENTRIES, enterWaypoint} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'TRI 2 page',
	show: 'left',
	boot: {position: place('KTIW'), storage: TRIP_ENTRIES},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 1');
		await u.panel.cursor('L');
		await enterWaypoint(u, 'KPWT');
		await u.panel.cursor('L');
		await u.panel.selectPage('L', 'TRI 2');
		await wait(3000);
	},
	fields: [
		{id: 'to', find: {re: /P\.POS-\S+/, area: 'L', row: 0}},
		{id: 'esa', find: {re: /ESA +\S+/, area: 'L', row: 1}},
		{id: 'area-1', find: [{area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'area-2', find: [{area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'page', find: {re: /TRI.2/, area: 'S'}},
	],
});
