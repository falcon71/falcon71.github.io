/**
 * The page type labels printed on the faceplate around each pair of knobs, with their places in the 912 x 290 panel of
 * the front panel drawing (`KlnUnit.astro`). The knob demo draws the same labels and lights the selected one.
 *
 * The labels are in knob order: `labels[i]` names page type `i` of the side's tree in `pageTree.ts`. On the faceplate
 * they run around the knob, from the bottom of the left column up, then from the top of the right column down. The
 * faceplate spells some of them longer than the status line does (TRIP for TRI, SUPL for SUP).
 */
export interface FaceplateLabel {
	text: string;
	/** 0 for the column left of the knob, 1 for the column right of it */
	column: 0 | 1;
	/** 0 is the top row */
	row: number;
}

export interface FaceplateSide {
	/** The center of the knobs */
	knob: {x: number; y: number};
	/** The x of the left and of the right label column (the labels are centered on it) */
	columnX: [number, number];
	/** The baseline of row 0 */
	firstRowY: number;
	rowStep: number;
	/** In knob order */
	labels: FaceplateLabel[];
}

export const leftFaceplate: FaceplateSide = {
	knob: {x: 118, y: 226},
	columnX: [42, 190],
	firstRowY: 196,
	rowStep: 20,
	labels: [
		{text: 'TRIP', column: 0, row: 3},
		{text: 'MODE', column: 0, row: 2},
		{text: 'FPL', column: 0, row: 1},
		{text: 'NAV', column: 0, row: 0},
		{text: 'CALC', column: 1, row: 0},
		{text: 'STAT', column: 1, row: 1},
		{text: 'SETUP', column: 1, row: 2},
		{text: 'OTHER', column: 1, row: 3},
	],
};

export const rightFaceplate: FaceplateSide = {
	knob: {x: 803, y: 226},
	columnX: [724, 880],
	firstRowY: 190,
	rowStep: 20,
	labels: [
		{text: 'CTR', column: 0, row: 4},
		{text: 'REF', column: 0, row: 3},
		{text: 'ACTV', column: 0, row: 2},
		{text: 'D/T', column: 0, row: 1},
		{text: 'NAV', column: 0, row: 0},
		{text: 'APT', column: 1, row: 0},
		{text: 'VOR', column: 1, row: 1},
		{text: 'NDB', column: 1, row: 2},
		{text: 'INT', column: 1, row: 3},
		{text: 'SUPL', column: 1, row: 4},
	],
};

export function labelPosition(side: FaceplateSide, label: FaceplateLabel): {x: number; y: number} {
	return {x: side.columnX[label.column], y: side.firstRowY + label.row * side.rowStep};
}
