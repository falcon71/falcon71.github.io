import {defineScreen} from '../../../generator/api.ts';
import {ALERTING, KSEA} from '../states.ts';

// ALERT turned on, with the warn altitude of 300 ft that the unit starts with, and a selected altitude of 9,000 ft on NAV 4;
// both pages as the ALT button opens them, each with its cursor on
defineScreen(import.meta.url, {
	title: 'ALT page with altitude alerting on, and NAV 4',
	show: 'both',
	boot: {position: KSEA, altitudeFt: 7500, panelXml: ALERTING, storage: {altAlertEnabled: true}},
	steps: async u => {
		await u.panel.alt();
		// The right cursor starts on the ten-thousands digit of the selected altitude
		await u.panel.outer('R', 1);
		await u.panel.inner('R', 9);
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'baro', find: {re: /BARO:\S+/, area: 'L'}},
		{id: 'alert', find: {re: /ALERT: +ON ›/, area: 'L'}},
		{id: 'warn', find: {re: /WARN:\S+/, area: 'L'}},
		{id: 'page', find: {area: 'S', from: 0, to: 5}},
		{id: 'vnav', find: {area: 'R', row: 0}},
		{id: 'ind', find: {re: /IND.\S+ft/, area: 'R'}},
		{id: 'sel', find: {re: /SEL:\S+ft/, area: 'R'}},
		{id: 'dist', find: {re: /:-\d+nm/, area: 'R'}},
		{id: 'angle', find: {re: /ANGLE: *\S+°/, area: 'R'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rpage', find: {area: 'S', from: 18, to: 23}},
	],
});
