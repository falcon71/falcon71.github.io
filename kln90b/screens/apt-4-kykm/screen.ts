import {defineScreen, place} from '../../generator/api.ts';
import {showAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 4 page',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await showAirport(u, 'KYKM');
		await u.panel.selectPage('R', 'APT 4');
	},
	fields: [
		{id: 'ident', find: {re: /KYKM/, area: 'R', row: 0}},
		{id: 'approach', find: {re: /APR .*/, area: 'R'}},
		{id: 'atis', find: {re: /ATIS .*/, area: 'R'}},
		{id: 'clearance', find: {re: /CLR .*/, area: 'R'}},
		{id: 'ctaf', find: {re: /CTAF .*/, area: 'R'}},
		{id: 'ground', find: {re: /GRND .*/, area: 'R'}},
		{id: 'page', find: {re: /APT\+4/, area: 'S'}},
	],
});
