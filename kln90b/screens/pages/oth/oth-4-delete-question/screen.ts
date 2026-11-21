import {defineScreen, place} from '../../../../generator/api.ts';
import {remarksOnOth4} from '../common.ts';

defineScreen(import.meta.url, {
	title: 'OTH 4 with the question to delete remarks',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await remarksOnOth4(u);
		await u.panel.cursor('L');
		// The cursor starts on the first airport; one step of the outer knob moves it to KPDX
		await u.panel.outer('L', 1);
		await u.panel.clr();
	},
	fields: [
		{id: 'title', find: {re: /APTS W\/RMKS/, area: 'L'}},
		{id: 'airports', find: [{re: /KBFI/, area: 'L'}, {re: /KTIW/, area: 'L'}]},
		{id: 'question', find: {re: /DEL KPDX {2}\?/, area: 'L'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
