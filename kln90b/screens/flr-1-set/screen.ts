import {defineScreen, place, wait} from '../../generator/api.ts';
import {openFlr1} from '../../../vendor/kln90b/test/harness/render/flrPages.ts';

defineScreen(import.meta.url, {
	title: 'FLR 1 page, random failures on and a worn battery',
	show: 'left',
	boot: {position: place('KSEA'), storage: {batteryHealth: 42.01}},
	steps: async u => {
		u.props.failures.setMtbfHours(15);
		await openFlr1(u);
	},
	fields: [
		{id: 'mtbf', find: {re: /MTBF: +\S+/, area: 'L'}},
		{id: 'battery', find: {re: /BATTERY +\d+/, area: 'L'}},
		{id: 'service', find: {re: /SERVICE\?/, area: 'L'}},
		{id: 'page', find: {re: /FLR.1/, area: 'S'}},
	],
});
