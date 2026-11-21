import {defineScreen, place, wait} from '../../../../generator/api.ts';
import {TRIP_ENTRIES, enterWaypoint} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'TRI 2 page with no airspace on the route',
	show: 'left',
	boot: {position: place('KYKM'), storage: TRIP_ENTRIES},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 1');
		await u.panel.cursor('L');
		await enterWaypoint(u, 'KELN');
		await u.panel.cursor('L');
		await u.panel.selectPage('L', 'TRI 2');
		await wait(3000);
	},
	fields: [
		{id: 'to', find: {re: /P\.POS-\S+/, area: 'L', row: 0}},
		{id: 'esa', find: {re: /ESA +\S+/, area: 'L', row: 1}},
		{id: 'page', find: {re: /TRI 2/, area: 'S'}},
	],
});
