/**
 * The single source for every explained term. <Term> builds its tooltip from here and the glossary page lists
 * the whole collection, so the two never disagree.
 *
 * Draft: the definitions are placeholders.
 */
export interface GlossaryEntry {
	/** The written-out form, e.g. "Cross-track error" */
	expansion?: string;
	/** One or two sentences, plain text */
	text: string;
}

export const glossary: Record<string, GlossaryEntry> = {
	DTK: {
		expansion: 'Desired track',
		text: 'The magnetic course of the active leg at the point abeam the aircraft, or the selected course in OBS mode.',
	},
	XTK: {
		expansion: 'Cross-track error',
		text: 'How far the aircraft is to the side of the active leg or the selected course, in NM. The D-bar shows it, and the FLY line of NAV 3 gives it as a distance.',
	},
	GS: {
		expansion: 'Groundspeed',
		text: 'Your speed over the ground, from the GPS. It shows dashes while the unit has no position.',
	},
	ETA: {
		expansion: 'Estimated time of arrival',
		text: 'The time of day at which you reach a waypoint at your present groundspeed, in the time zone the page shows.',
	},
	ETE: {
		expansion: 'Estimated time en route',
		text: 'The time to a waypoint at your present groundspeed. It shows dashes at a groundspeed of 2 kt or less and when the unit has no position.',
	},
	RAIM: {
		expansion: 'Receiver autonomous integrity monitoring',
		text: 'The receiver checks its own position for errors by comparing more measurements than a position needs. It needs five measurements, and the altitude input counts as one.',
	},
	EPE: {
		expansion: 'Estimated position error',
		text: 'An estimate of how far the position of the receiver may be from the truth, worked out from the geometry of the satellites in use. STA 2 shows it in NM.',
	},
	SID: {
		expansion: 'Standard instrument departure',
		text: 'A published departure procedure from the runways of an airport to the en route structure. The unit lists the SIDs of an airport on APT 7 and loads one into FPL 0.',
	},
	STAR: {
		expansion: 'Standard terminal arrival route',
		text: 'A published arrival procedure from the en route structure to an airport. The unit lists the STARs of an airport on APT 7 and loads one into FPL 0.',
	},
	Transition: {
		text: 'The part of a SID, a STAR or an approach that connects it to one particular en route fix or initial approach fix. A procedure with transitions cannot be loaded without one; when there is only one, the unit takes it.',
	},
	IAF: {
		expansion: 'Initial approach fix',
		text: 'The fix where an approach begins. On this unit an approach always starts at an IAF, which you select on APT 8, or which the unit takes when there is only one.',
	},
	FAF: {
		expansion: 'Final approach fix',
		text: 'The fix where the final approach segment begins. Near it the unit switches an armed approach to active.',
	},
	MAP: {
		expansion: 'Missed approach point',
		text: 'The point where the missed approach begins, often the runway threshold.',
	},
	MAHP: {
		expansion: 'Missed approach holding point',
		text: 'The fix where the missed approach ends in a holding pattern.',
	},
	RNAV: {
		expansion: 'Area navigation',
		text: 'Navigation between waypoints anywhere, rather than to and from ground stations. On APT 8, RNAV names an RNAV (GPS) approach.',
	},
	LNAV: {
		expansion: 'Lateral navigation',
		text: 'The minima of an RNAV (GPS) approach flown with lateral guidance only. The unit offers an RNAV approach only when it has LNAV minima.',
	},
	'RF leg': {
		expansion: 'Radius-to-fix leg',
		text: 'A procedure leg that follows a turn of fixed radius to a fix. The unit cannot fly it and leaves out every procedure that contains one.',
	},
	'RNP AR': {
		expansion: 'Required navigation performance, authorization required',
		text: 'Procedures that need a special approval of aircraft and crew. The unit does not offer them.',
	},
	MSG: {
		text: 'The message prompt. It shows in the status line when the unit holds a message and flashes while you have not read all of them. You read the messages with the MSG button.',
	},
	ENT: {
		text: 'The enter prompt. It flashes in the status line when ENT accepts what you have entered or selected.',
	},
	EFB: {
		expansion: 'Electronic flight bag',
		text: 'The tablet in the cockpit of Microsoft Flight Simulator 2024. Its flight planner app can send a route to the unit and request the active flight plan from it.',
	},
	CRSR: {
		expansion: 'Cursor',
		text: 'Replaces the page name in the status line while the cursor is on for that side. Pressing the CRSR button of that side turns the cursor off again.',
	},
	KYBD: {
		expansion: 'Keyboard',
		text: 'Flashes in the status line in place of CRSR while keyboard mode is on for that side.',
	},
	'ENR-LEG': {
		expansion: 'Enroute-Leg mode',
		text: 'The mode annunciation of leg mode en route: the unit guides you along the active leg of the flight plan or a direct-to.',
	},
	BRG: {
		expansion: 'Bearing',
		text: 'The magnetic bearing from your position to the active waypoint.',
	},
	'ENR:': {
		expansion: 'Enroute-OBS mode',
		text: 'The mode annunciation of OBS mode en route, followed by the selected course in degrees magnetic.',
	},
	'ARM-LEG': {
		expansion: 'Approach Arm-Leg mode',
		text: 'The mode annunciation of leg mode while the unit has armed the approach in the flight plan.',
	},
	'ARM:': {
		expansion: 'Approach Arm-OBS mode',
		text: 'The mode annunciation of OBS mode while the unit has armed the approach in the flight plan, followed by the selected course in degrees magnetic.',
	},
	'APR-LEG': {
		expansion: 'Approach Active-Leg mode',
		text: 'The mode annunciation of the active approach: the unit guides you along the legs of the approach with the approach CDI scale factor.',
	},
	'OBS IN': {
		expansion: 'OBS input',
		text: 'The course that the unit reads from the OBS setting of the course indicator in the aircraft, in degrees magnetic.',
	},
	OUT: {
		expansion: 'OBS output',
		text: 'On the Self Test page, the desired track that the unit sends out; it shows a fixed test value.',
	},
	RMI: {
		expansion: 'Radio magnetic indicator',
		text: 'An instrument that shows bearings; the unit sends it the bearing to the active waypoint.',
	},
	ANNUN: {
		expansion: 'Annunciators',
		text: 'The lamps of the aircraft that the unit lights to show its state, such as MSG and the approach and waypoint lamps.',
	},
	ALT: {
		expansion: 'Altitude',
		text: 'The indicated altitude from the altitude input of the aircraft, rounded to 100 ft.',
	},
	BARO: {
		expansion: 'Altimeter baro setting',
		text: 'The baro setting of the altimeter, in inches of mercury or millibars, which the unit uses for altitude.',
	},
};

/** The anchor of a term on the glossary page */
export function glossaryAnchor(term: string): string {
	return term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
