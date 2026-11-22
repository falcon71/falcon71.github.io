import {defineScreen} from '../../../generator/api.ts';
import {cleanUpDuplicates, cursorToEntry, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'The finished FPL 0 of tutorial flight 2, where the arrival meets the approach',
	show: 'left',
	boot: tut2Boot,
	steps: async u => {
		await cleanUpDuplicates(u);
		// The cursor scrolls FPL 0 down to the approach
		await u.panel.cursor('L');
		await cursorToEntry(u, '8 COVOG');
	},
	fields: [
		{id: 'chins', find: {re: /5\.CHINS/, area: 'L'}},
		{id: 'raddy', find: {re: /6\.RADDY/, area: 'L'}},
		{id: 'header', find: {re: /R32L-KBFI/, area: 'L'}},
		{id: 'iaf', find: {re: /7 HUMPPà/, area: 'L'}},
		{id: 'covog', find: {re: /8 COVOG/, area: 'L'}},
		{id: 'last', find: {re: /15:KBFI/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
