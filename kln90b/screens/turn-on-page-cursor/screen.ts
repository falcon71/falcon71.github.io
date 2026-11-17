import {defineScreen, place, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The Turn-On page with the second line open for entry',
	show: 'both',
	boot: {
		position: place('KSEA'),
		storage: {
			welcome1: 'CESSNA 172S SKYHAWK',
			welcome2: 'N172SP',
			welcome3: 'HOME BASE KSEA',
			welcome4: 'CHECK FUEL AND TRIM',
		},
	},
	steps: async u => {
		await u.panel.powerCycle();
		await wait(3000);
		await u.panel.cursor('L');
		await u.panel.outer('L', 1);
		// The first step of the inner knob opens the line with blank cells. N, then 1: the entry is partly written
		await u.panel.inner('L', 15);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', -10);
	},
	fields: [
		{id: 'title', find: {re: /GPS +ORS 20/, area: 'F'}},
		{id: 'copyright', find: {re: /©1994 ALLIEDSIGNAL INC/, area: 'F'}},
		{id: 'line1', find: {area: 'F', row: 2}},
		{id: 'line2', find: {area: 'F', row: 3}},
		{id: 'line3', find: {area: 'F', row: 4}},
		{id: 'line4', find: {area: 'F', row: 5}},
		{id: 'test', find: {re: /SELF TEST IN PROGRESS/, area: 'F'}},
	],
});
