import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 4 page with the cursor on, the timer running while the power is on',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 4');
		await u.panel.cursor('L');
		// One step of the left inner knob changes the setting at once
		await u.panel.inner('L', 1);
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}, {area: 'L', row: 2}]},
		{id: 'run', find: [{re: /RUN WHEN/, area: 'L'}, {area: 'L', row: 5}]},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
