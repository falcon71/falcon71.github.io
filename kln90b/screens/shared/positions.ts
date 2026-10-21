// Where the position of a waypoint is on a page of the unit: latitude on one row, longitude on the next.
import type {Area, Locator} from '../../generator/lib/fields.ts';

/** The latitude and the longitude of the page in `area`, found by their N/S and E/W patterns, not by their rows. */
export function positionRows(area: Area): Locator[] {
	return [
		{re: /[NS] *\d+°[\d.]+'/, area},
		{re: /[EW] *\d+°[\d.]+'/, area},
	];
}
