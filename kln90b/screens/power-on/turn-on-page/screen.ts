import {defineScreen, place, wait} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The Turn-On page with its four lines written',
	show: 'both',
	boot: {
		position: place('KSEA'),
		storage: {
			welcome1: 'CLUB TRAINING AIRCRAFT',
			welcome2: 'AIRCRAFT NUMBER 2',
			welcome3: 'HOME BASE KSEA',
			welcome4: 'CHECK FUEL AND TRIM',
		},
	},
	steps: async u => {
		// The unit has been started with its engine running, which skips the Turn-On page, so this is the power cycle a pilot does
		await u.panel.powerCycle();
		await wait(3000);
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
