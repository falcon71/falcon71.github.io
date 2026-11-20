import {defineScreen, facility, place, savedFlightplan} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'D/T 1 beside an FPL 0 of one waypoint, without an active waypoint',
	show: 'both',
	// On the ground at KPDX with a flight plan of the single waypoint KSEA and no direct-to: the unit has no leg to fly
	boot: {
		position: place('KPDX'),
		storage: savedFlightplan(0, [facility('KSEA')]),
	},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.selectPage('R', 'D/T 1');
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 1}, {area: 'L', row: 2}]},
		{id: 'header', find: {re: /DIS +ETE/, area: 'R'}},
		{id: 'dashes', find: {area: 'R', row: 1}},
		{id: 'lname', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rname', find: {re: /D\/T 1/, area: 'S'}},
	],
});
