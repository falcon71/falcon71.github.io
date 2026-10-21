// What a screen.ts imports. The harness helpers are re-exported so that a screen description needs one import.
import {vi} from 'vitest';

export {defineScreen, type ScreenDescription} from './lib/generate.ts';
export type {FieldDef, Locator} from './lib/fields.ts';
export {moveAircraft, settle, NEAREST_SEARCH_WAIT_MS} from '../../vendor/kln90b/test/harness/boot';
export {pointFrom} from '../../vendor/kln90b/test/harness/flight/geo';
export {savedFlightplan} from '../../vendor/kln90b/test/harness/storage';
export {panelXml, APR_ARM_SWITCH} from '../../vendor/kln90b/test/harness/panelXml';

/** Advances the simulated clock of the unit. */
export function wait(ms: number): Promise<void> {
	return vi.advanceTimersByTimeAsync(ms).then(() => undefined);
}
