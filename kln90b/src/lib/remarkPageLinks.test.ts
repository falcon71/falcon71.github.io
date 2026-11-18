import {describe, expect, it} from 'vitest';
import remarkPageLinks from '../plugins/remarkPageLinks.ts';

interface Node {
	type: string;
	value?: string;
	depth?: number;
	url?: string;
	children?: Node[];
}

const text = (value: string): Node => ({type: 'text', value});
const heading = (depth: number, value: string): Node => ({type: 'heading', depth, children: [text(value)]});
const paragraph = (...children: Node[]): Node => ({type: 'paragraph', children});

// The headings of a NAV chapter of the tests' own, so that no test depends on the wording of the manual's chapter
const NAV = ['NAV 1: first', 'Super NAV 1: the first on the whole screen', 'NAV 5: fifth', 'Super NAV 5: the fifth on the whole screen'];
const NAV_ANCHORS = new Set(['nav-1-first', 'super-nav-1-the-first-on-the-whole-screen', 'nav-5-fifth', 'super-nav-5-the-fifth-on-the-whole-screen']);
const SUPER_1 = '/kln90b/pages/nav/#super-nav-1-the-first-on-the-whole-screen';
const SUPER_5 = '/kln90b/pages/nav/#super-nav-5-the-fifth-on-the-whole-screen';
const NAV_1 = '/kln90b/pages/nav/#nav-1-first';
const NAV_5 = '/kln90b/pages/nav/#nav-5-fifth';

/** Runs the plugin on the given nodes as the given file under the docs and returns the links as [text, url]. */
function links(children: Node[], file = 'pages/other.mdx'): [string, string][] {
	const tree: Node = {type: 'root', children};
	const docs = new URL('../content/docs/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
	const anchors = (chapter: string) => chapter === 'nav' ? NAV_ANCHORS : null;
	remarkPageLinks({base: '/kln90b', anchors})(tree, {path: `${docs}${file}`});
	const found: [string, string][] = [];
	const visit = (n: Node) => {
		if (n.type === 'link') found.push([n.children!.map(c => c.value).join(''), n.url!]);
		else n.children?.forEach(visit);
	};
	visit(tree);
	return found;
}

const on = (s: string) => links([paragraph(text(s))]);

describe('remarkPageLinks, full-screen pages', () => {
	it('links "Super NAV 1" as a whole to its own section, not its "NAV 1" to the NAV 1 heading', () => {
		expect(on('Open Super NAV 1 for the big screen.')).toEqual([['Super NAV 1', SUPER_1]]);
	});

	it('links "Super NAV 5" as a whole to its own section', () => {
		expect(on('Open Super NAV 5 for the map.')).toEqual([['Super NAV 5', SUPER_5]]);
	});

	it('still links a bare "NAV 1" and "NAV 5" to their headings', () => {
		expect(on('Open NAV 1 first.')).toEqual([['NAV 1', NAV_1]]);
		expect(on('Open NAV 5 last.')).toEqual([['NAV 5', NAV_5]]);
	});

	it('links both a Super NAV 1 and a bare NAV 1 in one text, each to its own section', () => {
		expect(on('Super NAV 1 shows NAV 1 on the whole screen.')).toEqual([['Super NAV 1', SUPER_1], ['NAV 1', NAV_1]]);
	});

	it('does not link the page the section describes, nor the name twice since the last heading', () => {
		expect(links([heading(2, NAV[1]), paragraph(text('This is Super NAV 1.'))], 'pages/nav.mdx')).toEqual([]);
		expect(on('Super NAV 5 and again Super NAV 5.')).toHaveLength(1);
	});

	it('does not link a longer name: "Super NAV 12", "Super NAV 5x", "Super NAV 5/"', () => {
		expect(on('Super NAV 12 and Super NAV 5x and Super NAV 5/6')).toEqual([]);
	});

	it('links a name that a line break splits, as a whole', () => {
		expect(on('Open Super\nNAV 5 for the map.')).toEqual([['Super\nNAV 5', SUPER_5]]);
	});

	it('leaves "super NAV 5" in lower case as plain text: page names are case-sensitive, and its "NAV 5" is no link', () => {
		expect(on('Open super NAV 5 for the map.')).toEqual([]);
	});
});
