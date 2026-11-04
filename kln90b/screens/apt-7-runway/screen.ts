import {defineScreen} from '../../generator/api.ts';
import {aptBoot, bangr9Runways} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 7: choosing the runway of a departure',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: bangr9Runways,
	fields: [
		{id: 'title', find: {re: /BANGR9-SID/, area: 'R', row: 0}},
		{id: 'heading', find: {re: /RUNWAY/, area: 'R', row: 1}},
		// The list is scrolled: RW16C, the first entry, is above the page
		{id: 'runways', find: [{re: /2 RW16L/, area: 'R'}, {re: /3 RW16R/, area: 'R'}]},
		{id: 'rw34c', find: {re: /4 RW34C/, area: 'R'}},
		{id: 'last', find: {re: /6 RW34R/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
