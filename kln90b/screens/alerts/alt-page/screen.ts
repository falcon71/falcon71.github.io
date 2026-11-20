import {defineScreen} from '../../../generator/api.ts';
import {ALERTING, KSEA} from '../states.ts';

// ALERT turned on, with the warn altitude of 300 ft that the unit starts with; the page as the ALT button opens it
defineScreen(import.meta.url, {
	title: 'ALT page with altitude alerting on',
	show: 'left',
	boot: {position: KSEA, altitudeFt: 7500, panelXml: ALERTING, storage: {altAlertEnabled: true}},
	steps: async u => {
		await u.panel.alt();
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'baro', find: {re: /BARO:\S+/, area: 'L'}},
		{id: 'alert', find: {re: /ALERT: +ON ›/, area: 'L'}},
		{id: 'warn', find: {re: /WARN:\S+/, area: 'L'}},
		{id: 'page', find: {area: 'S', from: 0, to: 5}},
	],
});
