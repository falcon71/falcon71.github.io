import {defineScreen} from '../../generator/api.ts';
import {aptBoot, rnav34lIafs} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 8: choosing the IAF of an approach',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: rnav34lIafs,
	fields: [
		{id: 'title', find: {re: /R34L-KSEA/, area: 'R', row: 0}},
		{id: 'label', find: {re: /IAF/, area: 'R'}},
		{id: 'cidug', find: {re: /1 CIDUG/, area: 'R'}},
		{id: 'sondr', find: {re: /2 SONDR/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
