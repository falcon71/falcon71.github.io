import {Screen} from '../../../../../vendor/kln90b/test/harness/render/screen';
import {defineScreen, NEAREST_SEARCH_WAIT_MS, place, pointFrom, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'The VOR page of a nearest VOR',
	show: 'right',
	// 8 NM east of the Paine VOR
	boot: {position: pointFrom(place('PAE'), 90, 8)},
	steps: async u => {
		await wait(NEAREST_SEARCH_WAIT_MS);
		await u.panel.selectPage('R', 'VOR  ');
		// Counterclockwise from the first VOR of the list leads to the end of the nearest list; the rank counts down from there
		await u.panel.scan();
		await u.panel.inner('R', -1);
		for (let i = 0; i < 9 && !Screen.read().rows('R')[0].includes('nr 1'); i++) await u.panel.inner('R', -1);
		await u.panel.scan();
	},
	fields: [
		{id: 'ident', find: {area: 'R', row: 0, from: 1, to: 5}},
		{id: 'dme', find: {re: /D/, area: 'R', row: 0}},
		{id: 'rank', find: {re: /nr \d/, area: 'R', row: 0}},
		{id: 'name', find: {area: 'R', row: 1}},
		{id: 'class', find: {re: /[A-Z]/, area: 'R', row: 2}},
		{id: 'freq', find: {re: /\d+\.\d\d/, area: 'R', row: 3}},
		{id: 'magvar', find: {re: /\d+°[EW]/, area: 'R', row: 3}},
		{id: 'bearing', find: {re: /\d+°to/, area: 'R', row: 4}},
		{id: 'distance', find: {re: /[\d.]+nm/, area: 'R', row: 5}},
		{id: 'page', find: {re: /VOR/, area: 'S'}},
	],
});
