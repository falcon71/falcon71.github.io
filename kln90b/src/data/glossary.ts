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
		text: 'On APT 4, the label of the frequency of a flight service station of the airport.',
	},
	AWOS: {
		expansion: 'Automated weather observing system',
		text: 'An automated weather broadcast on its own frequency, from a small set of sensors.',
	},
	ASOS: {
		expansion: 'Automated surface observing system',
		text: 'An automated weather broadcast on its own frequency, with more sensors than an AWOS.',
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
	IAP: {
		expansion: 'Instrument approach procedure',
		text: 'A published instrument approach. APT 8 shows IAP after the airport identifier to label its list of approaches.',
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
	APPR: {
		expansion: 'Approach',
		text: 'The short form of approach on the unit, as in the question AND APPR TO on APT 8.',
	},
	RW: {
		expansion: 'Runway',
		text: 'The prefix of a runway in the lists and waypoint names of the unit, such as RW34L, the threshold of runway 34L.',
	},
	nr: {
		expansion: 'Nearest rank',
		text: 'The rank of a waypoint in the nearest list, from nr 1 for the nearest. It flashes while the cursor is elsewhere on the page.',
	},
	'CL B': {
		expansion: 'Class B airspace',
		text: 'APT 1 shows CL B when the airport lies inside the lateral outline of a class B airspace.',
	},
	'CL C': {
		expansion: 'Class C airspace',
		text: 'APT 1 shows CL C when the airport lies inside the lateral outline of a class C airspace.',
	},
	MILTRY: {
		expansion: 'Military',
		text: 'APT 1 shows MILTRY on the right of the airspace line for a military airport.',
	},
	PRIVAT: {
		expansion: 'Private',
		text: 'APT 1 shows PRIVAT on the right of the airspace line for a private airport.',
	},
	ELV: {
		expansion: 'Elevation',
		text: 'The elevation of the airport above sea level on APT 2, in feet.',
	},
	Z: {
		expansion: 'Zulu time offset',
		text: 'The offset of the standard time of the airport from UTC on APT 2, in whole hours.',
	},
	DT: {
		expansion: 'Daylight time',
		text: 'The offset of daylight time, shown in parentheses on APT 2 where the time zone observes it.',
	},
	'NP APR': {
		expansion: 'Non-precision approach',
		text: 'APT 2 shows NP APR when the airport has an approach but no ILS.',
	},
	'NO APR': {
		expansion: 'No approach',
		text: 'APT 2 shows NO APR when the airport has no approach in the database.',
	},
	'(R)': {
		expansion: 'Radar',
		text: 'APT 2 shows (R) when approach and departure control have radar.',
	},
	'RWY LEN': {
		expansion: 'Runway length',
		text: 'The label of the runway entry of a user airport on APT 3.',
	},
	HRD: {
		expansion: 'Hard surface',
		text: 'The runway surface code for concrete, asphalt and other hard surfaces.',
	},
	SFT: {
		expansion: 'Soft surface',
		text: 'Soft surface, the choice for the runway of a user airport on APT 3 that is not HRD. On SET 3, HRD SFT lets the nearest list include airports with soft runways.',
	},
	TRF: {
		expansion: 'Turf',
		text: 'The runway surface code for grass and turf.',
	},
	SNW: {
		expansion: 'Snow',
		text: 'A runway surface code of APT 3.',
	},
	ICE: {
		expansion: 'Ice',
		text: 'A runway surface code of APT 3.',
	},
	DRT: {
		expansion: 'Dirt',
		text: 'A runway surface code of APT 3.',
	},
	GRV: {
		expansion: 'Gravel',
		text: 'A runway surface code of APT 3.',
	},
	MAT: {
		expansion: 'Steel mats',
		text: 'A runway surface code of APT 3.',
	},
	SND: {
		expansion: 'Sand',
		text: 'A runway surface code of APT 3.',
	},
	SHL: {
		expansion: 'Shale',
		text: 'A runway surface code of APT 3.',
	},
	L: {
		expansion: 'Lighted',
		text: 'The lighting code of a runway lighted from sunset to sunrise.',
	},
	LPC: {
		expansion: 'Pilot-controlled lighting',
		text: 'The lighting code of a runway whose lights you turn on by radio.',
	},
	LPT: {
		expansion: 'Part-time lighting',
		text: 'The lighting code of a runway whose lights are not on all night.',
	},
	GRND: {
		expansion: 'Ground control',
		text: 'A frequency label of APT 4.',
	},
	TWR: {
		expansion: 'Tower',
		text: 'A frequency label of APT 4.',
	},
	CLR: {
		expansion: 'Clearance delivery',
		text: 'A frequency label of APT 4. On the front panel, CLR is the clear key.',
	},
	APR: {
		expansion: 'Approach',
		text: 'On APT 4, the label of the approach control frequency. On APT 2 and in FPL 0 the short form of an approach procedure, as in NO APR and CHANGE APR?.',
	},
	DEP: {
		expansion: 'Departure control',
		text: 'A frequency label of APT 4.',
	},
	CTR: {
		expansion: 'Center',
		text: 'On APT 4, the label of the frequency of a center that provides approach and departure control for the airport. CTR is also the right-side page group with the nearest centers.',
	},
	PTAX: {
		expansion: 'Pre-taxi clearance',
		text: 'A frequency label of APT 4, for a frequency on which you get your clearance before taxi.',
	},
	RMKS: {
		expansion: 'Remarks',
		text: 'The remarks of an airport on APT 5, as in RMKS FULL and APTS W/RMKS.',
	},
};

/** The anchor of a term on the glossary page */
export function glossaryAnchor(term: string): string {
	return term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
