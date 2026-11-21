import {defineScreen, place} from '../../../../generator/api.ts';
import {CAL_1_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 1 page',
	show: 'left',
	// A climb out of KSEA: 6,500 ft indicated at the baro setting 30.12", outside air 8 °C
	boot: {
		position: place('KSEA'),
		storage: {cal12IndicatedAltitude: 6500, cal12Barometer: 30.12, cal1SAT: 8},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 1');
	},
	fields: CAL_1_FIELDS,
});
