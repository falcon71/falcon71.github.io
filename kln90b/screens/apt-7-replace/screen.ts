import {defineScreen} from '../../generator/api.ts';
import {aptBoot, bangr9ReplaceQuestion} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 7: replacing the departure in FPL 0',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: bangr9ReplaceQuestion,
	fields: [
		{id: 'title', find: {re: /BANGR9-SID/, area: 'R', row: 0}},
		{id: 'question', find: [
			{re: /PRESS ENT/, area: 'R'}, {re: /TO REPLACE/, area: 'R'}, {re: /EXISTING/, area: 'R'}, {re: /SID/, area: 'R', row: 4},
		]},
		{id: 'approve', find: {re: /APPROVE\?/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
