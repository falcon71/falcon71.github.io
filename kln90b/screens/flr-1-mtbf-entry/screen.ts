import {defineScreen, place, wait} from '../../generator/api.ts';
import {openFlr1} from '../../../vendor/kln90b/test/harness/render/flrPages.ts';

defineScreen(import.meta.url, {
	title: 'FLR 1 page, entering the hours',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await openFlr1(u);
		await u.panel.cursor('L');
		await u.panel.inner('L', 1);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 2);
	},
	fields: [
		{id: 'mtbf', find: {re: /MTBF: +\S+/, area: 'L'}},
		{id: 'battery', find: {re: /BATTERY +\d+/, area: 'L'}},
		{id: 'service', find: {re: /SERVICE\?/, area: 'L'}},
		{id: 'page', find: {re: /CRSR/, area: 'S'}},
	],
});
