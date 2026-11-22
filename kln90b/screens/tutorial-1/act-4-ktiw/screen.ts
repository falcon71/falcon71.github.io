import {defineScreen} from '../../../generator/api.ts';
import {directToKtiw, flyAlong, tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'ACT 4 of Tacoma Narrows, 10 NM out',
	show: 'right',
	boot: tut1Boot,
	steps: async u => {
		await directToKtiw(u);
		await flyAlong(u, 67);
		await u.panel.selectPage('R', 'ACT 4');
	},
	fields: [
		{id: 'arrow', find: {re: /›/, area: 'R', row: 0}},
		{id: 'number', find: {area: 'R', row: 0, from: 1, to: 4}},
		{id: 'ident', find: {re: /KTIW/, area: 'R', row: 0}},
		{id: 'type', find: {re: /A$/, area: 'R', row: 0}},
		{id: 'approach', find: {re: /APR .*/, area: 'R'}},
		{id: 'atis', find: {re: /ATIS .*/, area: 'R'}},
		{id: 'ctaf', find: {re: /CTAF .*/, area: 'R'}},
		{id: 'ground', find: {re: /GRND .*/, area: 'R'}},
		{id: 'tower', find: {re: /TWR .*/, area: 'R'}},
		{id: 'page', find: {re: /ACT\+4/, area: 'S'}},
	],
});
