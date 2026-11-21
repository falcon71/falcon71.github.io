import {defineScreen, place} from '../../../../generator/api.ts';
import {CAL_1_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 1 page with the baro setting in millibars',
	show: 'left',
	boot: {
		position: place('KSEA'),
		// 29.80" is 1,009 mb; barounit false is millibars
		storage: {barounit: false, cal12IndicatedAltitude: 4500, cal12Barometer: 29.80, cal1SAT: 12},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 1');
	},
	fields: CAL_1_FIELDS,
});
