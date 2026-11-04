import {defineScreen, place} from '../../generator/api.ts';
import {showAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 5 page with a remark',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await showAirport(u, 'KTIW');
		await u.panel.selectPage('R', 'APT 5');
		await u.panel.cursor('R');
		await u.panel.outer('R', 4);
		await u.panel.type('R', 'BRUNCH');
		await u.panel.ent();
		await u.panel.cursor('R');
	},
	fields: [
		{id: 'ident', find: {re: /KTIW/, area: 'R', row: 0}},
		{id: 'title', find: {re: /REMARKS:/, area: 'R'}},
		{id: 'remark', find: {area: 'R', row: 2}},
		{id: 'page', find: {re: /APT 5/, area: 'S'}},
	],
});
