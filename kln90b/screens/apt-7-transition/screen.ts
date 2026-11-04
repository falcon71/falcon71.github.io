import {defineScreen} from '../../generator/api.ts';
import {aptBoot, bangr9Transitions} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 7: choosing the transition of a departure',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: bangr9Transitions,
	fields: [
		{id: 'title', find: {re: /BANGR9-SID/, area: 'R', row: 0}},
		{id: 'heading', find: {re: /TRANSITION/, area: 'R'}},
		{id: 'arrie', find: {re: /1 ARRIE/, area: 'R'}},
		{id: 'pangl', find: {re: /2 PANGL/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
