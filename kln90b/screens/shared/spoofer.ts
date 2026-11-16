// A spoofer of the weakest strength the simulation draws (one that would capture the receiver 300 NM away at 35,000 ft in
// line of sight), stored as an earlier session at FL350 leaves it: 258 NM east of KSEA, its false position 80 NM from it,
// its false time 2 hours ahead. The aircraft boots at KSEA at 35,000 ft above the ground, outside the band in which the
// fake signals drown the real satellites, and flies at 450 kt on a track 60° off the spoofer's bearing, so that the
// band takes about two minutes: longer than a fake satellite takes to be in use. As the kln90b tests stage it
// (test/render/failures/GpsSpoofing.test.ts, "flying into a spoofer")
import {place, pointFrom} from '../../generator/api.ts';
import type {HeadlessUnit} from '../../../vendor/kln90b/test/harness/boot';
import {flyStraight, spooferAt} from '../../../vendor/kln90b/test/harness/gps';
import {spooferPowerDb} from '../../../vendor/kln90b/kln90b/GpsTransmitter';

const FL350_FT = 35_000;
const START = place('KSEA');
const SPOOFER = pointFrom(START, 90, 258);
const FALSE = pointFrom(SPOOFER, 20, 80);

export const spooferBoot = {
	position: START,
	altitudeFt: FL350_FT,
	storage: spooferAt({
		lat: SPOOFER.lat, lon: SPOOFER.lon, powerDb: spooferPowerDb(300), refAglFt: FL350_FT,
		falseLat: FALSE.lat, falseLon: FALSE.lon, falseAltFt: 0, shiftMs: 2 * 3600_000, clockM: 30_000,
	}),
	simVars: [
		{name: 'PLANE ALT ABOVE GROUND', unit: 'feet', value: FL350_FT},
		{name: 'SIM ON GROUND', unit: 'bool', value: false},
	],
};

/** The rows of the unit's solution that are fake satellites, and those that are real (as the kln90b test reads them) */
function rowsOf(u: HeadlessUnit): {fake: number, real: number} {
	const gps = u.props.sensors.in.gps as any;
	const prns: readonly number[] = gps.solutionPrns;
	const claims: Uint8Array = gps.solutionClaims;
	let fake = 0;
	for (let i = 0; i < prns.length; i++) {
		fake += claims[i];
	}
	return {fake, real: prns.length - fake};
}

/**
 * Flies toward the spoofer, a second at a time, until the unit is in the phase asked for: 'mixed', a position from real
 * and fake satellites together, or 'captured', a position from fake satellites alone
 */
export async function flyIntoSpoofer(u: HeadlessUnit, phase: 'mixed' | 'captured', afterS: number): Promise<void> {
	const gps = u.props.sensors.in.gps;
	let pos = START;
	for (let s = 1; s <= 900; s++) {
		pos = await flyStraight(u, pos, 150, 450, 1, FL350_FT);
		const rows = rowsOf(u);
		const reached = phase === 'mixed'
			? gps.isValid() && rows.fake > 0 && rows.real > 0
			: gps.isValid() && rows.real === 0 && rows.fake >= 4;
		if (reached) {
			await flyStraight(u, pos, 150, 450, afterS, FL350_FT);
			return;
		}
	}
	throw new Error(`the unit never reached the ${phase} phase`);
}
