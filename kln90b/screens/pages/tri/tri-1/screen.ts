import {defineScreen, place, pointFrom, courseDeg} from '../../../../generator/api.ts';
import {TRIP_ENTRIES, enterWaypoint} from '../states.ts';

const KSEA = place('KSEA');
const KPDX = place('KPDX');
const POSITION = pointFrom(KSEA, courseDeg(KSEA, KPDX), 12);

defineScreen(import.meta.url, {
	title: 'TRI 1 page',
	show: 'left',
	boot: {position: POSITION, storage: TRIP_ENTRIES},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 1');
		await u.panel.cursor('L');
		await enterWaypoint(u, 'KPDX');
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'to', find: {re: /P\.POS-\S+/, area: 'L', row: 0}},
		{id: 'distance', find: {re: /\d+nm/, area: 'L', row: 1}},
		{id: 'bearing', find: {re: /\d+°/, area: 'L', row: 1}},
		{id: 'gs', find: {re: /\d+kt/, area: 'L', row: 2}},
		{id: 'ete', find: {re: /\d+:\d+$/, area: 'L', row: 2}},
		{id: 'ff', find: {area: 'L', row: 3}},
		{id: 'res', find: {area: 'L', row: 4}},
		{id: 'freq', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /TRI 1/, area: 'S'}},
	],
});
