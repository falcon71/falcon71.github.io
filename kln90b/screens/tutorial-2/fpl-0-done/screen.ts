import {defineScreen} from '../../../generator/api.ts';
import {cleanUpDuplicates, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'The finished FPL 0 of tutorial flight 2, from the start',
	show: 'left',
	boot: tut2Boot,
	steps: cleanUpDuplicates,
	fields: [
		{id: 'from', find: {re: /Á 1:KYKM/, area: 'L'}},
		{id: 'header', find: {re: /ÂYKM7-SID/, area: 'L'}},
		{id: 'to', find: {re: /À 2\.YKM/, area: 'L'}},
		{id: 'titon', find: {re: /3\.TITON/, area: 'L'}},
		{id: 'caded', find: {re: /4:CADED/, area: 'L'}},
		{id: 'last', find: {re: /15:KBFI/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
