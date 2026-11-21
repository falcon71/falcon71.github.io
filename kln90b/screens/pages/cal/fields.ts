// The fields that the screens of one CAL page share. A page of the unit has the same cells in every state, so the
// locators are the same; only the explanations (fields.mdx of each screen) are written out again.
import type {FieldDef} from '../../../generator/api.ts';

const page = (name: string): FieldDef => ({id: 'page', find: {re: new RegExp(name), area: 'S'}});

export const CAL_1_FIELDS: FieldDef[] = [
	{id: 'title', find: {re: /ALTITUDE/, area: 'L', row: 0}},
	{id: 'ind', find: {re: /IND:\S+/, area: 'L', row: 1}},
	{id: 'baro', find: {re: /BARO:\S+/, area: 'L', row: 2}},
	{id: 'prs', find: {re: /PRS +\S+/, area: 'L', row: 3}},
	{id: 'temp', find: {re: /TEMP: \S+/, area: 'L', row: 4}},
	{id: 'den', find: {re: /DEN +\S+/, area: 'L', row: 5}},
	page('CAL 1'),
];

export const CAL_1_CURSOR_FIELDS: FieldDef[] = [
	...CAL_1_FIELDS.slice(0, 6),
	{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
];

export const CAL_2_FIELDS: FieldDef[] = [
	{id: 'title', find: {re: /TAS/, area: 'L', row: 0}},
	{id: 'cas', find: {re: /CAS: +\S+/, area: 'L', row: 1}},
	{id: 'alt', find: {re: /ALT:\S+/, area: 'L', row: 2}},
	{id: 'baro', find: {re: /BARO:\S+/, area: 'L', row: 3}},
	{id: 'temp', find: {re: /TEMP: \S+/, area: 'L', row: 4}},
	{id: 'tas', find: {re: /TAS +\S+/, area: 'L', row: 5}},
	page('CAL 2'),
];

export const CAL_3_FIELDS: FieldDef[] = [
	{id: 'title', find: {re: /WIND/, area: 'L', row: 0}},
	{id: 'tas', find: {re: /TAS +\S+/, area: 'L', row: 1}},
	{id: 'hdg', find: {re: /HDG +\S+/, area: 'L', row: 2}},
	{id: 'component', find: {re: /[HT][DL]WND +\S+/, area: 'L', row: 3}},
	{id: 'direction', find: {re: /WIND +\S+/, area: 'L', row: 4}},
	{id: 'speed', find: {re: /\d+kt|---kt/, area: 'L', row: 5}},
	page('CAL 3'),
];

export const CAL_3_HEADING_FIELDS: FieldDef[] = CAL_3_FIELDS.filter(f => f.id !== 'hdg');

export const CAL_4_FIELDS: FieldDef[] = [
	{id: 'title', find: {re: /VNV ANGLE/, area: 'L', row: 0}},
	{id: 'gs', find: {re: /GS: +\S+/, area: 'L', row: 2}},
	{id: 'fpm', find: {re: /FPM: +\S+/, area: 'L', row: 3}},
	{id: 'angle', find: {re: /ANGLE: *\S+/, area: 'L', row: 4}},
	page('CAL 4'),
];

export const CAL_7_FIELDS: FieldDef[] = [
	{id: 'title', find: {re: /SUNRISE\/SET/, area: 'L', row: 0}},
	{id: 'wpt', find: {area: 'L', row: 1}},
	{id: 'date', find: {area: 'L', row: 2}},
	{id: 'zone', find: {area: 'L', row: 3}},
	{id: 'rise', find: {re: /RISE +\S+/, area: 'L', row: 4}},
	{id: 'set', find: {re: /SET +\S+/, area: 'L', row: 5}},
	page('CAL 7'),
];

export const CAL_7_ENTRY_FIELDS: FieldDef[] = [
	...CAL_7_FIELDS.slice(0, 6),
	{id: 'crsr', find: {re: /CRSR/, area: 'S'}},
];

/** CAL 7 with no waypoint: the row of the waypoint is blank and so has no field */
export const CAL_7_BLANK_FIELDS: FieldDef[] = CAL_7_FIELDS.filter(f => f.id !== 'wpt');
