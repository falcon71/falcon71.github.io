import {defineScreen} from '../../../generator/api.ts';
import {showAirport} from '../../shared/apt-pages.ts';
import {tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'APT 4 of Friday Harbor',
	show: 'right',
	boot: tut1Boot,
	steps: async u => {
		await showAirport(u, 'KFHR');
		await u.panel.selectPage('R', 'APT 4');
	},
	fields: [
		{id: 'ident', find: {re: /KFHR/, area: 'R', row: 0}},
		{id: 'approach', find: {re: /APR .*/, area: 'R'}},
		{id: 'ctaf', find: {re: /CTAF .*/, area: 'R'}},
		{id: 'page', find: {re: /APT 4/, area: 'S'}},
	],
});
