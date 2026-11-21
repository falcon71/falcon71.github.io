import {defineScreen, place} from '../../../../generator/api.ts';
import {CAL_4_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 4 page',
	show: 'left',
	// A descent of 600 fpm at 120 kt; the angle is the one the unit worked out from the two
	boot: {
		position: place('KSEA'),
		storage: {cal4GS: 120, cal4Fpm: 600, cal4Angle: 2.8},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 4');
	},
	fields: CAL_4_FIELDS,
});
