import {defineScreen} from '../../generator/api.ts';
import {aptBoot, bangr9AddQuestion} from '../shared/apt-7-8.ts';

defineScreen(import.meta.url, {
	title: 'APT 7: adding the airport and the departure to FPL 0',
	show: 'right',
	boot: aptBoot('KSEA'),
	steps: bangr9AddQuestion,
	fields: [
		{id: 'title', find: {re: /BANGR9-SID/, area: 'R', row: 0}},
		{id: 'question', find: [
			{re: /PRESS ENT/, area: 'R'}, {re: /TO ADD KSEA/, area: 'R'}, {re: /AND SID TO/, area: 'R'}, {re: /FPL 0/, area: 'R'},
		]},
		{id: 'approve', find: {re: /APPROVE\?/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
