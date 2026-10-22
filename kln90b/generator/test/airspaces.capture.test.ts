import {describe, expect, it} from 'vitest';
import {BoundaryAltitudeType, BoundaryType, UnitType} from '@microsoft/msfs-sdk';
import {screenStorage} from '../lib/generate.ts';
import {airspacesOf, loadAirspaces, loadExtract} from '../lib/navdata.ts';

const boundaries = () => airspacesOf(loadAirspaces(), loadExtract());
const feet = (meters: number) => Math.round(UnitType.METER.convertTo(meters, UnitType.FOOT));

describe('the airspaces of the extract', () => {
	it('gives each Center the first frequency of its ARTCC', () => {
		const centers = boundaries().filter(b => b.type === BoundaryType.Center);
		expect(centers.map(b => b.name)).toEqual(['SALT LAKE CITY', 'SEATTLE']);
		expect(centers.map(b => (b as any).frequency)).toEqual([
			{freqMHz: 128.35, name: 'SALT LAKE CITY'}, {freqMHz: 124.85, name: 'SEATTLE'},
		]);
	});

	it('throws for a Center whose ARTCC has no frequency, naming it', () => {
		const x = {...loadExtract(), centers: loadExtract().centers.filter(c => c.artcc !== 'ZSE')};
		expect(() => airspacesOf(loadAirspaces(), x)).toThrow(/SEATTLE.*ZSE/);
	});

	it('maps the kinds to the boundary types and the limits to their references', () => {
		const all = boundaries();
		const a = all.find(b => b.name === 'SEATTLE CLASS B' && b.type === BoundaryType.ClassB && b.minAlt === 0 && feet(b.maxAlt) === 10000)!;
		expect(a.minAltType).toBe(BoundaryAltitudeType.AGL);
		expect(a.maxAltType).toBe(BoundaryAltitudeType.MSL);
		const center = all.find(b => b.type === BoundaryType.Center)!;
		expect(center.minAltType).toBe(BoundaryAltitudeType.AGL);
		expect(center.maxAltType).toBe(BoundaryAltitudeType.Unlimited);
		expect(all.some(b => b.type === BoundaryType.ClassC)).toBe(true);
	});
});

describe('the storage of a screen', () => {
	it('turns the airspace alert off unless the screen turns it on', () => {
		expect(screenStorage({lat: 1, lon: 2})).toEqual({airspaceAlertEnabled: false, lastLatitude: 1, lastLongitude: 2});
		expect(screenStorage(undefined, {airspaceAlertEnabled: true}).airspaceAlertEnabled).toBe(true);
		expect(screenStorage()).toEqual({airspaceAlertEnabled: false});
	});

	it('lets the screen overrule the last position', () => {
		expect(screenStorage({lat: 1, lon: 2}, {lastLatitude: 5})).toEqual({airspaceAlertEnabled: false, lastLatitude: 5, lastLongitude: 2});
	});
});
