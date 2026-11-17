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
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
	},
	XTK: {
		expansion: 'Cross-track error',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
	},
	GS: {
		expansion: 'Groundspeed',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
	ETE: {
		expansion: 'Estimated time en route',
		text: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore.',
	},
	RAIM: {
		expansion: 'Receiver autonomous integrity monitoring',
		text: 'The receiver checks its own position for errors by comparing more measurements than a position needs. It needs five measurements, and the altitude input counts as one.',
	},
	EPE: {
		expansion: 'Estimated position error',
		text: 'An estimate of how far the position of the receiver may be from the truth, worked out from the geometry of the satellites in use. STA 2 shows it in NM.',
	},
	'Turn anticipation': {
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis aute irure dolor in reprehenderit.',
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
		text: 'The navigation mode in which you fly along a leg from one waypoint to the next while en route.',
	},
	DIS: {
		expansion: 'Distance',
		text: 'The distance to the active waypoint, in NM.',
	},
	BRG: {
		expansion: 'Bearing',
		text: 'The magnetic bearing from your position to the active waypoint.',
	},
	'ENR:': {
		expansion: 'En route, OBS mode',
		text: 'The navigation mode in which you fly the course you selected with the OBS, followed by that course in degrees.',
	},
	'ARM-LEG': {
		expansion: 'Approach armed, leg mode',
		text: 'The navigation mode in which the unit has armed an approach and still navigates along legs.',
	},
	'ARM:': {
		expansion: 'Approach armed, OBS mode',
		text: 'The navigation mode in which the unit has armed an approach while you fly an OBS course, shown with that course in degrees.',
	},
	'APR-LEG': {
		expansion: 'Approach active, leg mode',
		text: 'The navigation mode in which the approach is active and the unit navigates along its legs.',
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
		text: 'The baro setting of the altimeter, in inches of mercury, which the unit uses for altitude.',
	},
};

/** The anchor of a term on the glossary page */
export function glossaryAnchor(term: string): string {
	return term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
