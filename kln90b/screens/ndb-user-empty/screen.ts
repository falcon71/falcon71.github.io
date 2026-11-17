import {defineScreen, place} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The NDB page for an identifier that no NDB has',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'NDB  ');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'HOM');
		// The cursor moves from the identifier to the frequency
		await u.panel.outer('R', 1);
	},
	fields: [
		{id: 'ident', find: {re: /HOM/, area: 'R', row: 0}},
		{id: 'freq', find: {re: /FREQ +_+\._/, area: 'R', row: 3}},
		{id: 'lat', find: {re: /_ __°__\.__'/, area: 'R', row: 4}},
		{id: 'lon', find: {re: /____°__\.__'/, area: 'R', row: 5}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
