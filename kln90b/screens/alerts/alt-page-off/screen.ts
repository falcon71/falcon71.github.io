import {defineScreen, panelXml} from '../../../generator/api.ts';
import {ALERTING, KSEA} from '../states.ts';

// ALERT off, which is how the unit starts: the page has no WARN line
defineScreen(import.meta.url, {
	title: 'ALT page with altitude alerting off',
	show: 'left',
	boot: {position: KSEA, altitudeFt: 7500, panelXml: ALERTING},
	steps: async u => {
		await u.panel.alt();
	},
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'baro', find: {re: /BARO:\S+/, area: 'L'}},
		{id: 'alert', find: {re: /ALERT: +\S+/, area: 'L'}},
		{id: 'page', find: {area: 'S', from: 0, to: 5}},
	],
});
