import {describe, expect, it} from 'vitest';
import {explanationMismatch, fieldIdsOf} from './explanations.ts';

describe('fieldIdsOf', () => {
	it('lists the ids in source order, also of a Field spread over lines', () => {
		const mdx = [
			'<Field id="dis" title="Distance">The distance.</Field>',
			'',
			'<Field',
			'\tid="gs"',
			'\ttitle="Ground speed">The speed.</Field>',
		].join('\n');
		expect(fieldIdsOf(mdx)).toEqual(['dis', 'gs']);
	});

	it('ignores another tag, another attribute and an id inside a title', () => {
		const mdx = [
			'<Fields id="other">x</Fields>',
			`<Field title='x id="fake" > y' data-id="no" id="real">x</Field>`,
		].join('\n');
		expect(fieldIdsOf(mdx)).toEqual(['real']);
	});
});

describe('explanationMismatch', () => {
	it('names a field without explanation', () => {
		expect(explanationMismatch(['dis', 'gs'], ['dis'])).toContain('no explanation: gs');
	});

	it('names an explanation without field', () => {
		expect(explanationMismatch(['dis'], ['dis', 'xtk'])).toContain('no field: xtk');
	});

	it('names an explanation that appears twice', () => {
		expect(explanationMismatch(['dis'], ['dis', 'dis'])).toContain('explained twice: dis');
	});

	it('is null for equal sets, whatever the order', () => {
		expect(explanationMismatch(['dis', 'gs'], ['gs', 'dis'])).toBeNull();
	});
});
