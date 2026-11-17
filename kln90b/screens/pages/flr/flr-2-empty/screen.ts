import {defineScreen, place, wait} from '../../../../generator/api.ts';
import {openFlr2} from '../../../../../vendor/kln90b/test/harness/render/flrPages.ts';

defineScreen(import.meta.url, {
	title: 'FLR 2 page, no active failure',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await openFlr2(u);
	},
	fields: [
		{id: 'heading', find: {re: /ACTIVE/, area: 'L'}},
		{id: 'page', find: {re: /FLR.2/, area: 'S'}},
	],
});
