import {defineScreen, HEADING_INPUT, moveAircraft, panelXml, place} from '../../../../generator/api.ts';
import {CAL_3_HEADING_FIELDS} from '../fields.ts';

const KSEA = place('KSEA');

defineScreen(import.meta.url, {
	title: 'CAL 3 page with a heading input',
	show: 'left',
	// The installation has a heading input: the heading is the aircraft's, 190 magnetic
	boot: {
		position: KSEA,
		panelXml: panelXml(HEADING_INPUT),
		simVars: [{name: 'PLANE HEADING DEGREES GYRO', unit: 'degrees', value: 190}],
		storage: {cal2Cas: 120, cal2TAT: 8, cal12IndicatedAltitude: 6500, cal12Barometer: 30.12},
	},
	steps: async u => {
		await moveAircraft(u, KSEA, {groundspeedKt: 126, trackTrue: 225});
		await u.panel.selectPage('L', 'CAL 3');
	},
	fields: CAL_3_HEADING_FIELDS,
});
