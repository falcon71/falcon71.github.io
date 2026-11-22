import {defineScreen} from '../../../generator/api.ts';
import {cursorToEntry, loadStar, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 after loading the arrival CHINS5',
	show: 'left',
	boot: tut2Boot,
	steps: async u => {
		await loadStar(u);
		// The cursor scrolls FPL 0 down to where the arrival begins
		await u.panel.cursor('L');
		await cursorToEntry(u, '9.RADDY');
	},
	fields: [
		{id: 'chins-enroute', find: {re: /6:CHINS/, area: 'L'}},
		{id: 'header', find: {re: /CHINS5-Æ/, area: 'L'}},
		{id: 'ykm', find: {re: /7\.YKM/, area: 'L'}},
		{id: 'chins-star', find: {re: /8\.CHINS/, area: 'L'}},
		{id: 'raddy', find: {re: /9\.RADDY/, area: 'L'}},
		{id: 'last', find: {re: /12:KBFI/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
