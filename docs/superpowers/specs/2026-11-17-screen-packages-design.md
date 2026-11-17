# Screen packages

## Intent

`kln90b/screens/` holds every generated screen as one flat list of folders, and the list has grown past the point where
it can be overlooked. Packages, folders nested to any depth, give it an order. As in a programming language, a package is
also a namespace: the full id of a screen is its path, so two packages may hold screens of the same name.

## Goals, non-goals, anti-goals

- Goal: screens may sit in packages and subpackages of any depth; a screen's id is its path below `screens/` with `/`,
  for example `<KlnScreen screen="pages/apt/apt-1-ksea" />`.
- Goal: packages are optional. A screen directly in `screens/` stays valid, with its folder name as its id.
- Goal: the current screens are sorted into packages (the maintainer left the grouping to the builder; see below).
- Non-goal: no change to what a screen shows, to `screen.ts` descriptions beyond their import paths, or to the
  generated `screen.txt` and map files beyond their location.
- Anti-goal: a second way of naming a screen. The id has one spelling everywhere: the page, the figure's anchor, the
  error messages and the `npm run screens` filter.

## Approaches

1. **The folder decides (chosen by the maintainer).** A folder with a `screen.ts` is a screen; any other folder is a
   package. The id is the path below `screens/`. No new files.
2. A marker file per package. Explicit, but ceremony that approach 1 does without.
3. The id declared in `screen.ts`. Independent of the location, but it drifts from where the file is, which defeats the
   packages.

## Design

- **Id.** `path.relative(SCREENS, dir)` with `/` as separator, in `generator/lib/generate.ts` (`generateScreen` and the
  test name in `defineScreen`). The figure is `#screen-<id>`, a field `#screen-<id>--<field>`, an excerpt
  `#screen-<id>--rows-1-2`, slashes included; a `/` is legal in an HTML id and a URL fragment, and the hash parser in
  `KlnScreen.astro` already accepts it.
- **Discovery.** The one-level globs become recursive: the Vitest project `screens` (`screens/**/screen.ts`),
  `src/lib/screens.ts` (`screen.txt`, `map-*.svg`), its test in `src/lib/screenFile.test.ts`, and the `fields.mdx`
  loader in `src/content.config.ts`, whose `generateId` returns the folder path instead of its first segment.
- **Leaf rule.** A screen folder may not contain another screen. The build fails naming both (a check in
  `src/lib/screens.ts`, tested). `shared/` and any other folder without `screen.ts` is a package or a helper folder.
- **Filter.** `npm run screens -- screens/pages/apt` generates a package, as Vitest filters by path. The manifest rule
  for filtered runs is unchanged.
- **Helpers.** `screens/shared/` stays at the top; the screens' relative imports get as deep as their folder.
- **Moving.** Folders move with `git mv` so that history follows; `screen.txt` and the map SVGs move with them and are
  regenerated with `npm run screens` (no filter), which must leave them unchanged.
- **References.** Every `screen="…"` and `#screen-…` link in `src/content/docs/` takes the new id. The docs that
  describe the layout (`README.md`, `kln90b/generator/README.md`, `docs/style-guide.md`, the comments in
  `KlnScreen.astro`, `src/lib/screens.ts`, `content.config.ts`) say `screens/<id>/` where `<id>` may contain packages.
  Dated records (`docs/plan/`, earlier specs) are not rewritten.

## The grouping (the builder's call)

Screens of one unit page go into `pages/<page>/` and keep their full names, which read like the page and its state
(`pages/apt/apt-1-ksea`). Topic packages hold screens whose point is a mechanism or a sequence rather than a page; there
the prefix the package already states is dropped.

| Package | Screens |
| ------- | ------- |
| `pages/act/` | act-direct-to, act-no-active, act-terminal-fix, act-vor-olm, apt-act-1 |
| `pages/apt/` | apt-1-…, apt-2-…, …, apt-8-…, apt-confirm, apt-create-new-wpt |
| `pages/flr/`, `pages/int/`, `pages/ndb/`, `pages/oth/`, `pages/sta/`, `pages/sup/`, `pages/vor/` | the screens of that prefix |
| `pages/fpl/` | fpl-0-delete-question |
| `pages/nav/` | nav-1, nav-5-ksea, nav-1-apt-1-ksea, home-nav-1 |
| `pages/set/` | set-1-latitude-entry, set-2-date-entry, set-3-cursor, set-10, set-10-failures |
| `display/` | cursor-example, screen-layout, status-line-crsr-both-sides, page-pair-fpl-0-dt-1, keyboard-mode-fpl-0 |
| `power-on/` | self-test, turn-on-page, turn-on-page-cursor, database-page, database-page-expired, vfr-only-page, obs-warning-page |
| `direct-to/` | create-waypoint, ident-entry |
| `waypoint/` | dup-page, no-such-wpt, no-sup-wpts, take-right-after, take-right-before |
| `failures/` | msg-battery-low, msg-rcvr-hardware, msg-user-data-lost, self-test-fail |
| `gps/` | raim-not-available; `gps/failures/`: ant-gain, jamming, jamming-lost, satellite, spoofing-captured, spoofing-mixed |
| `tutorial-1/` | direct-to |
| `tutorial-2/` | apt-7-sid-load, apt-7-sid-procedure, apt-7-star-load, apt-7-star-procedure, apt-7-star-transition, apt-8-approach, apt-8-iaf, apt-8-load, super-nav-5-route |

## Left to the builder

- The exact error texts of the new checks.
- Whether the leaf rule lives in the site build, the generator, or both.

## Verification

`npm run screens:test`, `npm run screens` (all screens, no diff in any `screen.txt` or map beyond the move),
`npm run build` (every reference resolves), and a look at a moved screen and an anchor link in the preview.
