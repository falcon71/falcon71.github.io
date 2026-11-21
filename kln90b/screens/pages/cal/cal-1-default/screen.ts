import {defineScreen, place} from '../../../../generator/api.ts';
import {CAL_1_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 1 page of a unit that has not been given a baro setting',
	show: 'left',
	// No storage of the CAL pages: the unit starts with no baro setting entered
	boot: {position: place('KSEA')},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 1');
	},
	fields: CAL_1_FIELDS,
});
