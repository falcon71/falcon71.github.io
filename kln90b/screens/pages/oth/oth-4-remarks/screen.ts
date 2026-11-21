import {defineScreen, place} from '../../../../generator/api.ts';
import {remarksOnOth4} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 4, the airports with remarks',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: u => remarksOnOth4(u),
	fields: [
		{id: 'title', find: {re: /APTS W\/RMKS/, area: 'L'}},
		{id: 'idents', find: [{re: /KBFI/, area: 'L'}, {re: /KPDX/, area: 'L'}, {re: /KTIW/, area: 'L'}]},
		{id: 'page', find: {re: /OTH 4/, area: 'S'}},
	],
});
