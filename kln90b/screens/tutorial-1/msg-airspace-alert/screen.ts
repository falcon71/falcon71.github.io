import {defineScreen, wait} from '../../../generator/api.ts';
import {directToKtiw, flyAlong, KFHR} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'MSG page with the airspace alert for the Seattle Class B',
	show: 'both',
	keepMessages: true,
	// The airspace alert is on, as it is on a unit that nobody has set up
	boot: {position: KFHR, storage: {airspaceAlertEnabled: true}},
	steps: async u => {
		await directToKtiw(u);
		await flyAlong(u, 40);
		// The unit checks the areas near the aircraft every few seconds
		await wait(25000);
		await u.panel.msg();
	},
	fields: [
		// Two messages of three lines each: the Seattle Class B is stored in parts with different ceilings
		{id: 'message', find: [{area: 'F', row: 0}, {area: 'F', row: 3}]},
		{id: 'name', find: [{re: /SEATTLE CLASS B/, area: 'F', row: 1}, {re: /SEATTLE CLASS B/, area: 'F', row: 4}]},
		{id: 'type', find: [{re: /CL B/, area: 'F', row: 1}, {re: /CL B/, area: 'F', row: 4}]},
		{id: 'limits', find: [{re: /BELOW \d+ft/, area: 'F', row: 2}, {re: /BELOW \d+ft/, area: 'F', row: 5}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
