import {defineScreen, place} from '../../generator/api.ts';
import {showAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 3 runway list',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await showAirport(u, 'KSEA');
		await u.panel.selectPage('R', 'APT 3');
		// The diagram is the first of the subpages
		await u.panel.inner('R', 1);
	},
	fields: [
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		{id: 'designations', find: [{re: /\d\d.\/\d\d./, area: 'R', row: 2}, {re: /\d\d.\/\d\d./, area: 'R', row: 4}]},
		{id: 'lighting', find: [{re: /L\w* *$/, area: 'R', row: 2}, {re: /L\w* *$/, area: 'R', row: 4}]},
		{id: 'length', find: [{re: /\d+'/, area: 'R', row: 3}, {re: /\d+'/, area: 'R', row: 5}]},
		{id: 'surface', find: [{re: /[A-Z]{3}$/, area: 'R', row: 3}, {re: /[A-Z]{3}$/, area: 'R', row: 5}]},
		{id: 'page', find: {re: /APT\+3/, area: 'S'}},
	],
});
