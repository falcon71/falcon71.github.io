import {defineScreen, facility, place, savedFlightplan} from '../../../../generator/api.ts';
import {CAL_7_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 7 page for the destination of the flight plan',
	show: 'left',
	// On the ground at KBFI with a flight plan to KPDX, in Pacific daylight time; the unit starts on 01 JUN 2026
	boot: {
		position: place('KBFI'),
		storage: {...savedFlightplan(0, [facility('KBFI'), facility('KPDX')]), timezone: 12},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 7');
	},
	fields: CAL_7_FIELDS,
});
