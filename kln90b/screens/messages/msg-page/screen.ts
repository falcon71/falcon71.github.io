import {defineScreen, place, pointFrom, wait} from '../../../generator/api.ts';
import {DEFAULT_START} from '../../../../vendor/kln90b/test/harness/sim/clock.ts';
import {inhibitAllBut} from '../../../../vendor/kln90b/test/harness/gps.ts';

// A unit that was last used 30 NM north of KSEA a day ago and whose clock is off by an hour: the first position raises
// two messages. Then only three satellites are left, too few for RAIM, which raises a third that stays
const KSEA = place('KSEA');
const LAST = pointFrom(KSEA, 0, 30);
const DAY = 86_400_000;

defineScreen(import.meta.url, {
	title: 'MSG page with three messages',
	show: 'both',
	keepMessages: true,
	boot: {
		position: KSEA,
		storage: {
			fastGpsAcquisition: false, lastAlmanacDownload: DEFAULT_START.getTime() - DAY,
			lastLatitude: LAST.lat, lastLongitude: LAST.lon, clockOffset: 3_600_000,
		},
	},
	steps: async u => {
		await wait(5000);
		inhibitAllBut(u, 3);
		await wait(30_000);
		await u.panel.msg();
	},
	fields: [
		{id: 'raim', find: [{re: /RAIM NOT AVAILABLE/, area: 'F'}, {re: /CROSS CHECK POSITION/, area: 'F'}]},
		{id: 'time', find: [{re: /SYSTEM TIME UPDATED/, area: 'F'}, {re: /TO GPS TIME/, area: 'F'}]},
		{id: 'position', find: [{re: /POSITION DIFFERS FROM/, area: 'F'}, {re: /LAST POSITION BY >2nm/i, area: 'F'}]},
		{id: 'mode', find: {re: /enr-leg/, area: 'S'}},
		{id: 'msg', find: {re: /msg/, area: 'S'}},
	],
});
