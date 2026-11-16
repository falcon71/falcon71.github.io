// A jammer of the weakest strength the simulation draws (one that would take the weakest satellite 100 NM away at
// 35,000 ft in line of sight), stored as an earlier session leaves it, 90 NM east of KSEA, and an aircraft at 3,000 ft
// above the ground that boots at KSEA, beyond the jammer's radio horizon of 79.7 NM, and flies east toward it. As the
// kln90b tests stage a jammer at a known site (test/render/failures/GpsJamming.test.ts)
import {place, pointFrom, wait} from '../../generator/api.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';
import {flyStraight, jammerAt} from '../../../vendor/kln90b/test/harness/gps';
import {jammerPowerDb} from '../../../vendor/kln90b/kln90b/GpsTransmitter';

export const JAM_AGL_FT = 3000;
const START = place('KSEA');
const JAMMER = pointFrom(START, 90, 90);

export const jammerBoot = {
	position: START,
	altitudeFt: JAM_AGL_FT,
	storage: jammerAt({lat: JAMMER.lat, lon: JAMMER.lon, powerDb: jammerPowerDb(100), refAglFt: 10_000}),
	simVars: [
		{name: 'PLANE ALT ABOVE GROUND', unit: 'feet', value: JAM_AGL_FT},
		{name: 'SIM ON GROUND', unit: 'bool', value: false},
	],
};

/** Flies east at 400 kt until the jammer is this far away, then holds there for the given seconds */
export async function flyToJammer(u: HeadlessUnit, distanceNm: number, holdS: number): Promise<void> {
	const seconds = Math.round((90 - distanceNm) / 400 * 3600);
	const at = await flyStraight(u, START, 90, 400, seconds, JAM_AGL_FT);
	await flyStraight(u, at, 90, 0, holdS, JAM_AGL_FT);
	await wait(0);
}
