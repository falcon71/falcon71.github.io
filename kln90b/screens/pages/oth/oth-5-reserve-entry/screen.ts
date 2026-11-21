import {defineScreen} from '../../../../generator/api.ts';
import {flyAndAdjust, BOOT} from '../../../shared/kpdx-ksea.ts';
import {FOB_SENT, FUEL_SIM_VARS, OTH_5_FIELDS} from '../../../shared/fuel-air-data.ts';

// The aircraft sends the fuel on board, 38 gallons: the cursor starts on the reserve, and the units digit is set to 8
defineScreen(import.meta.url, {
	title: 'OTH 5 with the cursor on a digit of the fuel reserve',
	show: 'left',
	boot: {
		...BOOT,
		panelXml: FOB_SENT,
		simVars: [...FUEL_SIM_VARS, {name: 'FUEL TOTAL QUANTITY WEIGHT EX1', unit: 'pounds', value: 228}],
	},
	steps: async u => {
		await flyAndAdjust(u);
		await u.panel.selectPage('L', 'OTH 5');
		await u.panel.cursor('L');
		await u.panel.outer('L', 4);
		await u.panel.inner('L', 8);
	},
	fields: OTH_5_FIELDS,
});
