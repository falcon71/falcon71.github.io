import {defineScreen} from '../../../../generator/api.ts';
import {ALERTING, KSEA} from '../../../alerts/states.ts';

defineScreen(import.meta.url, {
	title: 'SET 9 page with the volume of the aural alarm',
	show: 'left',
	boot: {position: KSEA, panelXml: ALERTING},
	steps: async u => {
		await u.panel.selectPage('L', 'SET 9');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}, {area: 'L', row: 2}]},
		{id: 'volume', find: {area: 'L', row: 4}},
		{id: 'page', find: {re: /SET 9/, area: 'S'}},
	],
});
