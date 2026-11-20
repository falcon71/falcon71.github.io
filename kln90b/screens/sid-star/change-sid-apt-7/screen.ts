import {defineScreen} from '../../../generator/api.ts';
import {airportOnApt1} from '../../shared/apt-7-8.ts';
import {loadBangr9, PROCEDURES_BOOT} from '../states.ts';

// The APT pages show KBFI before the ENT, so that APT 7 of KSEA shows where the airport came from
defineScreen(import.meta.url, {
	title: 'FPL 0 and APT 7 after CHANGE SID?',
	show: 'both',
	boot: PROCEDURES_BOOT,
	steps: async u => {
		await loadBangr9(u);
		await airportOnApt1(u, 'KBFI');
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'CHANGE SID?');
		await u.panel.ent();
	},
	fields: [
		{id: 'plan', find: [{area: 'L', row: 0}, {area: 'L', row: 1}, {area: 'L', row: 2}, {area: 'L', row: 3}, {area: 'L', row: 4}, {area: 'L', row: 5}]},
		{id: 'airport', find: {re: /KSEA/, area: 'R', row: 0}},
		{id: 'title', find: {re: /SELECT SID/, area: 'R'}},
		{id: 'list', find: [{area: 'R', row: 2}, {area: 'R', row: 3}, {area: 'R', row: 4}, {area: 'R', row: 5}]},
		{id: 'page-l', find: {re: /FPL 0/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'page-r', find: {re: /APT\+7/, area: 'S'}},
	],
});
