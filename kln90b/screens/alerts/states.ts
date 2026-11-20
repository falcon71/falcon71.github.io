// The states that the screens of Airspace and altitude alerting share. The unit is installed with altitude alerting,
// which the ALT page, SET 5 and SET 9 need to show their entries.
import {panelXml, place} from '../../generator/api.ts';

export const KSEA = place('KSEA');

/** The unit on the ground at KSEA with altitude alerting installed. */
export const ALERTING = panelXml({'Output.AltitudeAlertEnabled': true});

/**
 * An area of the extract that stands alone: a shelf of the Class B area of Seattle with its ceiling at 7,000 ft, which
 * no other class B or C area of the extract touches within 5 NM. INSIDE is a point in it.
 */
export const INSIDE = {lat: 47.15134, lon: -122.61756};

/** 8 NM south of INSIDE and 4.5 NM from the area: 90 kt north reaches it within the 10 minutes the unit looks ahead. */
export const SOUTH = {lat: 47.018, lon: -122.6176};
