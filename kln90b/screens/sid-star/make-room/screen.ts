import {defineScreen, facility, place, savedFlightplan} from '../../../generator/api.ts';
import {FULL_PLAN} from '../../shared/flight-plans.ts';
import {aptBoot, bangr9AddQuestion} from '../../shared/apt-7-8.ts';

// Thirty airports without KSEA, the aircraft on the last legs, so that the first waypoint is free to go. KSEA must be
// added with its SID, and the unit asks first whether to add it and then whether to make room for it.
const PLAN = FULL_PLAN.map(ident => ident === 'KSEA' ? 'KAWO' : ident);

defineScreen(import.meta.url, {
	title: 'The question to make room in FPL 0 for a procedure',
	show: 'left',
	boot: {...aptBoot('KEPH'), position: place('KEPH'), storage: savedFlightplan(0, PLAN.map(facility))},
	steps: async u => {
		await bangr9AddQuestion(u);
		await u.panel.ent();
	},
	fields: [
		{id: 'text', find: [{re: /DELETING/, area: 'L'}, {re: /WPT +1/, area: 'L'}, {re: /TO MAKE/, area: 'L'}, {re: /ROOM IN/, area: 'L'}, {re: /FLIGHTPLAN-/, area: 'L'}]},
		{id: 'continue', find: {re: /CONTINUE\?/, area: 'L'}},
		{id: 'crsr', find: {area: 'S', from: 0, to: 5}},
	],
});
