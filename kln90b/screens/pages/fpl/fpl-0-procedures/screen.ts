import {defineScreen} from '../../../../generator/api.ts';
import {loadProcedures, PROCEDURES_BOOT} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with a SID, a STAR and an approach',
	show: 'left',
	boot: PROCEDURES_BOOT,
	steps: async u => {
		await loadProcedures(u);
	},
	fields: [
		{id: 'from', find: {re: /Á +1:KSEA/, area: 'L'}},
		{id: 'header', find: {re: /ÂBANGR9-SID/, area: 'L'}},
		{id: 'to', find: {re: /À 2\.NESOE/, area: 'L'}},
		{id: 'sid', find: [{area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'last', find: {re: / 21:KBFI/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
