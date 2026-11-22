import {defineScreen, NEAREST_SEARCH_WAIT_MS, wait} from '../../../generator/api.ts';
import {directToKtiw, flyAlong, tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'The nearest airport, 60 NM from Friday Harbor',
	show: 'right',
	boot: tut1Boot,
	steps: async u => {
		await directToKtiw(u);
		await flyAlong(u, 60);
		await wait(NEAREST_SEARCH_WAIT_MS);
		// MSG opens the message page, and ENT closes it and shows the nearest airport on the right
		await u.panel.msg();
		await u.panel.ent();
	},
	fields: [
		{id: 'ident', find: {area: 'R', row: 0, from: 1, to: 5}},
		{id: 'rank', find: {re: /nr \d/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'length', find: {re: /\d+'/, area: 'R', row: 3}},
		{id: 'surface', find: {re: /[A-Z]{3}/, area: 'R', row: 3}},
		{id: 'lighting', find: {area: 'R', row: 4, from: 0, to: 3}},
		{id: 'bearing', find: {re: /\d+°to/, area: 'R', row: 4}},
		{id: 'distance', find: {re: /[\d.]+nm/, area: 'R', row: 5}},
		{id: 'page', find: {re: /APT 1/, area: 'S'}},
	],
});
