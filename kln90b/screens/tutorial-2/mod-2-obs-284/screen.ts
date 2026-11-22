import {defineScreen} from '../../../generator/api.ts';
import {obsOnRadial, tut2Boot} from '../../shared/tut2.ts';

defineScreen(import.meta.url, {
	title: 'MOD 2 in OBS mode with the selected course 284°, before YKM',
	show: 'both',
	boot: tut2Boot,
	steps: obsOnRadial,
	fields: [
		{id: 'title', find: {re: /ACTIVE MODE/, area: 'L', row: 0}},
		{id: 'course', find: {re: /OBS.\S+°/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		// NAV 1 on the right
		{id: 'r-to', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /MOD 2/, area: 'S'}},
		{id: 'mode', find: {re: /enr:\d+/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
