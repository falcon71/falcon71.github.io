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
		expansion: 'Ground speed',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
	ETE: {
		expansion: 'Estimated time en route',
		text: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore.',
	},
	RAIM: {
		expansion: 'Receiver autonomous integrity monitoring',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, quis nostrud exercitation ullamco laboris.',
	},
	'Turn anticipation': {
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis aute irure dolor in reprehenderit.',
	},
	'Active waypoint': {
		text: 'The waypoint the unit is navigating to: the end of the active leg of the flight plan, or the direct-to waypoint.',
	},
	'Waypoint alerting': {
		text: 'The warning of the unit that you are about to reach the active waypoint. It flashes the arrow on the waypoint page and raises a message.',
	},
	'User waypoint': {
		text: 'A waypoint that you create yourself, at your present position or at coordinates you enter. The unit stores up to 250 user waypoints of all kinds together.',
	},
	'Nearest list': {
		text: 'The list of the airports, VORs or NDBs closest to the aircraft, ranked by distance from nr 1 to nr 9. The unit builds it by itself; for airports it uses the criteria on SET 3.',
	},
	TMA: {
		expansion: 'Terminal control area',
		text: 'A controlled airspace around a busy airport. APT 1 shows TMA when the airport lies inside one.',
	},
	CTA: {
		expansion: 'Control area',
		text: 'A controlled airspace in which air traffic control is provided. APT 1 shows CTA when the airport lies inside one.',
	},
	ATIS: {
		expansion: 'Automatic terminal information service',
		text: 'A recorded broadcast of weather and airport information on its own frequency.',
	},
	MCOM: {
		expansion: 'Multicom',
		text: 'The common advisory frequency at airports without a tower and without a unicom.',
	},
	UNIC: {
		expansion: 'Unicom',
		text: 'The advisory frequency of an airport without a tower, operated by the airport or a service on it.',
	},
	CTAF: {
		expansion: 'Common traffic advisory frequency',
		text: 'The frequency on which pilots at an airport without an operating tower announce their positions and intentions.',
	},
	AFIS: {
		expansion: 'Aerodrome flight information service',
		text: 'The frequency of an airport information service that is not a control tower.',
	},
	AWOS: {
		expansion: 'Automated weather observing system',
		text: 'An automated weather broadcast on its own frequency.',
	},
	ASOS: {
		expansion: 'Automated surface observing system',
		text: 'An automated weather broadcast on its own frequency.',
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
		text: 'The part of a SID, a STAR or an approach that connects it to one particular en route fix or initial approach fix. A procedure with transitions cannot be loaded without selecting one.',
	},
	IAF: {
		expansion: 'Initial approach fix',
		text: 'The fix where an approach begins. On this unit an approach always starts at an IAF, which you select on APT 8.',
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
	IAP: {
		expansion: 'Instrument approach procedure',
		text: 'APT 8 shows IAP after the airport identifier to label its list of approaches.',
	},
	RNAV: {
		expansion: 'Area navigation',
		text: 'Navigation between waypoints anywhere, rather than to and from ground stations. On APT 8, RNAV names an RNAV (GPS) approach.',
	},
	VORD: {
		expansion: 'VOR/DME',
		text: 'The short name of a VOR/DME approach in the list on APT 8.',
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
};

/** The anchor of a term on the glossary page */
export function glossaryAnchor(term: string): string {
	return term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
