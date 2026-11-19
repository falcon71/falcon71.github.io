// The state of the unit that the screens of the Flight plans page share: FPL 1 holds KPDX, KOLM and KSEA, the aircraft
// stands at KPDX, and FPL 0 is empty.
import {facility, place, savedFlightplan, type ScreenDescription} from '../../generator/api.ts';

export const PLAN = ['KPDX', 'KOLM', 'KSEA'];

/** FPL 1 holds the three airports, stored as the unit keeps a flight plan while it is off. */
export const BOOT_FPL_1: NonNullable<ScreenDescription['boot']> = {
	position: place('KPDX'),
	storage: savedFlightplan(1, PLAN.map(facility)),
};

/** Thirty airports, the most a flight plan holds. */
export const FULL_PLAN = [
	'KBLI', 'KORS', 'KFHR', 'KCLM', 'KPAE', 'KRNT', 'KBFI', 'KSEA', 'KTIW', 'KPWT', 'KOLM', 'KSHN', 'KAST', 'KHQM', 'KPLU',
	'KTDO', 'KPDX', 'KHIO', 'KUAO', 'KSLE', 'KMMV', 'KEUG', 'KRDM', 'KPDT', 'KYKM', 'KELN', 'KMWH', 'KEPH', 'KGEG', 'KBDN',
];
