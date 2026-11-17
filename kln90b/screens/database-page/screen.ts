import {defineScreen, place, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The database page of a current database',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		// The unit has been started with its engine running, which skips the pages, so this is the power cycle a pilot does
		await u.panel.powerCycle();
		await wait(19000);
		await u.panel.cursorTo('R', 'APPROVE?');
		await u.panel.ent();
		await wait(1000);
	},
	fields: [
		{id: 'region', find: {re: /INTERNATIONAL/, area: 'F'}},
		{id: 'status', find: {re: /DATA BASE EXPIRES/, area: 'F'}},
		{id: 'date', find: {re: /\d\d [A-Z]{3} \d\d/, area: 'F'}},
		{id: 'acknowledge', find: {re: /ACKNOWLEDGE\?/, area: 'F'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'prompt', find: {area: 'S', from: 14, to: 17}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
