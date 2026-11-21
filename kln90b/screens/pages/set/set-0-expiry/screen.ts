import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 0 with the end of the database cycle',
	show: 'both',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 0');
		await u.panel.cursor('L');
		await u.panel.ent();
		await wait(250);
	},
	fields: [
		{id: 'title', find: {area: 'F', row: 0}},
		{id: 'region', find: {re: /INTERNATIONAL/, area: 'F'}},
		{id: 'status', find: {re: /DATA BASE EXPIRES/, area: 'F'}},
		{id: 'date', find: {re: /\d\d [A-Z]{3} \d\d/, area: 'F'}},
		{id: 'update', find: {re: /U P D A T E \?/, area: 'F'}},
		{id: 'prompt', find: {area: 'S', from: 14, to: 17}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
