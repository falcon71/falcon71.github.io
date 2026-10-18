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
};

/** The anchor of a term on the glossary page */
export function glossaryAnchor(term: string): string {
	return term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
