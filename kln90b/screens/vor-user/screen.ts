import {defineScreen, place, wait} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'The VOR page of a user-defined VOR',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'VOR  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'HOM');
		// From the identifier to the frequency, the variation, the latitude and the longitude
		await u.panel.outer('R', 1);
		await u.panel.type('R', '11390');
		await u.panel.ent();
		await u.panel.type('R', '15E');
		await u.panel.ent();
		await u.panel.type('R', 'N4730000');
		await u.panel.ent();
		await u.panel.type('R', 'W1220000');
		await u.panel.ent();
		// The message that reminded of the longitude goes
		await wait(10000);
	},
	fields: [
		{id: 'ident', find: {re: /HOM/, area: 'R', row: 0}},
		{id: 'class', find: {re: /[A-Z]/, area: 'R', row: 2}},
		{id: 'freq', find: {re: /\d+\.\d\d/, area: 'R', row: 3}},
		{id: 'magvar', find: {re: /\d+°[EW]/, area: 'R', row: 3}},
		{id: 'pos', find: positionRows('R')},
		{id: 'page', find: {re: /VOR/, area: 'S'}},
	],
});
