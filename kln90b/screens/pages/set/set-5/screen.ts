import {defineScreen} from '../../../../generator/api.ts';
import {ALERTING, KSEA} from '../../../alerts/states.ts';

defineScreen(import.meta.url, {
	title: 'SET 5 page with the height above airport alert off',
	show: 'left',
	boot: {position: KSEA, panelXml: ALERTING},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 5');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'enable', find: {area: 'L', row: 2}},
		{id: 'page', find: {re: /SET 5/, area: 'S'}},
	],
});
