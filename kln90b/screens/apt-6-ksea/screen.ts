import {defineScreen, place} from '../../generator/api.ts';
import {showAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 6 page',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await showAirport(u, 'KSEA');
		await u.panel.selectPage('R', 'APT 6');
	},
	fields: [
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		{id: 'fuel', find: {re: /NO FUEL/, area: 'R'}},
		{id: 'oxygen', find: {re: /NO OXYGEN/, area: 'R'}},
		{id: 'fee', find: {re: /NO FEE INFO/, area: 'R'}},
		{id: 'page', find: {re: /APT 6/, area: 'S'}},
	],
});
