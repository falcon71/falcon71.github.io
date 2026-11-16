import {defineScreen, place, wait} from '../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'STA 1 page, acquiring satellites',
	show: 'left',
	// The unit starts as a REAL start: it remembers its position and the almanac, but not the ephemeris data of the satellites
	boot: {position: place('KSEA'), seed: 12, storage: {fastGpsAcquisition: false}},
	steps: async u => {
		u.props.sensors.in.gps.gpsSatComputer.eraseCachedEphemeris();
		await u.panel.powerCycle();
		await wait(19000);
		await u.panel.approveSelfTest();
		await u.panel.selectPage('L', 'STA 1');
	},
	fields: [
		{id: 'state', find: {re: /STATE +\S+/, area: 'L', row: 0}},
		{id: 'sv', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row, from: 0, to: 4}))},
		{id: 'snr', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row, from: 4, to: 8}))},
		{id: 'ele', find: [1, 2, 3, 4, 5].map(row => ({area: 'L' as const, row, from: 8, to: 11}))},
		{id: 'page', find: {re: /STA.1/, area: 'S'}},
	],
});
