/**
 * The single source for every explained term. <Term> builds its tooltip from here and the glossary page lists
 * the whole collection, so the two never disagree.
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
	RAIM: {
		expansion: 'Receiver autonomous integrity monitoring',
		text: 'The receiver checks its own position for errors by comparing more measurements than a position needs.',
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
	'RF leg': {
		expansion: 'Radius-to-fix leg',
		text: 'A procedure leg that follows a turn of fixed radius to a fix. The unit cannot fly it and leaves out every procedure that contains one.',
	},
	'RNP AR': {
		expansion: 'Required navigation performance, authorization required',
		text: 'Procedures that need a special approval of aircraft and crew. The unit does not offer them.',
	},
	MSG: {
		text: 'The message prompt in the status line: it flashes while a message is unread and stays steady while the unit holds only messages you have read. The MSG button shows them.',
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
		text: 'Replaces the page identification in the status line while the cursor is on for that side. Pressing the CRSR button of that side turns the cursor off again.',
	},
	'ENR-LEG': {
		expansion: 'Enroute-Leg mode',
		text: 'The mode annunciation of leg mode en route: the unit guides you along the active leg of the flight plan or a direct-to.',
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
};

/** The anchor of a term on the glossary page */
export function glossaryAnchor(term: string): string {
	return term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
