import {defineScreen} from '../../../generator/api.ts';
import {enterRoute, tut2EmptyBoot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 with the en route waypoints of tutorial flight 2',
	show: 'left',
	boot: tut2EmptyBoot,
	steps: enterRoute,
	fields: [
		{id: 'from', find: {re: /Á 1:KYKM/, area: 'L'}},
		{id: 'to', find: {re: /À 2:TITON/, area: 'L'}},
		{id: 'enroute', find: [{re: /3:CADED/, area: 'L'}, {re: /4:CHINS/, area: 'L'}]},
		{id: 'last', find: {re: /5:KBFI/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
