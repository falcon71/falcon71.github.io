import {defineScreen, place, wait} from '../../generator/api.ts';
import {answerTimezone} from '../../../vendor/kln90b/test/harness/timezone';
import {showAirport} from '../shared/apt-pages.ts';

defineScreen(import.meta.url, {
	title: 'APT 2 page',
	show: 'right',
	boot: {position: place('KSEA')},
	steps: async u => {
		// The simulator answers with the time zone of KSEA: 8 hours behind UTC, with daylight time from April to October
		answerTimezone(-8, [3, 4, 5, 6, 7, 8, 9]);
		await showAirport(u, 'KSEA');
		await u.panel.selectPage('R', 'APT 2');
		await wait(1000);
	},
	fields: [
		{id: 'ident', find: {re: /KSEA/, area: 'R', row: 0}},
		{id: 'city', find: {area: 'R', row: 1}},
		{id: 'elevation', find: {re: /ELV +\d+ft/, area: 'R'}},
		{id: 'zone', find: {re: /Z[-+]\d\d.*/, area: 'R', row: 4}},
		{id: 'approach', find: {re: /ILS/, area: 'R', row: 5}},
		{id: 'page', find: {re: /APT 2/, area: 'S'}},
	],
});
