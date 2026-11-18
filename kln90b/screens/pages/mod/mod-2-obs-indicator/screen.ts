import {defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../../../shared/kpdx-ksea.ts';

defineScreen(import.meta.url, {
	title: 'MOD 2 in OBS mode, the course read from the indicator',
	show: 'left',
	// The default installation: the unit reads the course indicator and cannot turn it
	boot: BOOT,
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		// The pilot turns the indicator, and the unit takes its course
		u.env.sim.set('Nav OBS:1', 'degrees', 340);
		await wait(2000);
	},
	fields: [
		{id: 'title', find: {re: /ACTIVE MODE/, area: 'L', row: 0}},
		{id: 'course', find: {re: /OBS.\S+°/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'page', find: {re: /MOD 2|CRSR/, area: 'S'}},
	],
});
