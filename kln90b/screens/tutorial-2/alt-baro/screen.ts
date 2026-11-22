import {defineScreen} from '../../../generator/api.ts';
import {altPageBeforeHumpp, tut2Boot} from '../../shared/tut2.ts';

// ALT pressed 1.5 NM before HUMPP on the vertical path: the ALT page on the left, NAV 4 with the active VNAV on the right
defineScreen(import.meta.url, {
	title: 'ALT page and NAV 4 for the baro setting before the approach',
	show: 'both',
	boot: tut2Boot,
	steps: altPageBeforeHumpp,
	fields: [
		{id: 'title', find: {area: 'L', row: 0}},
		{id: 'baro', find: {re: /BARO:\S+/, area: 'L'}},
		{id: 'alert', find: {re: /ALERT: +\S+/, area: 'L'}},
		{id: 'r-title', find: {area: 'R', row: 0}},
		{id: 'r-ind', find: {re: /IND.\S+ft/, area: 'R', row: 2}},
		{id: 'r-sel', find: {re: /SEL:\S+ft/, area: 'R', row: 3}},
		{id: 'r-wpt', find: {area: 'R', row: 4, from: 0, to: 5}},
		{id: 'r-dist', find: {re: /:-\d+nm/, area: 'R', row: 4}},
		{id: 'r-angle', find: {re: /ANGLE:\S+°/, area: 'R', row: 5}},
		{id: 'lcrsr', find: {area: 'S', from: 0, to: 5}},
		{id: 'mode', find: {re: /arm-leg/, area: 'S'}},
		{id: 'rcrsr', find: {area: 'S', from: 18, to: 23}},
	],
});
