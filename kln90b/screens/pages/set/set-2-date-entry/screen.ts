import {defineScreen, place, wait} from '../../../../generator/api.ts';

defineScreen(import.meta.url, {
	title: 'SET 2 with the date being entered',
	show: 'left',
	// A REAL start without the ephemeris data of the satellites: the unit has no position for a while after the self test,
	// and SET 2 takes a date only then
	boot: {position: place('KSEA'), seed: 12, storage: {fastGpsAcquisition: false}},
	steps: async u => {
		u.props.sensors.in.gps.gpsSatComputer.eraseCachedEphemeris();
		await u.panel.powerCycle();
		await wait(19000);
		await u.panel.approveSelfTest();
		await u.panel.selectPage('L', 'SET 2');
		await u.panel.cursor('L');
		// The first step of the inner knob opens the entry, and the day takes its value from the next steps
		await u.panel.inner('L', 1);
		await u.panel.inner('L', 14);
		await u.panel.outer('L', 1);
		await u.panel.inner('L', 6);
	},
	fields: [
		{id: 'title', find: {re: /DATE\/TIME/, area: 'L'}},
		{id: 'date', find: {re: /\d\d [A-Z]{3} \d\d|\d\d [A-Z_]+ [\d_]+/, area: 'L', row: 2}},
		{id: 'time', find: {re: /\d\d:\d\d/, area: 'L', row: 3}},
		{id: 'seconds', find: {re: /(?<=:\d\d:)\d\d/, area: 'L', row: 3}},
		{id: 'zone', find: {re: /[A-Z]{3}$/, area: 'L', row: 3}},
		{id: 'zonename', find: {area: 'L', row: 4}},
		{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
	],
});
