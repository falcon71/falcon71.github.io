import {defineScreen, place, wait} from '../../../../generator/api.ts';
import {positionRows} from '../../../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'The NDB page of a user-defined NDB',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'NDB  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'HOM');
		// From the identifier to the frequency, which is below 1000 kHz, then the latitude and the longitude
		await u.panel.outer('R', 1);
		await u.panel.inner('R', 1);
		await u.panel.outer('R', 1);
		await u.panel.type('R', '3280');
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
		{id: 'freq', find: {re: /FREQ +[\d.]+/, area: 'R', row: 3}},
		{id: 'pos', find: positionRows('R')},
		{id: 'page', find: {re: /NDB/, area: 'S'}},
	],
});
