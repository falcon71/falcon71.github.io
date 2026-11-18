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

/** Runs the plugin on a tree of the given file of the NAV chapter and returns the links as [text, url]. */
function links(children: Node[], file = 'pages/other.mdx'): [string, string][] {
	const tree: Node = {type: 'root', children};
	const docs = new URL('../content/docs/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
	remarkPageLinks({base: '/kln90b'})(tree, {path: `${docs}${file}`});
	const found: [string, string][] = [];
	const visit = (n: Node) => {
		if (n.type === 'link') found.push([n.children!.map(c => c.value).join(''), n.url!]);
		else n.children?.forEach(visit);
	};
	visit(tree);
	return found;
}

describe('remarkPageLinks, full-screen pages', () => {
	it('links "Super NAV 1" as a whole to its own section, not its "NAV 1" to the NAV 1 heading', () => {
		expect(links([paragraph(text('Open Super NAV 1 for the big screen.'))])).toEqual([
			['Super NAV 1', '/kln90b/pages/nav/#super-nav-1-nav-1-on-the-whole-screen'],
		]);
	});

	it('links "Super NAV 5" as a whole to its own section', () => {
		expect(links([paragraph(text('Open Super NAV 5 for the map.'))])).toEqual([
			['Super NAV 5', '/kln90b/pages/nav/#super-nav-5-the-map-on-the-whole-screen'],
		]);
	});

	it('still links a bare "NAV 1" to the NAV 1 heading', () => {
		expect(links([paragraph(text('Open NAV 1 first.'))])).toEqual([
			['NAV 1', '/kln90b/pages/nav/#nav-1-the-navigation-situation'],
		]);
	});

	it('links both a Super NAV 1 and a bare NAV 1 in one text, each once and to its own section', () => {
		expect(links([paragraph(text('Super NAV 1 shows NAV 1 on the whole screen.'))])).toEqual([
			['Super NAV 1', '/kln90b/pages/nav/#super-nav-1-nav-1-on-the-whole-screen'],
			['NAV 1', '/kln90b/pages/nav/#nav-1-the-navigation-situation'],
		]);
	});

	it('does not link the page the section describes, nor the name twice since the last heading', () => {
		expect(links([heading(2, 'Super NAV 1: NAV 1 on the whole screen'), paragraph(text('This is Super NAV 1.'))], 'pages/nav.mdx')).toEqual([]);
		expect(links([paragraph(text('Super NAV 5 and again Super NAV 5.'))])).toHaveLength(1);
	});
});
