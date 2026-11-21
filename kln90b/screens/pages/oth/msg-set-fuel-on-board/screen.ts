import {defineScreen, wait} from '../../../../generator/api.ts';
import {BOOT_ENTERED} from '../../../shared/fuel-air-data.ts';

// The aircraft does not send the fuel on board: the unit asks for it once the power-on pages are done
defineScreen(import.meta.url, {
	title: 'MSG page with SET FUEL ON BOARD',
	show: 'both',
	keepMessages: true,
	boot: BOOT_ENTERED,
	steps: async u => {
		await wait(8000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: [{area: 'F', row: 0}, {area: 'F', row: 1}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
