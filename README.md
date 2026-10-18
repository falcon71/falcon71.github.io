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

```mdx
<KlnScreen
	id="nav-1"
	title="NAV 1 page"
	left={`
{from:KPDX }{arrow:›}{to:KSEA }
{dis:DIS  45.2nm}
`}
	status={`{page:NAV 1}`}
>
	<Field id="dis" title="Distance to the active waypoint">Explanation shown in the help window.</Field>
	<Field id="page" title="Page name">...</Field>
</KlnScreen>
```

- `{id:text}` marks a field, label and value together. `{id!:text}` shows it inverse, `{id~:text}` marks it as
  flashing on the unit.
- Pointing at a field shows its explanation; a click or tap keeps it open. `#screen-nav-1--dis` links straight to it.
- With only `left` or only `right` the screen is cut in half, and `status` is just that side's page name. With both
  (or `full`) the whole screen is shown and `status` is the full 23-character status line.
- The build fails when a row is wider than the screen.

## License

The manual and the site are released under [CC0 1.0 Universal](LICENSE). The KLN font
(`kln90b/src/assets/fonts/kln90b.ttf`) comes from the [kln90b project](https://github.com/falcon71/kln90b) and is
licensed under the LGPL-3.0; its license texts are next to it.
