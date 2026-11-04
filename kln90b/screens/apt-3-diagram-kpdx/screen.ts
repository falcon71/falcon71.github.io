import {defineScreen, place} from '../../generator/api.ts';
import {showAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 3 runway diagram',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await showAirport(u, 'KPDX');
		await u.panel.selectPage('R', 'APT 3');
	},
	fields: [
		{id: 'runways', find: {map: 'R', draw: /^plain /, many: true}},
		{id: 'labels', find: {map: 'R', draw: /^label /, many: true}},
		{id: 'page', find: {re: /APT\+3/, area: 'S'}},
	],
});
