import {defineScreen, place, pointFrom, wait} from '../../../../generator/api.ts';
import {userWaypointsOnOth3} from '../../../shared/user-waypoints.ts';

defineScreen(import.meta.url, {
	title: 'OTH 3 with the question to delete a user waypoint',
	show: 'both',
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: async u => {
		await userWaypointsOnOth3(u);
		await u.panel.cursor('L');
		// The cursor starts on the first waypoint; two steps of the outer knob move it to CAMP
		await u.panel.outer('L', 2);
		await u.panel.clr();
		// The waypoint page on the right looks for the reference VOR for about 8 seconds
		await wait(9000);
	},
	fields: [
		{id: 'title', find: {re: /USER WPTS/, area: 'L'}},
		{id: 'waypoints', find: [{re: /HOME +A/, area: 'L'}, {re: /FIXA +I/, area: 'L'}, {re: /HOLD +S +3/, area: 'L'}]},
		{id: 'question', find: {re: /DEL CAMP {2}\?/, area: 'L'}},
		{id: 'ident', find: {re: /CAMP/, area: 'R', row: 0}},
		{id: 'waypoint-page', find: [{area: 'R', row: 1}, {area: 'R', row: 2}, {area: 'R', row: 3}, {area: 'R', row: 4}, {area: 'R', row: 5}]},
		{id: 'ent', find: {re: /ent/, area: 'S'}},
		{id: 'page', find: {re: /SUP/, area: 'S'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
