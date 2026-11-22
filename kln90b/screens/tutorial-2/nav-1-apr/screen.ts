import {defineScreen} from '../../../generator/api.ts';
import {approachActive, tut2Boot} from '../../shared/tut2.ts';

// 1.8 NM before the FAF DUANE: the approach has just become active, MOD 1 on the left
defineScreen(import.meta.url, {
	title: 'MOD 1 and NAV 1 as the approach becomes active before DUANE',
	show: 'both',
	boot: tut2Boot,
	steps: approachActive,
	fields: [
		{id: 'title', find: {re: /ACTIVE MODE/, area: 'L', row: 0}},
		{id: 'leg', find: {re: /LEG/, area: 'L', row: 3}},
		{id: 'scale', find: {re: /CDI:\S+NM/, area: 'L'}},
		{id: 'r-leg', find: {area: 'R', row: 0}},
		{id: 'r-cdi', find: {area: 'R', row: 1}},
		{id: 'r-dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'r-gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'r-ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'r-brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /MOD 1/, area: 'S'}},
		{id: 'mode', find: {re: /apr-leg/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
