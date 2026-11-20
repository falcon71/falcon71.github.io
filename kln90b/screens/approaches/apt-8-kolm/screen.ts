import {defineScreen} from '../../../generator/api.ts';
import {apt8} from '../../shared/apt-7-8.ts';
import {BOOT, flyStart} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'APT 8 with the approaches of KOLM',
	show: 'right',
	boot: BOOT,
	steps: async u => {
		await flyStart(u);
		await apt8(u, 'KOLM');
	},
	fields: [
		{id: 'ident', find: {re: /›KOLM IAP/, area: 'R', row: 0}},
		{id: 'approaches', find: [{re: /1 RNAV 17/, area: 'R'}, {re: /2 RNAV 35/, area: 'R'}]},
		{id: 'last', find: {re: /3 VOR  35/, area: 'R'}},
		{id: 'page', find: {re: /APT 8/, area: 'S'}},
	],
});
