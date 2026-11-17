import {defineScreen, place, pointFrom} from '../../../../generator/api.ts';
import {userWaypointsOnOth3} from '../../../shared/user-waypoints.ts';

defineScreen(import.meta.url, {
	title: 'OTH 3, the list of user waypoints',
	show: 'left',
	boot: {position: pointFrom(place('KSEA'), 220, 8)},
	steps: u => userWaypointsOnOth3(u),
	fields: [
		{id: 'title', find: {re: /USER WPTS/, area: 'L'}},
		{id: 'idents', find: [
			{re: /HOME/, area: 'L'}, {re: /FIXA/, area: 'L'}, {re: /CAMP/, area: 'L'}, {re: /HOLD/, area: 'L'},
		]},
		{id: 'types', find: [
			{re: /(?<=  )A/, area: 'L', row: 1}, {re: /(?<=  )I/, area: 'L', row: 2},
			{re: /(?<=  )S/, area: 'L', row: 3}, {re: /(?<=  )S/, area: 'L', row: 4},
		]},
		{id: 'plan', find: {re: /3/, area: 'L', row: 4}},
		{id: 'page', find: {re: /OTH 3/, area: 'S'}},
	],
});
