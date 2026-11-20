import {defineScreen} from '../../../generator/api.ts';
import {cursorOnSidHeader, PROCEDURES_BOOT} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with the cursor on the header of a SID',
	show: 'left',
	boot: PROCEDURES_BOOT,
	steps: cursorOnSidHeader,
	fields: [
		{id: 'plan', find: [{area: 'L', row: 0}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'change', find: {re: /CHANGE SID\?/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
