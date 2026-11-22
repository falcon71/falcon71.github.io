import {defineScreen} from '../../../generator/api.ts';
import {directToKtiw, tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'NAV 1 after the direct-to, on the ground at Friday Harbor',
	show: 'right',
	boot: tut1Boot,
	steps: async u => {
		await directToKtiw(u);
	},
	fields: [
		{id: 'from', find: {re: /d›/, area: 'R', row: 0}},
		{id: 'to', find: {re: /KTIW/, area: 'R', row: 0}},
		{id: 'cdi', find: {area: 'R', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'page', find: {re: /NAV 1/, area: 'S'}},
	],
});
