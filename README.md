# falcon71.github.io

GitHub Pages site of falcon71. The KLN 90B manual lives in [`kln90b/`](kln90b/) and is published at
https://falcon71.github.io/kln90b/.

## Structure

| Path                           | What it is                                                         |
| ------------------------------ | ------------------------------------------------------------------ |
| `index.html`                   | The site root; forwards to the manual                              |
| `kln90b/`                      | The manual: an [Astro](https://astro.build) site with [Starlight](https://starlight.astro.build) |
| `kln90b/src/content/docs/`     | The pages, one Markdown/MDX file each                              |
| `kln90b/src/components/`       | Screen (`KlnScreen`, `Field`), tooltip (`Term`), boxes (`Callout`), knob demo, drawings |
| `kln90b/src/data/glossary.ts`  | Every explained term; tooltips and the glossary page read it       |
| `.github/workflows/pages.yml`  | Builds the manual and deploys the site                             |

## Working on the manual locally

Needs Node.js 22 or newer.

```bash
cd kln90b
npm install
npm run dev        # live preview at http://localhost:4321/kln90b/, reloads on every save
```

Search only works on a built site:

```bash
npm run build
npm run preview    # the built site at http://localhost:4321/kln90b/
```

## Publishing

Pushing to `main` runs the workflow, which builds the manual and deploys it. In the repository settings, Pages →
Build and deployment → Source must be set to "GitHub Actions" once.

## Writing a screen

A screen of the unit is generated from the simulated unit (see `kln90b/generator/README.md`), and a page shows it by its id:

```mdx
<KlnScreen screen="apt-1-ksea" />
```

The folder `kln90b/screens/<id>/` holds the description (`screen.ts`), the explanations of the fields (`fields.mdx`, with
`<Field id title>` and `<Term>` written without imports) and the generated `screen.txt`. `npm run screens -- <id>` in
`kln90b/` writes it. The build fails, naming the screen and the command to run, when a page names a screen that was never
generated or when the explanations and the fields of the screen differ. `title="..."` replaces the title of the generated
file. A page name in an explanation becomes a link like anywhere else.

The description is explained in `kln90b/generator/README.md` ("Describing a screen"). A screen must not flash `msg` on its
status line unless it sets `keepMessages: true`; the generator starts the unit at its last position, and a step that
raises a message answers it ("Messages" there). Screens that share a state import it
from `kln90b/screens/shared/`, a folder without a `screen.ts`, which the generator skips.

### Hand-built screens

A screen that is no state of the unit is written by hand: an illustration of a status line alone, say, or one that shows
nothing the unit would display. A page that a draft drew wrongly is generated in the nearest real state instead, not
written by hand. The knob demo of the quickstart is not a `<KlnScreen>` at all.

```mdx
<KlnScreen
	id="status-line-demo"
	title="The status line"
	status={`{page:NAV 1}`}
>
	<Field id="page" title="Page name">Explanation shown in the help window.</Field>
</KlnScreen>
```

- `{id:text}` marks a field, label and value together. `{id!:text}` shows it inverse, `{id~:text}` marks it as
  flashing on the unit. `<Field>` needs `import Field from '../../components/Field.astro'`.
- Pointing at a field shows its explanation; a click or tap keeps it open. `#screen-status-line-demo--page` links straight
  to it.
- With only `left` or only `right` the screen is cut in half, and `status` is just that side's page name. With both
  (or `full`) the whole screen is shown and `status` is the full 23-character status line.
- The build fails when a row is wider than the screen.

## Page links

Page names in the text ("NAV 1", "SET10", "the VOR page", "the APT pages") become links to the page reference
when the site is built (`kln90b/src/plugins/remarkPageLinks.ts`). Not linked: the page the current section
describes, a page already linked since the last heading, and anything in headings, links and code. A name whose
chapter or heading does not exist yet stays plain text, and the build prints a `[page links]` warning.

## License

The manual and the site are released under [CC0 1.0 Universal](LICENSE). The KLN font
(`kln90b/src/assets/fonts/kln90b.ttf`) comes from the [kln90b project](https://github.com/falcon71/kln90b) and is
licensed under the LGPL-3.0; its license texts are next to it.
