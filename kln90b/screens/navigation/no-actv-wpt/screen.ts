import {defineScreen, place} from '../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'NO ACTV WPT after ENT on MOD 2',
	show: 'both',
	// FPL 0 is empty and there is no direct-to
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'NAV 1');
		await u.panel.selectPage('L', 'MOD 2');
		await u.panel.ent();
	},
	fields: [
		{id: 'title', find: [{re: /PRESS ENT/, area: 'L', row: 0}, {re: /TO ACTIVATE/, area: 'L', row: 1}]},
		{id: 'course', find: {re: /OBS.\S+°/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /MOD 2/, area: 'S'}},
		{id: 'msg', find: {re: /NO ACTV WPT/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
