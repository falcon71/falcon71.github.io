import {defineScreen, place, wait} from '../../../../generator/api.ts';
import {openFlr3} from '../../../../../vendor/kln90b/test/harness/render/flrPages.ts';

defineScreen(import.meta.url, {
	title: 'FLR 3 page, failures that can be set',
	show: 'left',
	boot: {position: place('KSEA')},
	steps: async u => {
		await openFlr3(u);
	},
	fields: [
		{id: 'heading', find: {re: /INACTIVE/, area: 'L'}},
		{id: 'entry-1', find: {area: 'L', row: 1}},
		{id: 'entry-2', find: {area: 'L', row: 2}},
		{id: 'entry-3', find: {area: 'L', row: 3}},
		{id: 'entry-4', find: {area: 'L', row: 4}},
		{id: 'entry-5', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /FLR.3/, area: 'S'}},
	],
});
