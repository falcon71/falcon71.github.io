import {defineScreen} from '../../../generator/api.ts';
import {positionRows} from '../../shared/positions.ts';
import {tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'APT 1 with KFHR entered',
	show: 'right',
	boot: tut1Boot,
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		// The cursor stays on, on the last character the knobs set
		await u.panel.enterIdent('R', 'KFHR');
	},
	fields: [
		{id: 'ident', find: {re: /KFH/, area: 'R', row: 0}},
		{id: 'char', find: {re: /(?<=KFH)R/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'pos', find: positionRows('R')},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
