import {defineScreen, place, wait} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The database page of an expired database',
	show: 'both',
	// A date after the end of the cycle of the database, which is how the unit finds the database expired
	boot: {position: place('KSEA'), start: new Date('2026-07-01T12:00:00Z')},
	steps: async u => {
		await u.panel.powerCycle();
		await wait(19000);
		await u.panel.cursorTo('R', 'APPROVE?');
		await u.panel.ent();
		await wait(1000);
	},
	fields: [
		{id: 'region', find: {re: /INTERNATIONAL/, area: 'F'}},
		{id: 'status', find: {re: /DATA BASE EXPIRED/, area: 'F'}},
		{id: 'date', find: {re: /\d\d [A-Z]{3} \d\d/, area: 'F'}},
		{id: 'warning', find: [{re: /ALL DATA MUST BE/, area: 'F'}, {re: /CONFIRMED BEFORE USE/, area: 'F'}]},
		{id: 'acknowledge', find: {re: /ACKNOWLEDGE\?/, area: 'F'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'prompt', find: {area: 'S', from: 14, to: 17}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
