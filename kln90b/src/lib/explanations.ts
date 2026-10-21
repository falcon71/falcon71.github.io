// The check that the explanations of a screen (fields.mdx) and the fields of its description agree. The generator and
// the site both run it, so this module has no imports.

/**
 * The ids of the `<Field id="...">` elements of an MDX page, in source order. The element may be spread over several
 * lines, and its other attributes may hold `>` and `id=` inside their quotes.
 */
export function fieldIdsOf(mdx: string): string[] {
	const re = /<Field(?=[\s>])(?:[^>"']|"[^"]*"|'[^']*')*?\sid\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
	return Array.from(mdx.matchAll(re), m => m[1] ?? m[2]);
}

/**
 * Compares the field ids of a screen description with the ids of the explanations.
 * @returns null when both name the same fields once each, otherwise a sentence that lists what differs
 */
export function explanationMismatch(fieldIds: string[], explained: string[]): string | null {
	const twice = explained.filter((id, i) => explained.indexOf(id) !== i);
	const problems = [
		['no explanation', fieldIds.filter(id => !explained.includes(id))],
		['no field', explained.filter(id => !fieldIds.includes(id))],
		['explained twice', Array.from(new Set(twice))],
	].filter(([, ids]) => ids.length > 0).map(([what, ids]) => `${what}: ${(ids as string[]).join(', ')}`);
	return problems.length === 0 ? null : `fields.mdx and the screen description disagree (${problems.join('; ')})`;
}
