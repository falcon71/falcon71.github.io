import {defineScreen} from '../../../generator/api.ts';
import {loadSid, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 after loading the departure YKM7',
	show: 'left',
	boot: tut2Boot,
	steps: loadSid,
	fields: [
		{id: 'from', find: {re: /Á 1:KYKM/, area: 'L'}},
		{id: 'header', find: {re: /ÂYKM7-SID/, area: 'L'}},
		{id: 'to', find: {re: /À 2\.YKM/, area: 'L'}},
		{id: 'titon-sid', find: {re: /3\.TITON/, area: 'L'}},
		{id: 'titon-enroute', find: {re: /4:TITON/, area: 'L'}},
		{id: 'last', find: {re: /7:KBFI/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
