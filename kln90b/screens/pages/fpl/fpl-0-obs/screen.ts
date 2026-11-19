import {defineScreen, panelXml} from '../../../../generator/api.ts';
import {BOOT, flyAndAdjust} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'FPL 0 in OBS mode',
	show: 'left',
	boot: {...BOOT, panelXml: panelXml({'Input.ObsSource': 0})},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.obsMode();
		await u.panel.selectPage('L', 'FPL 0');
	},
	fields: [
		{id: 'first', find: {area: 'L', row: 1}},
		{id: 'to', find: {re: /› +2:KOLM/, area: 'L'}},
		{id: 'rest', find: [{area: 'L', row: 3}, {area: 'L', row: 4}]},
		{id: 'page', find: {re: /FPL 0/, area: 'S'}},
	],
});
