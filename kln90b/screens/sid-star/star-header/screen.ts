import {adjustCourseIndicator, defineScreen, wait} from '../../../generator/api.ts';
import {apt7} from '../../shared/apt-7-8.ts';
import {PROCEDURES_BOOT} from '../states.ts';

// FPL 0 from KSEA to KBFI; CHINS5 with the transition YKM goes in front of KBFI
defineScreen(import.meta.url, {
	title: 'FPL 0 with a STAR',
	show: 'left',
	boot: PROCEDURES_BOOT,
	steps: async u => {
		await apt7(u, 'KBFI');
		await u.panel.cursor('R');
		await u.panel.cursorTo('R', '1 CHINS5');
		await u.panel.ent();
		await u.panel.cursorTo('R', '3 YKM');
		await u.panel.ent();
		await u.panel.ent();
		await wait(1000);
		await adjustCourseIndicator(u);
		await wait(5000);
		await adjustCourseIndicator(u);
	},
	fields: [
		{id: 'from', find: {re: /Á 1:KSEA/, area: 'L'}},
		{id: 'header', find: {re: /ÂCHINS5-Æ/, area: 'L'}},
		{id: 'to', find: {re: /À 2\.YKM/, area: 'L'}},
		{id: 'star', find: [{area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'last', find: {re: /7:KBFI/, area: 'L'}},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
