import {defineScreen, place, wait} from '../../generator/api.ts';
import {openFlr1} from '../../../vendor/kln90b/test/harness/render/flrPages.ts';

defineScreen(import.meta.url, {
	title: 'FLR 1 page, after the service',
	show: 'both',
	boot: {position: place('KSEA'), storage: {batteryHealth: 42.01}},
	steps: async u => {
		await openFlr1(u);
		await u.panel.cursor('L');
		await u.panel.cursorTo('L', 'SERVICE?');
		await u.panel.ent();
		await wait(1000);
		await u.panel.ent();
		await wait(300);
	},
	fields: [
		{id: 'mtbf', find: {re: /MTBF: +\S+/, area: 'L'}},
		{id: 'battery', find: {re: /BATTERY +\d+/, area: 'L'}},
		{id: 'service', find: {re: /SERVICE\?/, area: 'L'}},
		{id: 'page', find: {re: /FLR.1/, area: 'S'}},
		{id: 'right', find: {re: /SUP/, area: 'S'}},
		{id: 'serviced', find: {re: /SERVICED/, area: 'S'}},
	],
});
