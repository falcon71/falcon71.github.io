import {describe, expect, it} from 'vitest';
import type {CellAttr, ScreenCapture} from './screenFile.ts';
import {checkExplanations, documentedFields, loadCapture, nestedScreen, screenIdOfFile} from './screens.ts';

function capture(fieldIds: string[], mapFieldIds: string[] = []): ScreenCapture {
	return {
		title: 'APT 1 page', show: 'right', layout: 'split', status: true,
		text: Array.from({length: 7}, () => ' '.repeat(23)),
		mask: Array.from({length: 7}, () => Array.from({length: 23}, () => '.' as CellAttr)),
		fields: new Map(fieldIds.map(id => [id, [{row: 0, from: 12, to: 16}]])),
		mapFields: new Map(mapFieldIds.map(id => [id, 'R'])), maps: mapFieldIds.length > 0 ? ['R'] : [],
	};
}

describe('loadCapture', () => {
	it('names the screen and the command when no screen was generated', () => {
		expect(() => loadCapture('no-such')).toThrow('no generated screen "no-such"; run npm run screens -- no-such');
	});

	it('reads the generated file of a screen', () => {
		const {capture: c, maps} = loadCapture('apt-1-ksea');
		expect(c.show).toBe('right');
		expect(c.text[0]).toContain('KSEA');
		expect([...c.fields.keys()]).toContain('ident');
		expect(maps).toEqual({});
	});
});

describe('checkExplanations', () => {
	it('accepts the explanations of every field', () => {
		const mdx = '<Field id="ident" title="Identifier">x</Field>\n<Field id="name" title="Name">y</Field>';
		expect(() => checkExplanations('apt-1-ksea', capture(['ident', 'name']), mdx)).not.toThrow();
	});

	it('names the screen and the field that has no explanation', () => {
		const mdx = '<Field id="ident" title="Identifier">x</Field>';
		expect(() => checkExplanations('apt-1-ksea', capture(['ident', 'name']), mdx))
			.toThrow(/apt-1-ksea.*no explanation: name/);
	});

	it('counts the map fields as fields', () => {
		const mdx = '<Field id="ident" title="Identifier">x</Field><Field id="runway" title="Runway">x</Field>';
		expect(checkExplanations('apt-1-ksea', capture(['ident'], ['runway']), mdx)).toBeUndefined();
		expect(() => checkExplanations('apt-1-ksea', capture(['ident'], ['runway']), '<Field id="ident" title="I">x</Field>'))
			.toThrow(/no explanation: runway/);
	});

	it('names the explanation that has no field, and the command to run', () => {
		const mdx = '<Field id="ident" title="Identifier">x</Field><Field id="extra" title="E">x</Field>';
		expect(() => checkExplanations('apt-1-ksea', capture(['ident']), mdx))
			.toThrow(/apt-1-ksea.*no field: extra.*npm run screens -- apt-1-ksea/);
	});
});

describe('documentedFields', () => {
	const mdx = '<Field id="ident" title="Identifier">x</Field><Field id="runway" title="Runway">x</Field>';

	it('holds the text fields and the map fields that have an explanation', () => {
		expect([...documentedFields(capture(['ident'], ['runway']), mdx)].sort()).toEqual(['ident', 'runway']);
	});

	it('leaves out a map field without an explanation, and a text field without one', () => {
		expect([...documentedFields(capture(['ident', 'name'], ['runway', 'taxiway']), mdx)].sort()).toEqual(['ident', 'runway']);
	});

	it('leaves out an explanation that has no field', () => {
		expect([...documentedFields(capture(['ident']), mdx)]).toEqual(['ident']);
	});
});

describe('screenIdOfFile', () => {
	it('is the path below screens/ of the folder that holds the file', () => {
		expect(screenIdOfFile('../../screens/pages/apt/apt-1-ksea/screen.txt')).toBe('pages/apt/apt-1-ksea');
		expect(screenIdOfFile('../../screens/nav-1/map-L.svg')).toBe('nav-1');
	});
});

describe('nestedScreen', () => {
	it('takes a shared prefix for no nesting', () => {
		expect(nestedScreen(['pages/apt/apt-1-ksea', 'pages/apt/apt-1-ksea-cursor', 'nav-1'])).toBeNull();
	});

	it('names the screen and the screen that lies inside it', () => {
		expect(nestedScreen(['pages/nav', 'pages/nav/nav-1'])).toEqual(['pages/nav', 'pages/nav/nav-1']);
		expect(nestedScreen(['pages/nav/nav-1', 'pages/nav'])).toEqual(['pages/nav', 'pages/nav/nav-1']);
	});

	it('finds no screen inside a screen among the committed screens', () => {
		const keys = Object.keys(import.meta.glob('../../screens/**/screen.ts'));
		expect(keys).toContain('../../screens/nav-5-ksea/screen.ts');
		expect(nestedScreen(keys.map(screenIdOfFile))).toBeNull();
	});
});
