import {defineScreen, facility, place, savedFlightplan} from '../../../generator/api.ts';
import {FULL_PLAN} from '../../shared/flight-plans.ts';

defineScreen(import.meta.url, {
	title: 'The question to delete a waypoint to make room in FPL 0',
	show: 'left',
	// The aircraft is on the last leg, so that the first waypoint is free to go
	boot: {position: place('KEPH'), storage: savedFlightplan(0, FULL_PLAN.map(facility))},
	steps: async u => {
		await u.panel.selectPage('L', 'FPL 0');
		await u.panel.cursor('L');
		await u.panel.inner('L', 1);
	},
	fields: [
		{id: 'text', find: [{re: /DELETING/, area: 'L'}, {re: /WPT +1/, area: 'L'}, {re: /TO MAKE/, area: 'L'}, {re: /ROOM IN/, area: 'L'}, {re: /FLIGHTPLAN-/, area: 'L'}]},
		{id: 'continue', find: {re: /CONTINUE\?/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
