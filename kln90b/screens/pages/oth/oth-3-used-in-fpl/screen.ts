import {defineScreen, place, pointFrom} from '../../../../generator/api.ts';
import {userWaypointsOnOth3} from '../../../shared/user-waypoints.ts';

defineScreen(import.meta.url, {
	title: 'OTH 3 refusing to delete a user waypoint of a flight plan',
	show: 'both',
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: async u => {
		await userWaypointsOnOth3(u);
		await u.panel.cursor('L');
		await u.panel.outer('L', 3);
		await u.panel.clr();
	},
	fields: [
		{id: 'title', find: {re: /USER WPTS/, area: 'L'}},
		{id: 'waypoints', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'message', find: {re: /USED IN FPL/, area: 'S'}},
		{id: 'right-page', find: [{area: 'R', row: 0}, {area: 'R', row: 1}, {area: 'R', row: 2}, {area: 'R', row: 3}, {area: 'R', row: 4}, {area: 'R', row: 5}]},
		{id: 'page', find: {re: /SUP/, area: 'S'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
