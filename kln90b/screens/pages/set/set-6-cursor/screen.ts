import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 6 page with the cursor on, turn anticipation disabled',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 6');
		await u.panel.cursor('L');
		// One step of the left inner knob changes the setting at once
		await u.panel.inner('L', 1);
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'value', find: {area: 'L', row: 3}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
