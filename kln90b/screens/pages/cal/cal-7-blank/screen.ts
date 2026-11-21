import {defineScreen, place} from '../../../../generator/api.ts';
import {CAL_7_BLANK_FIELDS} from '../fields.ts';

defineScreen(import.meta.url, {
	title: 'CAL 7 page without a waypoint',
	show: 'left',
	// No flight plan and no direct-to: the page has no destination to start from
	boot: {position: place('KBFI'), storage: {timezone: 12}},
	steps: async u => {
		await u.panel.selectPage('L', 'CAL 7');
	},
	fields: CAL_7_BLANK_FIELDS,
});
