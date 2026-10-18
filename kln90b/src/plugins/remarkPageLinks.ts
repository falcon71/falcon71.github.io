/**
 * Links every page name of the unit in the text to that page in the page reference:
 *   "NAV 1", "SET 10", "SET10", "D/T 2"   a numbered page, links to its heading on the group's chapter
 *   "the VOR page"                         a page without number, written with "page"
 *   "the APT pages"                        a page group, links to the group's chapter
 *
 * A page's heading is the one that starts with its name: "NAV 1", or "APT 8: approaches".
 *
 * Not linked: the page that the current section describes (a heading of this file above it names it), a page
 * already linked in the same section, and anything in headings, links and code. A page name with no chapter yet
 * stays plain text, and the build prints a warning.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import GithubSlugger, { slug } from 'github-slugger';
import { leftTree, rightTree } from '../data/pageTree';

interface Options {
	/** The site's base path, e.g. "/kln90b" */
	base: string;
}

interface MdNode {
	type: string;
	value?: string;
	depth?: number;
	url?: string;
	children?: MdNode[];
}

const DOCS_DIR = fileURLToPath(new URL('../content/docs/', import.meta.url));

// "SET10" and "SET 10" are the same page; the status line writes the former, the manual the latter
const normalize = (name: string) => name.replace(/^(\S+?)\s*(\d+)$/, '$1 $2').trim();

const groups = [...leftTree, ...rightTree];
const pageGroup = new Map<string, string>();
for (const g of groups) for (const p of g.pages) pageGroup.set(normalize(p), g.name);

const groupNames = [...new Set(groups.map((g) => g.name))];
const numbered = [...new Set(groups.filter((g) => g.pages.length > 1).map((g) => g.name))];
const single = groups.filter((g) => g.pages.length === 1).map((g) => g.name);
const alt = (names: string[]) => names.map((n) => n.replace('/', '\\/')).join('|');
const PATTERN = new RegExp(
	`(?<![\\w/])(?:(${alt(numbered)}) ?(\\d{1,2})(?![\\w/])|(${alt(single)}) page(?!s)\\b|(${alt(groupNames)}) pages\\b)`,
	'g',
);

const groupFile = (group: string) => group.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Whether a heading anchor belongs to a page: "apt-8" and "apt-8-approaches" do, "apt-80" does not */
const headingOf = (anchor: string, pageAnchor: string) => anchor === pageAnchor || anchor.startsWith(`${pageAnchor}-`);

// Heading anchors of each chapter, read once per build
const anchorCache = new Map<string, Set<string> | null>();
function chapterAnchors(file: string): Set<string> | null {
	if (!anchorCache.has(file)) {
		const source = ['.mdx', '.md'].map((ext) => path.join(DOCS_DIR, 'pages', file + ext)).find((p) => fs.existsSync(p));
		if (!source) {
			anchorCache.set(file, null);
		} else {
			const slugger = new GithubSlugger();
			const headings = [...fs.readFileSync(source, 'utf-8').matchAll(/^#{2,6}\s+(.+?)\s*#*$/gm)];
			anchorCache.set(file, new Set(headings.map((h) => slugger.slug(h[1]))));
		}
	}
	return anchorCache.get(file)!;
}

const warned = new Set<string>();
function warnOnce(message: string) {
	if (!warned.has(message)) {
		warned.add(message);
		console.warn(`[page links] ${message}`);
	}
}

interface Target {
	/** Content path of the chapter, e.g. "pages/nav" */
	doc: string;
	anchor?: string;
	url: string;
}

function resolve(match: RegExpExecArray, base: string): Target | null {
	const [, numGroup, number, singleName, groupName] = match;
	let group: string;
	let anchor: string | undefined;
	if (numGroup) {
		const name = normalize(`${numGroup} ${number}`);
		if (!pageGroup.has(name)) return null;
		group = pageGroup.get(name)!;
		anchor = slug(name);
	} else if (singleName) {
		group = singleName;
		anchor = slug(singleName);
	} else {
		group = groupName;
	}
	const file = groupFile(group);
	const anchors = chapterAnchors(file);
	if (!anchors) {
		warnOnce(`no chapter pages/${file} for "${match[0]}"`);
		return null;
	}
	if (anchor) {
		const pageAnchor = anchor;
		anchor = [...anchors].find((a) => headingOf(a, pageAnchor));
		if (!anchor) warnOnce(`pages/${file} has no heading for "${match[0]}", linking the chapter`);
	}
	return { doc: `pages/${file}`, anchor, url: `${base}/pages/${file}/${anchor ? `#${anchor}` : ''}` };
}

const SKIP = new Set(['link', 'linkReference', 'heading', 'code', 'inlineCode', 'html', 'mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression']);

function textOf(node: MdNode): string {
	return node.value ?? (node.children ?? []).map(textOf).join('');
}

export default function remarkPageLinks(options: Options) {
	return (tree: MdNode, file: { path?: string; history?: string[] }) => {
		const filePath = file.path ?? file.history?.[0] ?? '';
		const doc = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
		const slugger = new GithubSlugger();
		let headingChain: string[] = [];
		let linked = new Set<string>();

		const linkText = (value: string): MdNode[] | null => {
			const out: MdNode[] = [];
			let last = 0;
			let changed = false;
			for (const m of value.matchAll(PATTERN)) {
				const target = resolve(m as RegExpExecArray, options.base);
				if (!target) continue;
				const describedHere = target.doc === doc && (!target.anchor || headingChain.includes(target.anchor));
				// The section describing the page may be in another file too, e.g. a heading "NAV 1" on an Operation page
				const named = slug(normalize(m[0].replace(/ pages?$/, '')));
				if (headingChain.some((a) => a && headingOf(a, named))) continue;
				if (describedHere || linked.has(target.url)) continue;
				linked.add(target.url);
				if (m.index! > last) out.push({ type: 'text', value: value.slice(last, m.index) });
				out.push({ type: 'link', url: target.url, children: [{ type: 'text', value: m[0] }] });
				last = m.index! + m[0].length;
				changed = true;
			}
			if (!changed) return null;
			if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
			return out;
		};

		const walk = (node: MdNode) => {
			if (!node.children) return;
			const children: MdNode[] = [];
			for (const child of node.children) {
				if (child.type === 'text') {
					children.push(...(linkText(child.value!) ?? [child]));
				} else {
					if (!SKIP.has(child.type)) walk(child);
					children.push(child);
				}
			}
			node.children = children;
		};

		for (const node of tree.children ?? []) {
			if (node.type === 'heading') {
				headingChain = headingChain.slice(0, node.depth! - 2);
				headingChain[node.depth! - 2] = slugger.slug(textOf(node));
				linked = new Set();
			} else if (!SKIP.has(node.type)) {
				walk(node);
			}
		}
	};
}
