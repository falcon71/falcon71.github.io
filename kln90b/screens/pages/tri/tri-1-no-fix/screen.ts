import {defineScreen, place, wait} from '../../../../generator/api.ts';
import {TRIP_ENTRIES, enterWaypoint} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'TRI 1 page without a position',
	show: 'left',
	boot: {position: place('KSEA'), storage: TRIP_ENTRIES},
	// The loss of the position raises a message that persists; the left half shows only the page name of the status line
	keepMessages: true,
	steps: async u => {
		await u.panel.selectPage('L', 'TRI 1');
		await u.panel.cursor('L');
		await enterWaypoint(u, 'KPDX');
		await u.panel.cursor('L');
		// A cold start cannot be staged (the generator settles until the first fix), so the receiver is reset
		u.props.sensors.in.gps.reset();
		await wait(1500);
		await u.panel.readMessages();
		await u.panel.selectPage('L', 'TRI 0');
		await u.panel.selectPage('L', 'TRI 1');
	},
	fields: [
		{id: 'to', find: {re: /P\.POS-\S+/, area: 'L', row: 0}},
		{id: 'distance', find: {re: /-+nm/, area: 'L', row: 1}},
		{id: 'bearing', find: {re: /-+°/, area: 'L', row: 1}},
		{id: 'gs', find: {re: /\d+kt/, area: 'L', row: 2}},
		{id: 'ete', find: {re: /--:--$/, area: 'L', row: 2}},
		{id: 'ff', find: {area: 'L', row: 3}},
		{id: 'res', find: {area: 'L', row: 4}},
		{id: 'freq', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /TRI 1/, area: 'S'}},
	],
});
