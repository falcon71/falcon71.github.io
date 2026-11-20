import {defineScreen} from '../../../generator/api.ts';
import {BOOT, flyStart, rnav17Iafs} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'APT 8: the IAFs of RNAV 17 at KOLM',
	show: 'right',
	boot: BOOT,
	steps: async u => {
		await flyStart(u);
		await rnav17Iafs(u);
	},
	fields: [
		{id: 'title', find: {re: /R17-KOLM/, area: 'R', row: 0}},
		{id: 'label', find: {re: /IAF/, area: 'R'}},
		{id: 'carro', find: {re: /1 CARRO/, area: 'R'}},
		{id: 'iafs', find: [{re: /2 OLM/, area: 'R'}, {re: /3 SEA/, area: 'R'}]},
		{id: 'last', find: {re: /4 WONKU/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
