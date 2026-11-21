import {courseDeg, defineScreen, place, pointFrom} from '../../../../generator/api.ts';
import {TRIP_ENTRIES, enterWaypoint} from '../states.ts';

const KSEA = place('KSEA');
const KPDX = place('KPDX');
const POSITION = pointFrom(KSEA, courseDeg(KSEA, KPDX), 12);

// A true airspeed of 40 kt and a wind of 50 kt from just south of the course to the south: the headwind is larger than the airspeed
defineScreen(import.meta.url, {
	title: 'TRI 1 page with a wind that leaves no groundspeed',
	show: 'left',
	boot: {position: POSITION, storage: {...TRIP_ENTRIES, triTas: 40, triWindDirTrue: 190, triWindSpeed: 50}},
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
		{id: 'gs', find: {re: /-+kt/, area: 'L', row: 2}},
		{id: 'ete', find: {re: /--:--$/, area: 'L', row: 2}},
		{id: 'ff', find: {area: 'L', row: 3}},
		{id: 'res', find: {area: 'L', row: 4}},
		{id: 'freq', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /TRI 1/, area: 'S'}},
	],
});
