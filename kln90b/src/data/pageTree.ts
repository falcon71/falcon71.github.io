/**
 * Page names are 5 characters, as on the status line: "NAV 1", "FPL10".
 *
 * The page groups of both halves in knob order, as the unit has them. Used by the knob demo and, later, the
 * page reference. Pages that exist only in some installations are listed; the demo marks them.
 */
export interface PageGroup {
	name: string;
	pages: string[];
	/** Pages that exist only in some installations */
	optional?: string[];
}

const numbered = (name: string, from: number, to: number) =>
	Array.from({ length: to - from + 1 }, (_, i) => `${name}${String(from + i).padStart(2, ' ')}`);

export const leftTree: PageGroup[] = [
	{ name: 'TRI', pages: numbered('TRI', 0, 6) },
	{ name: 'MOD', pages: numbered('MOD', 1, 2) },
	{ name: 'FPL', pages: numbered('FPL', 0, 25) },
	{ name: 'NAV', pages: numbered('NAV', 1, 5) },
	{ name: 'CAL', pages: numbered('CAL', 1, 7) },
	{ name: 'STA', pages: numbered('STA', 1, 5) },
	{ name: 'SET', pages: numbered('SET', 1, 10) },
	{ name: 'OTH', pages: numbered('OTH', 1, 10), optional: ['OTH 5', 'OTH 6', 'OTH 7', 'OTH 8', 'OTH 9', 'OTH10'] },
];

export const rightTree: PageGroup[] = [
	{ name: 'CTR', pages: numbered('CTR', 1, 2) },
	{ name: 'REF', pages: ['REF  '] },
	{ name: 'ACT', pages: ['ACT  '] },
	{ name: 'D/T', pages: numbered('D/T', 1, 4) },
	{ name: 'NAV', pages: numbered('NAV', 1, 5) },
	{ name: 'APT', pages: numbered('APT', 1, 8), optional: ['APT 8'] },
	{ name: 'VOR', pages: ['VOR  '] },
	{ name: 'NDB', pages: ['NDB  '] },
	{ name: 'INT', pages: ['INT  '] },
	{ name: 'SUP', pages: ['SUP  '] },
];
