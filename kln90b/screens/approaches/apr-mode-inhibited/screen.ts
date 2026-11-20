import {courseDeg, defineScreen, moveAircraft, wait} from '../../../generator/api.ts';
import {armedOnFinal, BOOT, BOSTO, onFinal, OPOYU} from '../states.ts';
import {GPSSatelliteState} from '@microsoft/msfs-sdk';

// RAIM is available now, but the prediction for the FAF and the MAP lacks satellites: every satellite but three is
// inhibited on the prediction only, so that the unit refuses to activate the approach
defineScreen(import.meta.url, {
	title: 'MSG page with RAIM NOT AVAILABLE APR MODE INHIBITED',
	show: 'both',
	keepMessages: true,
	boot: BOOT,
	steps: async u => {
		await armedOnFinal(u);
		const gps = u.props.sensors.in.gps;
		const inUse = gps.gpsSatComputer.getSatellites()
			.filter(s => s.state.get() === GPSSatelliteState.InUse || s.state.get() === GPSSatelliteState.InUseDiffApplied)
			.map(s => s.prn);
		const kept = inUse.slice(0, 3);
		for (const s of gps.gpsSatComputer.getSatellites()) {
			if (!kept.includes(s.prn)) gps.raimPrediction.setSatelliteInhibit(s.prn, true);
		}
		const at = onFinal(1.5);
		await moveAircraft(u, at, {groundspeedKt: 100, trackTrue: courseDeg(BOSTO, OPOYU)});
		await wait(3000);
		await u.panel.msg();
	},
	fields: [
		{id: 'message', find: [{area: 'F', row: 0}, {area: 'F', row: 1}, {area: 'F', row: 2}]},
		{id: 'mode', find: {re: /arm-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
