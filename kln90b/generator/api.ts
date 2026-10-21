// What a screen.ts imports. The harness helpers are re-exported so that a screen description needs one import.
import {vi} from 'vitest';
import type {HeadlessUnit} from '../../vendor/kln90b/test/harness/boot';

export {defineScreen, type ScreenDescription} from './lib/generate.ts';
export type {FieldDef, Locator} from './lib/fields.ts';
export {facility, place} from './lib/navdata.ts';
export {moveAircraft, settle, NEAREST_SEARCH_WAIT_MS} from '../../vendor/kln90b/test/harness/boot';
export {courseDeg, pointFrom} from '../../vendor/kln90b/test/harness/flight/geo';
export {savedFlightplan} from '../../vendor/kln90b/test/harness/storage';
export {panelXml, APR_ARM_SWITCH} from '../../vendor/kln90b/test/harness/panelXml';

/** Advances the simulated clock of the unit. */
export function wait(ms: number): Promise<void> {
	return vi.advanceTimersByTimeAsync(ms).then(() => undefined);
}

/**
 * Does what a pilot does about the message ADJ NAV IND CRS TO nnn (3-16): reads the messages and turns the course of
 * the external indicator to nnn (the sim variable Nav OBS:1, which the unit reads when the GPS drives the indicator), so
 * that the message goes and the status line does not flash msg. Does nothing without that message.
 */
export async function adjustCourseIndicator(unit: HeadlessUnit): Promise<void> {
	const messages = await unit.panel.readMessages();
	const course = messages.map(m => /^ADJ NAV IND CRS TO (\d{3})/.exec(m)).find(m => m !== null);
	if (course == null) return;
	unit.env.sim.set('Nav OBS:1', 'degrees', Number(course[1]));
	await wait(2000);
}
