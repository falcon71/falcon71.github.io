import {defineScreen, NEAREST_SEARCH_WAIT_MS, wait} from '../../../generator/api.ts';
import {tut1Boot} from '../../shared/tut1.ts';

defineScreen(import.meta.url, {
	title: 'NAV 2 at Friday Harbor after the power-on pages',
	show: 'left',
	boot: tut1Boot,
	steps: async u => {
		// The whole power-on sequence, as a pilot in a cold and dark aircraft meets it
		await u.panel.powerCycle({offSeconds: 600});
		await u.panel.approveSelfTest();
		// The search for the nearby VOR answers a few seconds after the page opens
		await wait(NEAREST_SEARCH_WAIT_MS);
	},
	fields: [
		{id: 'title', find: {re: /PRESENT POS/, area: 'L', row: 0}},
		{id: 'vor', find: {re: /\S{3} +\d{3}°fr/, area: 'L', row: 2}},
		{id: 'dist', find: {re: /\d+\.\dnm/, area: 'L', row: 3}},
		{id: 'lat', find: {area: 'L', row: 4}},
		{id: 'lon', find: {area: 'L', row: 5}},
		{id: 'page', find: {re: /NAV 2/, area: 'S'}},
	],
});
