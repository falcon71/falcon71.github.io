import {defineScreen, place} from '../../../../generator/api.ts';
import {CAL_1_CURSOR_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 1 page with the cursor on the sign of the temperature',
	show: 'left',
	boot: {
		position: place('KSEA'),
		storage: {cal12IndicatedAltitude: 7500, cal12Barometer: 29.92, cal1SAT: -8},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 1');
		await u.panel.cursor('L');
		// Three cells of the indicated altitude and three of the baro setting come first
		await u.panel.outer('L', 6);
	},
	fields: CAL_1_CURSOR_FIELDS,
});
