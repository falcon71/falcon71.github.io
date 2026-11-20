import {defineScreen, panelXml} from '../../../generator/api.ts';
import {ALERTING, KSEA} from '../states.ts';

// SET 7 set to millibars, with ALERT on
defineScreen(import.meta.url, {
	title: 'ALT page with the baro setting in millibars',
	show: 'left',
	boot: {position: KSEA, altitudeFt: 7500, panelXml: ALERTING, storage: {barounit: false, altAlertEnabled: true}},
	steps: async u => {
		await u.panel.alt();
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'baro', find: {re: /BARO:\S+/, area: 'L'}},
		{id: 'alert', find: {re: /ALERT: +\S+/, area: 'L'}},
		{id: 'warn', find: {re: /WARN:\S+/, area: 'L'}},
		{id: 'page', find: {area: 'S', from: 0, to: 5}},
	],
});
