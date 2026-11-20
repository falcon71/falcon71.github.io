import {defineScreen, wait} from '../../../generator/api.ts';
import {boot, fly, planDescent} from '../vnav-state.ts';

// The descent of the screen vnav/nav-4-armed with NAV 1 on the right; then KPDX, the waypoint the aircraft comes
// from, entered as the VNAV waypoint on NAV 4 and approved
defineScreen(import.meta.url, {
	title: 'NAV 4 with INVALID VNV in the status line',
	show: 'both',
	boot: boot(45),
	steps: async u => {
		await fly(u, 45);
		await u.panel.selectPage('R', 'NAV 1');
		await planDescent(u);
		// From the tenths of the angle back to the waypoint
		await u.panel.outer('L', -4);
		await u.panel.enterIdent('L', 'KPDX');
		await u.panel.ent();
		await u.panel.ent();
		await wait(500);
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'ind', find: {re: /IND.\S+ft/, area: 'L', row: 2}},
		{id: 'sel', find: {re: /SEL:\S+ft/, area: 'L', row: 3}},
		{id: 'wpt', find: {area: 'L', row: 4, from: 0, to: 5}},
		{id: 'dist', find: {re: /:-\d+nm/, area: 'L', row: 4}},
		{id: 'angle', find: {re: /ANGLE:\S+°/, area: 'L', row: 5}},
		{id: 'from', find: {area: 'R', row: 0, from: 0, to: 5}},
		{id: 'arrow', find: {re: /›/, area: 'R', row: 0}},
		{id: 'to', find: {area: 'R', row: 0, from: 6, to: 11}},
		{id: 'cdi', find: {area: 'R', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
		{id: 'msg', find: {re: /INVALID VNV/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
