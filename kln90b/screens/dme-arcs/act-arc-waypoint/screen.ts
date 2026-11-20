import {defineScreen} from '../../../generator/api.ts';
import {GROUND_BOOT, loadGromo4} from '../states.ts';

defineScreen(import.meta.url, {
	title: 'The DME arc waypoint on its ACT page',
	show: 'right',
	boot: GROUND_BOOT,
	steps: async u => {
		await loadGromo4(u);
		await u.panel.selectPage('R', 'ACT');
	},
	fields: [
		{id: 'top', find: {re: /. 2 D247I S/, area: 'R', row: 0}},
		{id: 'ref', find: {re: /REF: +YKM/, area: 'R'}},
		{id: 'rad', find: {re: /RAD: \d{3}\.\d°/, area: 'R'}},
		{id: 'dis', find: {re: /DIS: +\d+\.\dnm/, area: 'R'}},
		{id: 'lat', find: {area: 'R', row: 4}},
		{id: 'lon', find: {area: 'R', row: 5}},
		{id: 'page', find: {re: /ACT/, area: 'S'}},
	],
});
