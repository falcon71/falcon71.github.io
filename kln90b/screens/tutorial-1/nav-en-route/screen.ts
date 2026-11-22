import {defineScreen, NEAREST_SEARCH_WAIT_MS, wait} from '../../../generator/api.ts';
import {directToKtiw, flyAlong, tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'NAV 2 and NAV 1 en route, 40 NM from Friday Harbor',
	show: 'both',
	boot: tut1Boot,
	steps: async u => {
		await directToKtiw(u);
		await flyAlong(u, 40);
		// NAV 2 looks for the nearby VOR again every few seconds
		await wait(NEAREST_SEARCH_WAIT_MS);
	},
	fields: [
		{id: 'title', find: {re: /PRESENT POS/, area: 'L', row: 0}},
		{id: 'vor', find: {re: /\S{3} +\d{3}°fr/, area: 'L', row: 2}},
		{id: 'dist', find: {re: /\d+\.\dnm/, area: 'L', row: 3}},
		{id: 'lat', find: {area: 'L', row: 4}},
		{id: 'lon', find: {area: 'L', row: 5}},
		{id: 'from', find: {re: /d›/, area: 'R', row: 0}},
		{id: 'to', find: {re: /KTIW/, area: 'R', row: 0}},
		{id: 'cdi', find: {area: 'R', row: 1}},
		{id: 'dis', find: {re: /DIS +\S+/, area: 'R'}},
		{id: 'gs', find: {re: /GS +\S+/, area: 'R'}},
		{id: 'ete', find: {re: /ETE +\S+/, area: 'R'}},
		{id: 'brg', find: {re: /BRG +\S+/, area: 'R'}},
		{id: 'lpage', find: {re: /NAV 2/, area: 'S'}},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'rpage', find: {re: /NAV 1/, area: 'S'}},
	],
});
