import {defineScreen} from '../../../../generator/api.ts';
import {loadProcedures, PROCEDURES_BOOT} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with the cursor at the end of an approach',
	show: 'left',
	boot: PROCEDURES_BOOT,
	steps: async u => {
		await loadProcedures(u);
		await u.panel.cursor('L');
		await u.panel.outer('L', 22);
	},
	fields: [
		{id: 'map', find: {re: /17 RW32L\S/, area: 'L'}},
		{id: 'noseq', find: {re: /\*NO WPT SEQ/, area: 'L'}},
		{id: 'missed', find: [{area: 'L', row: 2}, {area: 'L', row: 3}]},
		{id: 'mahp', find: {re: /20 LOFAL\S/, area: 'L'}},
		{id: 'last', find: {re: / 21:KBFI/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
