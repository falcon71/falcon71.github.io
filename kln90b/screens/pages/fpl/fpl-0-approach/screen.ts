import {defineScreen} from '../../../../generator/api.ts';
import {loadProcedures, PROCEDURES_BOOT} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with the cursor in an approach',
	show: 'left',
	boot: PROCEDURES_BOOT,
	steps: async u => {
		await loadProcedures(u);
		await u.panel.cursor('L');
		await u.panel.outer('L', 18);
	},
	fields: [
		{id: 'header', find: {re: /R32L-KBFI/, area: 'L'}},
		{id: 'start', find: [{area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'wpt', find: {re: /16 DUANE\S/, area: 'L'}},
		{id: 'last', find: {re: / 21:KBFI/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
