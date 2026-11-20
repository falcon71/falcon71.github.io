import {APR_ARM_SWITCH, defineScreen, facility, panelXml, savedFlightplan} from '../../../generator/api.ts';
import {flyStart, rnav17Waypoints, START} from '../states.ts';

// FPL 0 holds only KSEA, so the approach brings its airport along
defineScreen(import.meta.url, {
	title: 'APT 8: the question to add the airport with the approach',
	show: 'right',
	boot: {position: START, panelXml: panelXml(APR_ARM_SWITCH), storage: savedFlightplan(0, [facility('KSEA')])},
	steps: async u => {
		await flyStart(u);
		await rnav17Waypoints(u);
		await u.panel.ent();
	},
	fields: [
		{id: 'title', find: {re: /R17-KOLM/, area: 'R', row: 0}},
		{id: 'question', find: [{area: 'R', row: 1}, {area: 'R', row: 2}, {area: 'R', row: 3}, {area: 'R', row: 4}]},
		{id: 'approve', find: {re: /APPROVE\?/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
