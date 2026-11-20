import {defineScreen} from '../../../generator/api.ts';
import {cursorOnSidHeader, PROCEDURES_BOOT} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with the question to delete a SID',
	show: 'left',
	boot: PROCEDURES_BOOT,
	steps: async u => {
		await cursorOnSidHeader(u);
		await u.panel.clr();
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 0}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'delete', find: {re: /DELETE SID\?/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
