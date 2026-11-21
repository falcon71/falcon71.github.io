import {defineScreen, facility, place, savedFlightplan} from '../../../../generator/api.ts';
import {CAL_7_ENTRY_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 7 with the date being entered',
	show: 'left',
	boot: {
		position: place('KBFI'),
		storage: {...savedFlightplan(0, [facility('KBFI'), facility('KPDX')]), timezone: 12},
	},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 7');
		await u.panel.cursor('L');
		await u.panel.outer('L', 1);
		// The first step of the inner knob opens the entry, and the day takes its value from the next steps
		await u.panel.inner('L', 1);
		await u.panel.inner('L', 14);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 6);
	},
	fields: CAL_7_ENTRY_FIELDS,
});
