import {defineScreen, place} from '../../../../generator/api.ts';
import {CAL_2_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 2 page',
	show: 'left',
	// The climb of CAL 1: CAL 2 shares the indicated altitude and the baro setting
	boot: {
		position: place('KSEA'),
		storage: {cal2Cas: 120, cal2TAT: 8, cal12IndicatedAltitude: 6500, cal12Barometer: 30.12},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 2');
	},
	fields: CAL_2_FIELDS,
});
