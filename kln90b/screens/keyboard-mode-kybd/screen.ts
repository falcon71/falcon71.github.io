import {defineScreen, place} from '../../generator/api.ts';
import {positionRows} from '../shared/positions.ts';

defineScreen(import.meta.url, {
	title: 'APT 1 page in keyboard mode after typing KSEA',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('R', 'APT 1');
		await u.panel.cursor('R');
		await u.panel.enterIdent('R', 'KBFI');
		// The cursor is on the first character of the identifier when keyboard mode starts
		await u.panel.cursor('R');
		await u.panel.cursor('R');
		await u.panel.press('KLN90B_RightKeyboard_Toggle');
		for (const key of ['K', 'S', 'E', 'A']) {
			await u.panel.press(`KLN90B_Internal_Key:RIGHT:${key}`);
		}
	},
	fields: [
		// The cursor stays on the last character
		{id: 'ident', find: {re: /KSE/, area: 'R', row: 0}},
		{id: 'char', find: {re: /(?<=KSE)A/, area: 'R', row: 0}},
		{id: 'name', find: [{area: 'R', row: 1}, {area: 'R', row: 2}]},
		{id: 'pos', find: positionRows('R')},
		{id: 'class', find: {re: /CL B/, area: 'R'}},
		{id: 'kybd', find: {re: /KYBD/, area: 'S'}},
	],
});
