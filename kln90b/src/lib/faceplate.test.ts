import {describe, expect, it} from 'vitest';
import {labelPosition, leftFaceplate, rightFaceplate} from '../data/faceplate';
import {leftTree, rightTree} from '../data/pageTree';

describe('the faceplate labels', () => {
	it('lists the left labels in knob order', () => {
		expect(leftFaceplate.labels.map((l) => l.text)).toEqual(['TRIP', 'MODE', 'FPL', 'NAV', 'CALC', 'STAT', 'SETUP', 'OTHER']);
	});

	it('lists the right labels in knob order', () => {
		expect(rightFaceplate.labels.map((l) => l.text)).toEqual(['CTR', 'REF', 'ACTV', 'D/T', 'NAV', 'APT', 'VOR', 'NDB', 'INT', 'SUPL']);
	});

	it('has one label per page type of the knob', () => {
		expect(leftFaceplate.labels.length).toBe(leftTree.length);
		expect(rightFaceplate.labels.length).toBe(rightTree.length);
	});

	it('runs the left labels up the left column and down the right one', () => {
		expect(leftFaceplate.labels.map(({column, row}) => [column, row])).toEqual([
			[0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [1, 1], [1, 2], [1, 3],
		]);
	});

	it('runs the right labels up the left column and down the right one', () => {
		expect(rightFaceplate.labels.map(({column, row}) => [column, row])).toEqual([
			[0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
		]);
	});

	it('places the left labels up the left column and down the right one', () => {
		expect(labelPosition(leftFaceplate, leftFaceplate.labels[0])).toEqual({x: 42, y: 256});
		expect(labelPosition(leftFaceplate, leftFaceplate.labels[3])).toEqual({x: 42, y: 196});
		expect(labelPosition(leftFaceplate, leftFaceplate.labels[4])).toEqual({x: 190, y: 196});
	});

	it('places the right labels up the left column and down the right one', () => {
		expect(labelPosition(rightFaceplate, rightFaceplate.labels[0])).toEqual({x: 724, y: 270});
		expect(labelPosition(rightFaceplate, rightFaceplate.labels[9])).toEqual({x: 880, y: 270});
	});
});
