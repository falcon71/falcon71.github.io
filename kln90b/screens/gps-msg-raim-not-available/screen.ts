import {defineScreen, place, wait} from '../../generator/api.ts';
import {inhibitAllBut} from '../../../vendor/kln90b/test/harness/gps.ts';

// Three satellites and the altitude input are a position but only four measurements, too few for RAIM. The message
// follows after more than 10 s; the SDK takes up to 5 s to drop the other satellites
defineScreen(import.meta.url, {
	title: 'MSG page with RAIM NOT AVAILABLE',
	show: 'both',
	keepMessages: true,
	boot: {position: place('KSEA')},
	steps: async u => {
		inhibitAllBut(u, 3);
		await wait(30_000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: [{area: 'F', row: 0}, {area: 'F', row: 1}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
