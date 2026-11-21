import {defineScreen, place} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 8 page with the cursor on the hundreds of the vertical buffer',
	show: 'left',
	boot: {position: place('KSEA'), storage: {airspaceAlertEnabled: true}},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 8');
		await u.panel.cursor('L');
		// The first step of the outer knob from the enable field reaches the ten thousands, the third the hundreds
		await u.panel.outer('L', 3);
		// One step of the left inner knob changes the digit at once
		await u.panel.inner('L', 2);
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'enable', find: {area: 'L', row: 2}},
		{id: 'buffer', find: [{re: /VERT BUFFER/, area: 'L'}, {area: 'L', row: 5}]},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
