import {defineScreen} from '../../../../generator/api.ts';
import {flyAndAdjust} from '../../../shared/kpdx-ksea.ts';
import {BOOT_ENTERED, OTH_5_FIELDS} from '../../../shared/fuel-air-data.ts';

// The aircraft does not send the fuel on board: the colon after FOB, the cursor on it, 38 gallons entered
defineScreen(import.meta.url, {
	title: 'OTH 5 with the cursor on the fuel on board',
	show: 'left',
	boot: BOOT_ENTERED,
	steps: async u => {
		await flyAndAdjust(u);
		// The message that asks for the fuel on board is read
		await u.panel.readMessages();
		await u.panel.selectPage('L', 'OTH 5');
		await u.panel.cursor('L');
		await u.panel.inner('L', 38);
	},
	fields: OTH_5_FIELDS,
});
