import {defineScreen} from '../../generator/api.ts';
import {aptBoot, apt8} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 8 with the approaches of KSEA',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: u => apt8(u, 'KSEA'),
	fields: [
		{id: 'ident', find: {re: /KSEA IAP/, area: 'R', row: 0}},
		{id: 'approaches', find: [
			{re: /1 RNAV 16C/, area: 'R'}, {re: /2 RNAV 16L/, area: 'R'}, {re: /3 RNAV 16R/, area: 'R'}, {re: /4 RNAV 34C/, area: 'R'},
		]},
		// The last entry, which the bottom row keeps while the list is longer than the page
		{id: 'last', find: {re: /6 RNAV 34R/, area: 'R'}},
		{id: 'page', find: {re: /APT 8/, area: 'S'}},
	],
});
