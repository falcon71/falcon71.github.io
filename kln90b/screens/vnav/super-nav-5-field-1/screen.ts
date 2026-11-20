import {defineScreen, showSuperNav5} from '../../../generator/api.ts';
import {boot, fly, planDescent} from '../vnav-state.ts';

// The countdown of the screen vnav/nav-4-countdown on Super NAV 5, with VNAV chosen in field 1
defineScreen(import.meta.url, {
	title: 'Super NAV 5 counting down to the descent in field 1',
	show: 'both',
	boot: boot(30),
	steps: async u => {
		await fly(u, 30);
		await planDescent(u);
		await u.panel.cursor('L');
		await showSuperNav5(u);
		// The left CRSR puts the cursor on the range; the outer knob moves it up to field 1, and the inner knob chooses VNAV
		await u.panel.cursor('L');
		await u.panel.outer('L', -3);
		await u.panel.inner('L', 2);
		await u.panel.cursor('L');
	},
	fields: [
		{id: 'distance', find: {re: /\d+\.\d È/, area: 'F', row: 0}},
		{id: 'ident', find: {re: /KSEA/, area: 'F', row: 1}},
		{id: 'mode', find: {re: /Ê-Ë/, area: 'F', row: 2}},
		{id: 'groundspeed', find: {re: /\d+ É/, area: 'F', row: 3}},
		{id: 'vnav', find: {re: /V *\d*:\d\d/, area: 'F', row: 4}},
		{id: 'dtk', find: {re: /Ó\d{3}°/, area: 'F', row: 5}},
		{id: 'track', find: {re: /Ö\d{3}°/, area: 'F', row: 6}},
		{id: 'range', find: {re: /\d+(?= *$)/, area: 'F', row: 6}},
		{id: 'active-leg', find: {map: 'F', draw: /^arrow KPDX KSEA$/}},
		{id: 'waypoints', find: [{map: 'F', draw: /^icon @ /, many: true}, {map: 'F', draw: /^label /, many: true}]},
		{id: 'aircraft', find: {map: 'F', draw: /^icon \$ /}},
	],
});
