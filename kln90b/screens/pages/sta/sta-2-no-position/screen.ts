import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'STA 2 page, without a position',
	show: 'left',
	// A REAL start without the ephemeris data of the satellites: the unit has no position for a while after the self test
	boot: {position: place('KSEA'), seed: 12, storage: {fastGpsAcquisition: false}},
	steps: async u => {
		u.props.sensors.in.gps.gpsSatComputer.eraseCachedEphemeris();
		await u.panel.powerCycle();
		await wait(19000);
		await u.panel.approveSelfTest();
		await u.panel.selectPage('L', 'STA 2');
	},
	fields: [
		{id: 'title', find: [{area: 'L', row: 0}, {area: 'L', row: 1}]},
		{id: 'epe', find: {re: /-+NM/, area: 'L', row: 2}},
		{id: 'page', find: {re: /STA 2/, area: 'S'}},
	],
});
