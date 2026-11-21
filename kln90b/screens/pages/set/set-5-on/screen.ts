import {defineScreen} from '../../../../generator/api.ts';
import {ALERTING, KSEA} from '../../../alerts/states.ts';

defineScreen(import.meta.url, {
	title: 'SET 5 page with the height above airport alert on, the cursor on the offset height',
	show: 'left',
	boot: {position: KSEA, panelXml: ALERTING},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 5');
		await u.panel.cursor('L');
		// The alert turns on, and the offset height appears below it
		await u.panel.inner('L', 1);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 2);
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'enable', find: {area: 'L', row: 2}},
		{id: 'offset', find: [{re: /APT ELEV/, area: 'L'}, {area: 'L', row: 5}]},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
