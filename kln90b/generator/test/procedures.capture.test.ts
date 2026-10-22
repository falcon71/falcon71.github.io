import {describe, expect, it} from 'vitest';
import {
	AirportFacility, BitFlags, FixTypeFlags, ICAO, LegTurnDirection, LegType, RnavTypeFlags, RunwayUtils, UnitType,
	type Facility,
} from '@microsoft/msfs-sdk';
import {bootUnit, settle} from '../../../vendor/kln90b/test/harness/boot';
import {MemoryFacilityClient} from '../../../vendor/kln90b/test/harness/navdata/MemoryFacilityClient';
import {Screen} from '../../../vendor/kln90b/test/harness/render/screen';
import {DEFAULT_START} from '../../../vendor/kln90b/test/harness/sim/clock';
import {facilitiesOf, loadExtract, loadProcedures, place, type CifpExtract, type NavdataExtract} from '../lib/navdata.ts';
import {decimalYear, declination, screenModel, SCREEN_DEGREE} from '../lib/wmm.ts';

let all: Facility[] | undefined;
const facilities = () => all ??= facilitiesOf(loadExtract(), loadProcedures());
const apt = (ident: string) => facilities().find(f => f.icaoStruct.type === 'A' && f.icaoStruct.ident === ident) as AirportFacility;
const runwayName = (r: { runwayNumber: number; runwayDesignation: number }) => RunwayUtils.getRunwayNameString(r.runwayNumber, r.runwayDesignation);

describe('the procedures of the CIFP extract', () => {
	it('splits a runway transition for both parallels into one per runway, as the simulator does', () => {
		const chins = apt('KBFI').arrivals.find(p => p.name === 'CHINS5')!;
		expect(chins.runwayTransitions.map(runwayName).sort()).toEqual(['14L', '14R', '32L', '32R']);
		// Each runway gets legs of its own
		const [a, b] = chins.runwayTransitions.filter(r => r.runwayNumber === 14);
		expect(a.legs.map(l => l.fixIcaoStruct.ident)).toEqual(b.legs.map(l => l.fixIcaoStruct.ident));
		expect(a.legs[0] === b.legs[0]).toBe(false);
	});

	it('delivers a leg whose fix is the airport itself without a fix', () => {
		const last = apt('KBFI').arrivals.find(p => p.name === 'CHINS5')!.runwayTransitions[0].legs.at(-1)!;
		expect(last.type).toBe(LegType.VM);
		expect(last.fixIcaoStruct.ident.trim()).toBe('');
		expect(ICAO.isValueEmpty(last.fixIcaoStruct)).toBe(true);
	});

	it('keeps the runways of a departure that names them one by one', () => {
		const ykm7 = apt('KYKM').departures.find(p => p.name === 'YKM7')!;
		expect(ykm7.runwayTransitions.map(runwayName)).toEqual(['09', '22', '27']);
	});

	it('marks the IAF, IF, FAF and MAP of an approach and RNP AR approaches', () => {
		const r32ly = apt('KBFI').approaches.find(a => a.approachType === ApproachType.APPROACH_TYPE_RNAV && a.runway === '32L' && a.approachSuffix === 'Y')!;
		const humpp = r32ly.transitions.find(t => t.name === 'HUMPP')!;
		expect(BitFlags.isAll(humpp.legs[0].fixTypeFlags, FixTypeFlags.IAF)).toBe(true);
		expect(humpp.legs[1].fixTypeFlags).toBe(FixTypeFlags.None);
		expect(r32ly.finalLegs.map(l => l.fixTypeFlags)).toEqual([FixTypeFlags.IF, FixTypeFlags.FAF, FixTypeFlags.MAP]);
		expect(r32ly.rnpAr).toBe(false);
		const z = apt('KBFI').approaches.filter(a => a.approachSuffix === 'Z');
		expect(z.map(a => a.runway).sort()).toEqual(['14R', '32L']);
		expect(z.every(a => a.rnpAr)).toBe(true);
	});

	it('flags the RNAV levels an approach is authorized for, as published', () => {
		const rnav = (ident: string, runway: string, suffix: string) => apt(ident).approaches
			.find(a => a.approachType === ApproachType.APPROACH_TYPE_RNAV && a.runway === runway && a.approachSuffix === suffix)!.rnavTypeFlags;
		expect(rnav('KBFI', '32L', 'Y')).toBe(RnavTypeFlags.LPV | RnavTypeFlags.LNAVVNAV | RnavTypeFlags.LNAV);
		// LPV and LNAV/VNAV only: the unit lists no such approach
		expect(rnav('KBFI', '14R', 'Y')).toBe(RnavTypeFlags.LPV | RnavTypeFlags.LNAVVNAV);
		// A circling RNAV approach has no published levels and is LNAV
		expect(rnav('KDLS', '', 'A')).toBe(RnavTypeFlags.LNAV);
	});

	it('gives each approach its type, runway and suffix', () => {
		const types = (ident: string) => apt(ident).approaches
			.map(a => `${a.approachType} ${RunwayUtils.getRunwayNameString(a.runwayNumber, a.runwayDesignator)}${a.approachSuffix}`).sort();
		expect(types('KBFI')).toEqual([
			`${ApproachType.APPROACH_TYPE_ILS} 14R`, `${ApproachType.APPROACH_TYPE_ILS} 32L`,
			`${ApproachType.APPROACH_TYPE_LOCALIZER} 14R`, `${ApproachType.APPROACH_TYPE_LOCALIZER} 32L`,
			`${ApproachType.APPROACH_TYPE_RNAV} 14RY`, `${ApproachType.APPROACH_TYPE_RNAV} 14RZ`,
			`${ApproachType.APPROACH_TYPE_RNAV} 32LY`, `${ApproachType.APPROACH_TYPE_RNAV} 32LZ`,
		].sort());
		const vorA = apt('KEAT').approaches.find(a => a.approachSuffix === 'A')!;
		expect(vorA.approachType).toBe(ApproachType.APPROACH_TYPE_VOR);
		expect(vorA.runway).toBe('');
		expect(vorA.rnavTypeFlags).toBe(RnavTypeFlags.None);
	});

	it('gives a terminal waypoint that NASR lacks the ICAO of its airport', () => {
		// MACHU is a terminal waypoint of KPDX in region K2, in the waypoints of the CIFP extract
		const machu = facilities().filter(f => f.icaoStruct.ident === 'MACHU');
		expect(machu).toHaveLength(1);
		expect(machu[0].icaoStruct.type).toBe('W');
		expect(machu[0].icaoStruct.airport).toBe('KPDX');
		expect(machu[0].icaoStruct.region).toBe('K2');
		expect([machu[0].lat, machu[0].lon]).toEqual([41.524925, -122.57534167]);
	});

	it('takes a terminal waypoint that NASR has from NASR, without a second facility', () => {
		// COVOG is a terminal waypoint of KBFI that NASR files as a fix
		const r32ly = apt('KBFI').approaches.find(a => a.runway === '32L' && a.approachSuffix === 'Y')!;
		const covog = r32ly.transitions.find(t => t.name === 'HUMPP')!.legs[1].fixIcaoStruct;
		const found = facilities().filter(f => f.icaoStruct.ident === 'COVOG');
		expect(found).toHaveLength(1);
		expect(ICAO.valueEquals(found[0].icaoStruct, covog)).toBe(true);
		expect(covog.airport).toBe('');
	});

	it('ends an approach at the runway fix the simulator builds', () => {
		const map = apt('KBFI').approaches.find(a => a.runway === '32L' && a.approachSuffix === 'Y')!.finalLegs.at(-1)!;
		expect(map.fixIcaoStruct.type).toBe('R');
		expect(map.fixIcaoStruct.airport).toBe('KBFI');
		expect(map.fixIcaoStruct.ident).toBe('RW32L');
		expect(map.flyOver).toBe(true);
	});

	it('gives an arc its navaid, radius and radials, and a hold its turn', () => {
		const legs = apt('KAST').approaches.flatMap(a => [...a.transitions.flatMap(t => t.legs), ...a.finalLegs, ...a.missedLegs]);
		const arc = legs.find(l => l.type === LegType.AF && l.fixIcaoStruct.ident === 'ZINKY')!;
		expect(arc.originIcaoStruct.ident).toBe('AST');
		expect(arc.originIcaoStruct.type).toBe('V');
		expect(UnitType.METER.convertTo(arc.rho, UnitType.NMILE)).toBeCloseTo(19, 6);
		expect(arc.course).toBe(331.8);
		expect(arc.theta).toBe(81);
		expect(arc.turnDirection).toBe(LegTurnDirection.Right);
		const hold = apt('KBFI').approaches.find(a => a.runway === '32L' && a.approachSuffix === 'Y')!.missedLegs.at(-1)!;
		expect(hold.type).toBe(LegType.HM);
		expect(hold.course).toBe(313.8);
		expect(hold.turnDirection).toBe(LegTurnDirection.Right);
	});

	it('has every fix and arc navaid of every procedure in the facilities', () => {
		expect(new MemoryFacilityClient(facilities()).missingProcedureFixes()).toEqual([]);
	});
});

describe('the transcoding', () => {
	const nasr: NavdataExtract = {
		cycle: '2026-10-01', vors: [], ndbs: [], centers: [],
		airports: [{
			ident: 'KAAA', faaId: 'AAA', name: 'A', city: '', lat: 47, lon: -122, elevationFt: 0, towered: true, heliport: false,
			frequencies: [],
			runways: ['16L-34R', '16R-34L', '07-25', 'H1'].map(designation => ({designation, headingTrue: 160, lengthFt: 5000, surface: 'ASPH', lit: true, lat: 47, lon: -122})),
		}],
		fixes: [{ident: 'ALPHA', lat: 47.1, lon: -122, region: 'K1'}],
	};
	const leg = {type: 'TF', fix: {ident: 'ALPHA', region: 'K1', kind: 'fix'}};
	const cifp = (o: Partial<CifpExtract['airports'][number]>): CifpExtract => ({
		cycle: '2610', source: 'test', waypoints: [],
		airports: [{ident: 'KAAA', departures: [], arrivals: [], approaches: [], ...o}],
	});
	const airportOf = (p: CifpExtract) => facilitiesOf(nasr, p).find(f => f.icaoStruct.type === 'A') as AirportFacility;

	it('splits a transition for all runways into one per runway end', () => {
		const a = airportOf(cifp({departures: [{name: 'ONE1', runways: [{runway: 'ALL', legs: [leg]}], common: [], transitions: []}]}));
		expect(a.departures[0].runwayTransitions.map(runwayName)).toEqual(['16L', '34R', '16R', '34L', '07', '25']);
	});

	it('leaves out an approach type the unit does not know', () => {
		const final = [{...leg, type: 'IF'}];
		const a = airportOf(cifp({approaches: [
			{ident: 'J16L', type: 'J', runway: '16L', suffix: '', rnav: [], transitions: [], final, missed: []},
			{ident: 'N16L', type: 'N', runway: '16L', suffix: '', rnav: [], transitions: [], final, missed: []},
		]}));
		expect(a.approaches.map(x => x.approachType)).toEqual([ApproachType.APPROACH_TYPE_NDB]);
	});

	it('refuses a fix it cannot resolve, naming it', () => {
		expect(() => airportOf(cifp({arrivals: [{name: 'TWO2', runways: [], common: [{type: 'TF', fix: {ident: 'BRAVO', region: 'K1', kind: 'fix'}}], transitions: []}]})))
			.toThrow(/BRAVO/);
	});
});

it('lists the YKM7 departure on APT 7 of KYKM', async () => {
	const position = place('KYKM');
	const year = decimalYear(DEFAULT_START);
	const unit = await bootUnit({
		position, storage: {lastLatitude: position.lat, lastLongitude: position.lon}, defaultNavdata: false,
		facilities: facilities(), magvar: (lat, lon) => declination(screenModel(), lat, lon, year, 0, SCREEN_DEGREE),
	});
	await settle(unit);
	await unit.panel.selectPage('R', 'APT 1');
	await unit.panel.cursor('R');
	await unit.panel.enterIdent('R', 'KYKM');
	await unit.panel.cursor('R');
	await unit.panel.selectPage('R', 'APT 7');
	expect(Screen.read().text()).toContain('YKM7');
});
