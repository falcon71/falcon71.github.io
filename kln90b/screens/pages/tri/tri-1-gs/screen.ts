import {courseDeg, defineScreen, place, pointFrom} from '../../../../generator/api.ts';
import {TRIP_ENTRIES, enterWaypoint} from '../states.ts';

const KSEA = place('KSEA');
const KPDX = place('KPDX');
const POSITION = pointFrom(KSEA, courseDeg(KSEA, KPDX), 12);

defineScreen(import.meta.url, {
	title: 'TRI 1 page with a groundspeed entered',
	show: 'left',
	boot: {position: POSITION, storage: TRIP_ENTRIES},
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 1');
		await u.panel.cursor('L');
		await enterWaypoint(u, 'KPDX');
		// The cursor already stands on the groundspeed after the approval, so the first outer step lands on the tens. The tens go from 1 to 0 and the units from 6 to 4
		await u.panel.outer('L', 1);
		await u.panel.inner('L', -1);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', -2);
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
		{id: 'cursor', find: {re: /CRSR/, area: 'S'}},
	],
});
