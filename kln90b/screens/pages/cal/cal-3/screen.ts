import {defineScreen, moveAircraft, place} from '../../../../generator/api.ts';
import {CAL_3_FIELDS} from '../fields.ts';

const KSEA = place('KSEA');

defineScreen(import.meta.url, {
	title: 'CAL 3 page without a heading input',
	show: 'left',
	// The true airspeed comes from CAL 2, which the way to CAL 3 passes: the inputs of CAL 2 are those of its screen
	boot: {
		position: KSEA,
		storage: {
			cal2Cas: 120, cal2TAT: 8, cal12IndicatedAltitude: 6500, cal12Barometer: 30.12, cal3HeadingMag: 190,
		},
	},
	steps: async u => {
		await moveAircraft(u, KSEA, {groundspeedKt: 126, trackTrue: 225});
		await u.panel.selectPage('L', 'CAL 3');
	},
	fields: CAL_3_FIELDS,
});
