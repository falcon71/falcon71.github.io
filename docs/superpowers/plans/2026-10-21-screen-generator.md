# Screen Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate the manual's example screens from the simulated KLN 90B (pinned as a git submodule), commit them, and
render them on the site by id, with fields, explanations and maps defined once per screen.

**Architecture:** The kln90b repository is a submodule at `vendor/kln90b`. A Vitest run, launched with the submodule's
own Vitest and dependencies, treats every `kln90b/screens/<id>/screen.ts` as a test file: it boots the unit through the
kln90b test harness, performs the screen's steps, reads one blink cycle of the screen, locates the fields and writes
`screen.txt` (and `map-L.svg` / `map-R.svg`) next to it. The Astro site reads those files and each screen's
`fields.mdx` at build time; MDX pages say only `<KlnScreen screen="<id>" />`.

**Tech Stack:** TypeScript, Vitest 5 and happy-dom from `vendor/kln90b/node_modules`, the kln90b test harness, Astro 7
with Starlight, Node 22.

**Spec:** `docs/superpowers/specs/2026-10-21-screen-generator-design.md` (read it first). The site rules it builds on
are in the maintainer's site specification, outside the repository.

**Not in this plan** (a follow-up plan, after this one lands): procedures from the FAA CIFP (APT 7, APT 8, ACT pages
with procedures), airspaces for the airspace alert screens, and Super NAV 5 (not a text grid; it needs a layout of its
own). This plan delivers every other part of the design.

## Global Constraints

- Never modify, commit in, or run `npm install`/`git` write commands against `E:\msfs\kln90b`. The submodule
  `vendor/kln90b` is only ever checked out at its pin and gets `npm ci`; nothing in it is edited.
- Never `git push`. Commit on the branch `screen-generator-design` (or a branch made from it); merging is the
  maintainer's call.
- Submodule URL `https://github.com/falcon71/kln90b.git`, pinned to `3d371f34a68144c80f8e7035490d8f0391b0eb45`
  (origin/main when this plan was written, which contains `test/harness/`).
- Exactly one Vitest instance: the one in `vendor/kln90b/node_modules`. Do not add `vitest`, `happy-dom`,
  `@napi-rs/canvas` or `@microsoft/msfs-sdk` to `kln90b/package.json`. Files outside the submodule reach bare imports
  through the `resolveFromVendor` plugin (Task 1).
- The GitHub Pages workflow `.github/workflows/pages.yml` is not changed, and `npm ci && npm run build` in `kln90b/`
  must work without the submodule checked out.
- Navdata comes only from FAA NASR files the maintainer downloads; nothing from Navigraph or the simulator. The
  magnetic model is NOAA's WMMHR2025 (`WMMHR.COF`), evaluated to degree and order 12 for screens.
- Copied kln90b code keeps its license: it lives in `kln90b/generator/harness-lgpl/` with the license texts next to it.
- `target: es2017` does not apply here (that is the instrument); the generator runs on Node 22.
- American English in code comments, docs and commit messages. No counts in prose for things that grow (write "the
  screens in `kln90b/screens/`", not "the eight screens").
- Commit messages are plain sentences ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- A Windows checkout with `core.autocrlf` turns `screen.txt` into CRLF: the parser must read CRLF and LF alike, and
  trailing blanks of a row must survive (Task 2, `parses CRLF`; Task 1 adds `.gitattributes`).
- The generator run with the submodule missing, without `npm ci`, with local changes in the submodule, or checked out
  off its pin: it must stop before booting anything and print the command that fixes it (Task 1, `checkVendor`).
- A field pattern that would match across the middle line, into the status line, twice, or overlapping another field
  must fail generation with the screen and field named (Task 3).
- A flashing field read in its dark phase, or a clock that ticks during the blink cycle: the captured screen must still
  hold the text and mark the cells flashing (Task 4, `mergeCycle`).
- An MDX page naming a screen that has no generated file, or explanations that drifted from the fields: the site build
  must fail with the screen id and the command to run (Task 8, `checkExplanations` and the missing-screen error).

---

## File Structure

All paths are relative to the repository root `E:\msfs\falcon71.github.io`.

```
.gitmodules                               the submodule
vendor/kln90b/                            the submodule (pinned, never edited)
.gitattributes                            kln90b/screens/** eol=lf
kln90b/
  package.json                            + scripts "screens", "screens:test"
  tsconfig.json                           + exclude generator/ and screens/**/*.ts
  generator/
    README.md                             how to set up, run, write a screen
    run.mjs                               launcher: checks the submodule, runs its Vitest from its root
    vendorCheck.mjs                       checkVendor(): pure check of the submodule state
    vitest.config.mts                     projects unit / capture / screens, resolveFromVendor, JSX, scss
    tsconfig.json                         type check of generator/ and screens/ against the submodule's types
    api.ts                                everything a screen.ts may import
    lib/
      paths.ts                            VENDOR, SITE, SCREENS absolute paths
      fields.ts                           field definitions and locateFields()
      capture.ts                          mergeCycle(), captureScreen()
      generate.ts                         generateScreen(), defineScreen()
      mapSvg.ts                           blocksToSvg()
      wmm.ts                              loadWmm(), declination(), decimalYear()
      navdata.ts                          loadExtract(), facilitiesOf(), place()
    harness-lgpl/
      LICENSE.LGPL-3.0.txt, LICENSE.GPL-3.0.txt, README.md
      builders.ts                         copy of vendor test/harness/navdata/builders.ts, extended
    wmm/WMMHR.COF, wmm/WMMHR2025_TEST_VALUES.txt, wmm/README.md
    navdata/
      regions.json                        the extract regions
      extract-nasr.mjs                    NASR CSV → nasr-<cycle>.json
      nasr-<cycle>.json                   committed extract
      README.md                           where the data comes from, how to re-extract
    test/                                 tests of the generator (*.test.ts unit, *.capture.test.ts capture)
  screens/<id>/
    screen.ts                             the description (test file of the "screens" project)
    fields.mdx                            the explanations, one <Field> per field id
    screen.txt                            generated
    map-L.svg / map-R.svg                 generated, only for map pages
  src/lib/
    screenFile.ts                         ScreenCapture type, parseScreenFile(), serializeScreenFile()
    explanations.ts                       fieldIdsOf(), explanationMismatch() (generator and site)
    screenHtml.ts                         segments and HTML of a screen (hand markup and captures)
    screens.ts                            checkExplanations(), loading of captures for the site
  src/components/KlnScreen.astro          + screen prop
  src/content.config.ts                   + screenFields collection
```

---

### Task 1: Submodule, launcher and a first headless boot

Proves the chain the design lists under "Risks to check first": the harness runs from the submodule under a config
that lives here, and a screen reads the same on two runs.

**Files:**
- Create: `.gitmodules`, `vendor/kln90b` (submodule), `.gitattributes`
- Create: `kln90b/generator/run.mjs`, `kln90b/generator/vendorCheck.mjs`, `kln90b/generator/vitest.config.mts`,
  `kln90b/generator/tsconfig.json`, `kln90b/generator/lib/paths.ts`, `kln90b/generator/README.md`
- Modify: `kln90b/package.json` (scripts), `kln90b/tsconfig.json` (exclude)
- Test: `kln90b/generator/test/vendorCheck.test.ts`, `kln90b/generator/test/smoke.capture.test.ts`

**Interfaces:**
- Produces: `npm run screens [-- <vitest filters>]` (runs project `screens`), `npm run screens:test` (runs projects
  `unit` and `capture`); `VENDOR`, `SITE`, `SCREENS` from `lib/paths.ts` (absolute paths of `vendor/kln90b`,
  `kln90b/`, `kln90b/screens/`); `checkVendor(state: VendorState): string | null` (null = fine, else the message);
  `vendorCommit(): string` (40-char HEAD of the submodule).

- [ ] **Step 1: Add the submodule**

```bash
git submodule add https://github.com/falcon71/kln90b.git vendor/kln90b
git -C vendor/kln90b checkout 3d371f34a68144c80f8e7035490d8f0391b0eb45
npm ci --prefix vendor/kln90b
```

Expected: `git submodule status` prints ` 3d371f34a68144c80f8e7035490d8f0391b0eb45 vendor/kln90b` (leading blank, not
`+`). Add `.gitattributes` with `kln90b/screens/** text eol=lf`.

- [ ] **Step 2: Write the failing test for `checkVendor`**

`vendorCheck.mjs` exports `checkVendor({exists, nodeModules, statusLine, porcelain})` where `exists` and
`nodeModules` are booleans (`vendor/kln90b/package.json` and `vendor/kln90b/node_modules/vitest` exist),
`statusLine` is the output of `git submodule status vendor/kln90b`, and `porcelain` that of
`git -C vendor/kln90b status --porcelain`. Test `kln90b/generator/test/vendorCheck.test.ts`:

```ts
const ok = {exists: true, nodeModules: true, statusLine: ' 3d371f3 vendor/kln90b (heads/main)', porcelain: ''};
it('accepts a clean submodule at its pin', () => expect(checkVendor(ok)).toBeNull());
it('asks for the submodule', () => expect(checkVendor({...ok, exists: false})).toContain('git submodule update --init'));
it('asks for its dependencies', () => expect(checkVendor({...ok, nodeModules: false})).toContain('npm ci --prefix vendor/kln90b'));
it('refuses a submodule off its pin', () => expect(checkVendor({...ok, statusLine: '+9f0c1d2 vendor/kln90b'})).toContain('git submodule update'));
it('refuses local changes', () => expect(checkVendor({...ok, porcelain: ' M kln90b/Gps.ts'})).toContain('local changes'));
```

- [ ] **Step 3: Implement `vendorCheck.mjs` and `run.mjs`**

`run.mjs` gathers the state (`fs.existsSync`, `child_process.execFileSync('git', ...)` from the repository root),
prints `checkVendor`'s message and exits 1 when it is not null. Otherwise it spawns, with `cwd: VENDOR` (the harness
resolves `resources/` from `process.cwd()`) and `stdio: 'inherit'`:
`process.execPath <VENDOR>/node_modules/vitest/vitest.mjs run --config <SITE>/generator/vitest.config.mts <args>`, and
exits with the child's code. No shell. `package.json` scripts: `"screens": "node generator/run.mjs --project screens"`,
`"screens:test": "node generator/run.mjs --project unit --project capture"`.

- [ ] **Step 4: Write `vitest.config.mts`**

`root: SITE`. Plugins: the `.scss` stub copied from `vendor/kln90b/vitest.config.mts`, and `resolveFromVendor`:

```ts
// Bare imports from files outside the submodule resolve as if imported from inside it, so that the screens, the
// generator and the harness share one copy of vitest, the SDK and happy-dom.
const resolveFromVendor = {
    name: 'resolve-from-vendor', enforce: 'pre' as const,
    async resolveId(this: any, source: string, importer?: string) {
        if (!importer || source.startsWith('.') || source.startsWith('\0') || path.isAbsolute(source)) return null;
        if (path.resolve(importer).startsWith(VENDOR)) return null;
        return this.resolve(source, path.join(VENDOR, 'package.json'), {skipSelf: true});
    },
};
```

`oxc.jsx` exactly as in the vendor config. Projects: `unit` (environment `node`, include
`generator/test/**/*.test.ts` minus `*.capture.test.ts`, and `src/lib/**/*.test.ts`), `capture` (happy-dom, include
`generator/test/**/*.capture.test.ts`, setupFiles `<VENDOR>/test/harness/setup/dom.ts`, testTimeout 120 000), `screens`
(happy-dom, include `screens/*/screen.ts`, same setup, testTimeout 120 000). The `onConsoleLog` filter of the vendor
config is copied too.

- [ ] **Step 5: Write the smoke test** `generator/test/smoke.capture.test.ts`

```ts
import {bootUnit, settle} from '../../../vendor/kln90b/test/harness/boot';
import {Screen} from '../../../vendor/kln90b/test/harness/render/screen';

async function nav1(): Promise<string> {
    const unit = await bootUnit({position: {lat: 47.45, lon: -122.31}});
    await settle(unit);
    await unit.panel.selectPage('L', 'NAV 1');
    return Screen.read().dump();
}
let first = '';
it('reads NAV 1', async () => {
    first = await nav1();
    expect(first.split('\n')[6].slice(0, 5)).toBe('NAV 1');
});
// One unit per test: the second boot runs after the first unit's teardown
it('reads the same screen on a second boot', async () => expect(await nav1()).toBe(first));
```

- [ ] **Step 6: Run**

Run: `npm run screens:test` (from `kln90b/`). Expected: PASS. If module resolution fails (two copies of vitest, the SDK
not found, the JSX pragma not applied), stop and report the error instead of adding dependencies to
`kln90b/package.json`. Repeatability across separate runs is checked again in Tasks 9 and 10.

- [ ] **Step 7: Type check and site build**

`generator/tsconfig.json`: `strict`, `module: esnext`, `moduleResolution: bundler`, `jsx: react` with
`jsxFactory: FSComponent.buildComponent`, `include: ["**/*.ts", "../screens/**/*.ts"]`, `typeRoots` and `paths`
pointing `*` at `../../vendor/kln90b/node_modules/*`. Site `kln90b/tsconfig.json`: add `"generator"` and
`"screens/**/*.ts"` to `exclude`. Run `node ../vendor/kln90b/node_modules/typescript/bin/tsc -p generator --noEmit`
(expected: no errors) and `npm run build` (expected: the site builds as before).

- [ ] **Step 8: Write `generator/README.md`** (setup: `git submodule update --init`, `npm ci --prefix vendor/kln90b`;
commands; moving the pin: check out the new commit in the submodule, commit the pointer, `npm ci`, regenerate all,
review the diff) **and commit**

```bash
git add .gitmodules .gitattributes vendor/kln90b kln90b/package.json kln90b/tsconfig.json kln90b/generator
git commit -m "Add the kln90b submodule and run its test harness from the docs repository."
```

---

### Task 2: The screen file format

**Files:**
- Create: `kln90b/src/lib/screenFile.ts`
- Test: `kln90b/src/lib/screenFile.test.ts`

**Interfaces:**
- Produces:

```ts
export type CellAttr = '.' | 'I' | 'B' | 'F';      // normal, inverse, flashing text, flashing inverse
export type Show = 'left' | 'right' | 'both';
export interface FieldPart { row: number; from: number; to: number }   // screen row 0-6, columns 0-22, to exclusive
export interface ScreenCapture {
    kln90b: string;            // 40-char commit
    title: string;
    show: Show;
    layout: 'split' | 'full';  // split: halves in columns 0-10 and 12-22, column 11 the middle line
    status: boolean;           // false only for a full page without status line (the welcome page)
    text: string[];            // 7 rows of 23 characters
    mask: CellAttr[][];        // 7 rows of 23
    fields: Map<string, FieldPart[]>;   // in order of the description
    maps: ('L' | 'R')[];       // sides with a map-<side>.svg
}
export function serializeScreenFile(c: ScreenCapture): string;
export function parseScreenFile(text: string): ScreenCapture;   // throws on any malformed line, naming it
```

The format (LF, one item per line, rows between `|` so trailing blanks stay visible and survive editors):

```
# Generated by "npm run screens" from screen.ts in this folder. Do not edit.
kln90b 3d371f34a68144c80f8e7035490d8f0391b0eb45
title APT 1 page
show right
layout split
status yes
text
|<23 characters>|
  ... 7 rows
mask
|<23 of . I B F>|
  ... 7 rows
field ident 0 15 19
field name 1 12 23
field name 2 12 20
map R
```

- [ ] **Step 1: Write the failing tests** `round-trips a capture` (a literal capture with special glyphs `η`, `°`,
trailing blanks, a two-part field and `maps: ['L']`: `parseScreenFile(serializeScreenFile(c))` deep-equals `c`),
`parses CRLF` (the serialized text with `\n` replaced by `\r\n` parses to the same capture), `rejects a short row`
(a 22-character text row throws a message containing `text row 3`), `rejects an unknown attribute` (`X` in the mask
throws containing `mask row`), and `rejects a field outside the screen` (`field a 7 0 1` throws).

- [ ] **Step 2: Run** `npm run screens:test` — expected FAIL (module missing).
- [ ] **Step 3: Implement `screenFile.ts`** (no imports; the site and the generator both use it).
- [ ] **Step 4: Run** — expected PASS.
- [ ] **Step 5: Commit** `Add the generated screen file format.`

---

### Task 3: Locating fields

**Files:**
- Create: `kln90b/generator/lib/fields.ts`
- Test: `kln90b/generator/test/fields.test.ts`

**Interfaces:**
- Consumes: `FieldPart`, `ScreenCapture['text']` shape (Task 2).
- Produces:

```ts
export type Area = 'L' | 'R' | 'S' | 'F';   // left half, right half, status line, full page
export type Locator =
    | RegExp                                            // searched in every visible area
    | {re: RegExp; area?: Area; row?: number}           // row is 0-5 within L/R, 0-6 within F; S has one row
    | {area: Area; row?: number; from?: number; to?: number};   // a place; columns within the area
export interface FieldDef { id: string; find: Locator | Locator[] }   // an array gives a field of several parts
export function locateFields(text: string[], layout: 'split' | 'full', show: Show, defs: FieldDef[]): Map<string, FieldPart[]>;
```

Rules (each violation throws an `Error` whose message starts with `field <id>:`):
- Regexes are matched per row of an area, never across the middle line or rows; `L`/`R` rows are the 11 columns of the
  half, `S` is row 6, `F` rows span 23 columns. Areas hidden by `show` (and `L`/`R` on a full layout, `F` on a split
  one) are not searched; a locator naming one throws.
- A regex locator must match exactly once in the areas it searches (`matches nothing`, `matches 2 times`).
- A place without `from`/`to` covers the row from its first to its last non-blank cell; a blank row throws. With
  `from`/`to` it covers exactly those columns.
- Fields must not overlap (`overlaps field <other>`), and ids must be unique and match `/^[a-z0-9-]+$/`.
- On a cropped screen (`show` left or right) the status line shows only that side's page name, so an `S` locator must
  lie in columns 0-4 (left) or 18-22 (right).

- [ ] **Step 1: Write the failing tests** with a literal 7-row split screen, e.g. row 2 `'DIS  45.2nm|           '`
padded to 23: `finds a regex` (`/DIS +\S+nm/` → `[{row: 2, from: 0, to: 11}]`), `does not cross the middle line`
(a regex that would only match spanning columns 10-12 throws `matches nothing`), `rejects two matches`, `covers a
trimmed row` (`{area: 'R', row: 1}` over `' SEATTLE   '` → `from: 13, to: 20`), `keeps explicit columns`, `rejects a
blank row`, `rejects overlap`, `rejects a hidden half` (`show: 'left'`, locator `{area: 'R', row: 0}`), `rejects a
status field outside the page name on a cropped screen`, `joins parts` (two locators → two parts, in order).
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** `Locate the fields of a generated screen.`

---

### Task 4: Capturing a screen and `defineScreen`

**Files:**
- Create: `kln90b/generator/lib/capture.ts`, `kln90b/generator/lib/generate.ts`, `kln90b/src/lib/explanations.ts`
  (shared with the site, Task 8), `kln90b/generator/api.ts`
- Test: `kln90b/generator/test/mergeCycle.test.ts`, `kln90b/src/lib/explanations.test.ts`,
  `kln90b/generator/test/generate.capture.test.ts`

**Interfaces:**
- Consumes: `locateFields`, `FieldDef` (Task 3); `ScreenCapture`, `serializeScreenFile` (Task 2); `vendorCommit()`
  (Task 1); from the harness: `bootUnit`, `settle`, `BootOptions`, `HeadlessUnit` (`test/harness/boot.ts`),
  `Screen`, `Cell` (`test/harness/render/screen.ts`), `blinkCycle` (`test/harness/render/blink.ts`).
- Produces:

```ts
// capture.ts
export function mergeCycle(reads: Cell[][][]): Cell[][];
export async function captureScreen(): Promise<{layout: 'split' | 'full'; status: boolean; cells: Cell[][]; canvases: {L?: HTMLCanvasElement; R?: HTMLCanvasElement}}>;
// src/lib/explanations.ts (no imports)
export function fieldIdsOf(mdx: string): string[];          // ids of <Field id="..."> in source order
export function explanationMismatch(fieldIds: string[], explained: string[]): string | null;
// generate.ts
export interface ScreenDescription {
    title: string;
    show: Show;
    boot?: Omit<BootOptions, 'facilities' | 'defaultNavdata' | 'magvar' | 'airspaces'>;
    steps?: (unit: HeadlessUnit) => Promise<void>;
    fields: FieldDef[];
}
export async function generateScreen(dir: string, d: ScreenDescription): Promise<void>;
export function defineScreen(moduleUrl: string, d: ScreenDescription): void;   // registers it(<id>, ...) for the folder of moduleUrl
// api.ts re-exports: defineScreen, ScreenDescription, FieldDef, Locator, and from the harness moveAircraft, settle,
// NEAREST_SEARCH_WAIT_MS, pointFrom (test/harness/flight/geo.ts), savedFlightplan (test/harness/storage.ts),
// panelXml and APR_ARM_SWITCH (test/harness/panelXml.ts), plus wait(ms) = vi.advanceTimersByTimeAsync(ms).
```

`mergeCycle` takes the four reads of one blink cycle (`blinkCycle(() => readGrid())`) and returns one grid. Characters
come from the last read. Per cell, the set of attributes seen decides: `{.}` → `.`; `{I}` → `I`; `.`/`B` only, with
`B` seen → `B`; `I`/`F`/`.` with `F` seen, or `{., I}` → `F`; `B` together with `I` or `F` throws naming the cell.

`captureScreen` decides the layout the way `Screen.read` does (visible `.left-page` and `.right-page` → split, visible
`.full-page` → full; a full page containing `.super-nav5-left-controls` throws "Super NAV 5 is not supported yet"),
and `status` by a visible `.statusline`. It reads each of the four ticks with `Screen.read()` and zips `text()` and
`mask()` into cells, and returns the `canvas` elements of the visible half pages at the last tick.

`generateScreen`: boots with `defaultNavdata: false` and the facilities and magnetic variation of Task 7 (until Task 7
lands: `defaultNavdata: true`, `magvar: 0`), `settle`, runs `steps`, captures, locates the fields, reads
`<dir>/fields.mdx` and fails with `explanationMismatch`'s message (or, when the file is missing, `<dir>/fields.mdx is
missing; it needs a <Field> for: a, b, c`), writes `screen.txt`, writes `map-L.svg`/`map-R.svg` (Task 9; until then
none), and deletes any `map-*.svg` it did not write. The id is the folder name and must match `/^[a-z0-9-]+$/`.

- [ ] **Step 1: Write the failing unit tests**
  - `mergeCycle`: `keeps a steady cell`, `marks flashing text` (reads `.`,`B`,`.`,`B` → `B`, char `K` although the
    `B` reads still carry `K`), `marks a flashing inverse cell` (`I`,`F`,`I`,`F` → `F`), `marks a cell that flips between
    normal and inverse` (`.`,`I` → `F`), `takes the characters of the last read` (`0:21` then `0:22` → `0:22`),
    `throws on B with I` (message contains `row 1 column 3`).
  - `explanations`: `fieldIdsOf` on a literal MDX with two `<Field id="dis" title="…">` blocks, one spread over lines
    (`<Field\n\tid="gs"`) → `['dis', 'gs']`; `explanationMismatch(['dis','gs'], ['dis'])` contains `no explanation: gs`;
    `explanationMismatch(['dis'], ['dis','xtk'])` contains `no field: xtk`; equal sets → `null`.
- [ ] **Step 2: Write the failing capture test** `generate.capture.test.ts`: copy a fixture folder
  `generator/test/fixtures/nav-1-smoke/` (a `fields.mdx` with `page` and `dis`) to a temp dir and call
  `generateScreen(tmp, {title: 'NAV 1 page', show: 'left', boot: {position: {lat: 47.45, lon: -122.31}}, steps: u =>
  u.panel.selectPage('L', 'NAV 1'), fields: [{id: 'page', find: {area: 'S', row: 0, from: 0, to: 5}}, {id: 'dis',
  find: /DIS +\S+/}]})`. Assert on the parsed file, not its text: `show === 'left'`, `layout === 'split'`,
  `text[6].slice(0, 5) === 'NAV 1'`, `fields.get('page')` deep-equals `[{row: 6, from: 0, to: 5}]`, `kln90b` matches
  `/^[0-9a-f]{40}$/`. A second test with `fields.mdx` lacking `dis` rejects with `no explanation: dis`.
- [ ] **Step 3: Run** — FAIL. **Step 4: Implement** `capture.ts`, `explanations.ts`, `generate.ts`, `api.ts`.
  **Step 5: Run** `npm run screens:test` — PASS.
- [ ] **Step 6: Commit** `Capture a screen with its blink cycle and write it with its fields.`

---

### Task 5: The magnetic model

**Files:**
- Create: `kln90b/generator/wmm/WMMHR.COF` and `WMMHR2025_TEST_VALUES.txt` (copied from the maintainer's
  `D:\Downloads\WMMHR2025COF\`), `kln90b/generator/wmm/README.md` (source: NOAA NCEI, public domain; model epoch
  2025.0, valid 2025-2030), `kln90b/generator/lib/wmm.ts`
- Test: `kln90b/generator/test/wmm.test.ts`

**Interfaces:**
- Produces:

```ts
export interface WmmModel { epoch: number; maxDegree: number; /* coefficients */ }
export function loadWmm(cof: string): WmmModel;     // the COF text; stops at the line of 9s
export function decimalYear(date: Date): number;    // 2026-07-02T12:00Z → 2026.5 (day of year / days in year)
export function declination(m: WmmModel, latDeg: number, lonDeg: number, year: number, heightKm = 0, maxDegree = m.maxDegree): number;  // degrees, east positive
export function screenModel(): WmmModel;            // WMMHR.COF loaded once
export const SCREEN_DEGREE = 12;
```

The algorithm is the one of the WMM2025 technical report: geodetic to geocentric spherical coordinates on WGS 84,
Schmidt semi-normalized associated Legendre functions, coefficients advanced by their secular variation for
`year - epoch`, declination `atan2(Y, X)` of the field rotated back to geodetic.

- [ ] **Step 1: Write the failing tests**: `matches NOAA's test values`, one case per data line of
  `WMMHR2025_TEST_VALUES.txt` (parse the file in the test; field 1 year, 2 height, 3 lat, 4 lon, 11 declination):
  `expect(Math.abs(declination(m, lat, lon, year, h) - D)).toBeLessThanOrEqual(0.006)`. `truncates to a degree`: a
  model loaded from the COF text with every coefficient line of degree above 12 removed gives, at 47.45 N 122.31 W
  2026.5, the same declination (within 1e-9) as `declination(full, …, 0, 12)`. `decimalYear` of
  `2026-01-01T00:00Z` is `2026`, of `2025-07-02T12:00Z` is `2025.5`.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** `Add the World Magnetic Model for the magnetic variation of the screens.`

---

### Task 6: The NASR extract

The maintainer downloads the current NASR 28-day subscription's CSV data from the FAA (NASR Subscription page) and
unzips it into a folder outside the repository; the script reads that folder. Ask the maintainer for the folder before
this task; do not download it yourself.

**Files:**
- Create: `kln90b/generator/navdata/regions.json`:
  `[{"name": "seattle", "lat": 47.4490, "lon": -122.3093, "radiusNm": 250}]`
- Create: `kln90b/generator/navdata/extract-nasr.mjs` (plain Node, no dependencies; usage
  `node generator/navdata/extract-nasr.mjs <unzipped CSV folder>`), `kln90b/generator/navdata/README.md`
- Create (generated, committed): `kln90b/generator/navdata/nasr-<effective date>.json`
- Test: `kln90b/generator/test/extract.test.ts` (imports the `.mjs` functions)

**Interfaces:**
- Produces the extract format (all angles degrees, true; distances feet; frequencies MHz, NDBs kHz):

```ts
interface NavdataExtract {
    cycle: string;                      // NASR effective date, "YYYY-MM-DD"
    source: string;                     // "FAA NASR 28-day subscription (CSV), effective YYYY-MM-DD"
    regions: {name: string; lat: number; lon: number; radiusNm: number}[];
    airports: {ident: string; name: string; city: string; lat: number; lon: number; elevationFt: number;
        towered: boolean; heliport: boolean;
        runways: {designation: string; headingTrue: number; lengthFt: number; surface: string; lit: boolean; lat: number; lon: number}[];
        frequencies: {use: string; mhz: number}[]}[];
    vors: {ident: string; name: string; type: 'VOR' | 'VOR/DME' | 'VORTAC'; lat: number; lon: number; mhz: number; declinationEast: number; region: string}[];
    ndbs: {ident: string; name: string; lat: number; lon: number; khz: number; region: string}[];
    fixes: {ident: string; lat: number; lon: number; region: string}[];
}
export function parseCsv(text: string): Record<string, string>[];   // RFC 4180, header row, quoted fields
export function extract(folder: string, regions: Region[]): NavdataExtract;
```

Decisions the script implements:
- Inputs `APT_BASE.csv`, `APT_RWY.csv`, `APT_RWY_END.csv`, `FRQ.csv`, `NAV_BASE.csv`, `FIX_BASE.csv`. Columns are
  looked up by name in the header; the script fails naming the file and every missing column. Read the column names
  from the FAA's CSV structure files in the same download, not from memory.
- Inclusion: within `radiusNm` of any region center (great circle). Airports: public use, site type airport or
  heliport. Navaids: VOR, VOR/DME and VORTAC as VORs, NDB and NDB/DME as NDBs, operational status only. All fixes.
- Runway `designation` as published (`16L-34R`), `headingTrue` the true alignment of the lower-numbered end, the
  position the midpoint of the two ends, `lit` when the runway has edge lights.
- `towered` when the tower type code says ATCT. `declinationEast` from the navaid's published magnetic variation
  (hemisphere E positive, W negative).
- Region (ICAO, e.g. `K1`): from the record's own ICAO region column where the file has one; otherwise the region the
  fixes of the same ARTCC carry most often (a map built from `FIX_BASE.csv`).
- Output sorted (airports, VORs, NDBs, fixes by ident, runways by designation, frequencies by use then MHz) and written
  with two-space JSON indentation, so a new cycle diffs by record.

- [ ] **Step 1: Write the failing tests**: `parseCsv` on a literal with a quoted comma and an escaped quote; `extract`
  on a fixture folder `generator/test/fixtures/nasr/` with a few hand-written CSV rows per file (one airport inside the
  region with two runway ends, one outside; one VORTAC with `MAG_VARN` 20 E; one private airport) asserting: only the
  inside airport, its runway `designation === '16L-34R'` and midpoint, the VORTAC's `declinationEast === 20`, the
  private airport absent; a fixture lacking a column throws naming it.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** — PASS.
- [ ] **Step 5: Extract the real cycle** with the maintainer's folder, check the counts it prints look plausible
  (hundreds of airports, thousands of fixes for the Seattle region) and that KSEA, SEA (VORTAC) and a few fixes are in
  the file.
- [ ] **Step 6: Commit** `Extract the FAA NASR data of the example screens.` (script, tests, regions, extract, README)

---

### Task 7: Facilities and magnetic variation for the screens

**Files:**
- Create: `kln90b/generator/harness-lgpl/builders.ts` (copy of `vendor/kln90b/test/harness/navdata/builders.ts` at the
  pin, header comment naming the source file and commit), its two license texts (copied from
  `kln90b/src/assets/fonts/LICENSE.*.txt`) and `README.md` (what was copied, from which commit, what was changed)
- Create: `kln90b/generator/lib/navdata.ts`
- Modify: `kln90b/generator/lib/generate.ts` (boot with the extract and the model), `kln90b/generator/api.ts`
  (export `place`)
- Test: `kln90b/generator/test/navdata.test.ts`, `kln90b/generator/test/apt1.capture.test.ts`

**Interfaces:**
- Consumes: `NavdataExtract` (Task 6), `screenModel`, `declination`, `decimalYear`, `SCREEN_DEGREE` (Task 5).
- Produces:

```ts
export function loadExtract(): NavdataExtract;            // the newest generator/navdata/nasr-*.json
export function facilitiesOf(x: NavdataExtract): Facility[];
export function place(ident: string): {lat: number; lon: number};   // airport, else VOR, NDB, fix; throws if absent or ambiguous
```

Changes to the copied builders: `RunwayOptions` gains `designation` (used as is, its letter suffixes set
`designatorCharPrimary`/`Secondary`), `lat`/`lon` and `lit` (`RunwayLightingType` other than `Unknown`/`None` when
lit); `AirportOptions` gains `frequencies: {use, mhz}[]`, mapped to `FacilityFrequencyType` by the use text (ATIS, TWR,
GND, CD/CLNC DEL, UNICOM, CTAF, APCH, DEP, ASOS, AWOS; anything else is left out) with `freqMHz`, `freqBCD16` and a name.
VOR `magneticVariation` is `-declinationEast` (the sim stores it west positive, see `kln90b/data/navdata/KLNMagvar.ts`
in the submodule).

`generateScreen` now boots with `defaultNavdata: false`, `facilities: facilitiesOf(loadExtract())` (loaded once per
file), and `magvar: (lat, lon) => declination(screenModel(), lat, lon, decimalYear(start), 0, SCREEN_DEGREE)` where
`start` is `boot.start` or the harness default `DEFAULT_START` (`test/harness/sim/clock.ts`).

- [ ] **Step 1: Write the failing tests**: `navdata.test.ts` on a literal extract: an airport with runway `16L-34R`
  becomes a facility whose runway `designation` is `16-34`, `designatorCharPrimary` is
  `RunwayDesignator.RUNWAY_DESIGNATOR_LEFT` and `designatorCharSecondary` is `RUNWAY_DESIGNATOR_RIGHT`, a frequency `{use: 'TWR', mhz: 119.9}` becomes
  `FacilityFrequencyType.Tower` with `freqMHz === 119.9`, a VOR with `declinationEast: 20` has
  `magneticVariation === -20`, `place('KSEA')` returns the airport's position, `place` of an unknown ident throws.
  `apt1.capture.test.ts`: `generateScreen` on a temp folder with `show: 'right'`, position `place('KSEA')`, steps
  `selectPage('R', 'APT 1')` and entering `KSEA` (`unit.panel.enterIdent('R', 'KSEA')`); assert `text[0]` contains
  `KSEA` and `text[1]` contains `SEATTLE`.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** `Boot the screens with the FAA navdata and the magnetic model.`

---

### Task 8: Generated screens on the site

**Files:**
- Create: `kln90b/src/lib/screenHtml.ts` (moved out of `KlnScreen.astro`: segments, cropping, HTML), `kln90b/src/lib/screens.ts`
- Modify: `kln90b/src/components/KlnScreen.astro`, `kln90b/src/content.config.ts`
- Create: the first real screen `kln90b/screens/apt-1-ksea/` (`screen.ts`, `fields.mdx`, generated `screen.txt`)
- Modify: `kln90b/src/content/docs/pages/apt.mdx` (use it)
- Test: `kln90b/src/lib/screenHtml.test.ts`, `kln90b/src/lib/screens.test.ts`

**Interfaces:**
- Consumes: `ScreenCapture`, `parseScreenFile` (Task 2); `fieldIdsOf`, `explanationMismatch` from
  `src/lib/explanations.ts` (Task 4), so both sides run the same check.
- Produces:

```ts
// screenHtml.ts
export interface Segment { text: string; field?: string; inverse: boolean; flash: boolean }
export interface ScreenBlocks { crop?: 'left' | 'right'; blocks: {cls: string; rows: Segment[][]}[] }
export function blocksFromMarkup(p: {left?: string; right?: string; full?: string; status?: string}, id: string): ScreenBlocks;  // today's markup, unchanged behavior
export function blocksFromCapture(c: ScreenCapture, documented: Set<string>): ScreenBlocks;
export function screenHtml(b: ScreenBlocks, documented: Set<string>): string;
// screens.ts
// The files come from import.meta.glob('../../screens/*/screen.txt' and '*/map-*.svg', {query: '?raw', eager: true}),
// which works in the Astro build and under Vitest alike; no fs paths.
export function loadCapture(id: string): {capture: ScreenCapture; maps: Partial<Record<'L' | 'R', string>>};  // throws `no generated screen "<id>"; run npm run screens -- <id>`
export function checkExplanations(id: string, capture: ScreenCapture, mdx: string): void;   // throws explanationMismatch's message prefixed with the id
```

`blocksFromCapture`: split layout → left rows (columns 0-10), right rows (12-22), status row 6; full layout → rows 0-5
(or 0-6 without status) and the status row. Consecutive cells with the same field, inverse and flash flags form one
segment; `I` → inverse, `B` → flash, `F` → inverse and flash. Crop `show: 'left'` keeps columns 0-4 of the status line
and blanks the rest, `right` keeps 18-22, as the hand markup does today.

`content.config.ts`: a collection `screenFields` with `glob({pattern: '*/fields.mdx', base: './screens'})` and
`generateId` = the folder name. `KlnScreen.astro` gains `screen?: string` and `title?: string` (overrides the file's
title); with `screen` it loads the capture, checks the explanations against `entry.body`, renders the blocks and puts
`<Content components={{Field, Term}} />` into the `<dl>` of the field list. Field explanation files therefore use
`<Field>` and `<Term>` without imports. The id of the figure stays `screen-<id>`. Page names in explanations are linked
by the existing remark plugin (check in the built page that one is).

- [ ] **Step 1: Write the failing tests**: `screenHtml.test.ts`: `blocksFromMarkup` gives the same HTML as today's
  component for the NAV 1 markup of `pages/nav.mdx` (copy the markup and today's output as literals before moving the
  code); `blocksFromCapture` on a literal capture: a field `dis` row 2 columns 0-11 gives one segment
  `{text: 'DIS  45.2nm', field: 'dis', inverse: false, flash: false}`; an `F` cell gives `inverse: true, flash: true`;
  a cropped capture's status row reads `'NAV 1' + 18 blanks`. `screens.test.ts`: `loadCapture('no-such')` throws
  containing `npm run screens -- no-such`; `checkExplanations` throws containing `apt-1-ksea` and `no explanation:`.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement**, then write `screens/apt-1-ksea/` (fields at least `ident`, `name`
  as two parts, `pos`, `page`; explanations may stay placeholders), run `npm run screens -- apt-1-ksea`, and replace the
  APT 1 `<KlnScreen>` markup in `pages/apt.mdx` with `<KlnScreen screen="apt-1-ksea" />`.
- [ ] **Step 4: Run** `npm run screens:test` — PASS; `npm run build` — PASS; and in the built
  `dist/pages/apt/index.html` the figure `screen-apt-1-ksea` has a `.kln-field[data-field="name"]` and a
  `.kln-field-doc[data-field="name"]`. Look at the page in the browser preview (`npm run preview`): tooltips open,
  `#screen-apt-1-ksea--name` opens that field.
- [ ] **Step 5: Commit** `Show generated screens on the site by their id.`

---

### Task 9: Maps as SVG

**Files:**
- Create: `kln90b/generator/lib/mapSvg.ts`
- Modify: `kln90b/generator/lib/generate.ts` (write the maps), `kln90b/src/lib/screenHtml.ts` and
  `kln90b/src/styles/kln-screen.css` (place them)
- Create: `kln90b/screens/nav-5-ksea/` (NAV 5 on the left with a direct-to KSEA from about 20 NM south)
- Test: `kln90b/generator/test/mapSvg.test.ts`

**Interfaces:**
- Consumes: `canvasToAscii`, `downsampled` (`vendor/kln90b/test/harness/render/canvas.ts`); `captureScreen().canvases`
  (Task 4).
- Produces: `blocksToSvg(blocks: string): string` — input is `downsampled(canvasToAscii(canvas))` (rows of `#`/`.`,
  one character per screen pixel; a half-page map is 99 × 78), output:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99 78" width="99" height="78" shape-rendering="crispEdges" fill="currentColor">
<path d="M3 10h4v1h-4zM9 10h1v1h-1z"/>
...
</svg>
```

One `<path>` per pixel row that has lit pixels, one `M x y h w v1 h-w z` per run, rows without lit pixels omitted, so a
diff shows which rows of the map changed.

On the site the map of a side is inlined absolutely positioned at the top-left of that half's text area (left half
`left: 4u; top: 3u`, right half `left: 112u; top: 3u`, both `width: 99u; height: 78u`), under the text, in the phosphor
color. The text rows over the map (NAV 5's bottom row) stay text.

- [ ] **Step 1: Write the failing tests**: `blocksToSvg('..##.\n.....\n#....')` (with the viewBox from the input's
  size, here `0 0 5 3`) has exactly two `<path>` elements, `d="M2 0h2v1h-2z"` and `d="M0 2h1v1h-1z"`; an all-dark input
  gives no `<path>`. Parse the output with a regex over `<path d="...">`, not a substring search over the whole text.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement**, wire it into `generateScreen` and the site, write
  `screens/nav-5-ksea/`, generate it, `git add` the folder, generate it again: `git status` shows no change.
- [ ] **Step 4: Run** `npm run screens:test` and `npm run build` — PASS. Look at the map in the browser preview next to
  a screenshot of NAV 5 in the sim, if the maintainer can provide one.
- [ ] **Step 5: Commit** `Generate the map pages as SVG.`

---

### Task 10: Replace the hand-typed screens

**Files:**
- Modify: the MDX pages that use `<KlnScreen>` with hand markup — today `src/content/docs/index.mdx`,
  `pages/nav.mdx`, `pages/set.mdx`, `unit/controls-and-display.mdx`, `getting-started/tutorial-1.mdx` (find them with
  `grep -rn "<KlnScreen" kln90b/src/content`)
- Create: one `kln90b/screens/<id>/` per screen, keeping the draft's ids (`home-nav-1`, `nav-1`, …) so that anchors stay
- Modify: `README.md` (root), section "Writing a screen": generated screens by id, the folder of a screen, the
  commands, the hand markup only for the hand-built exceptions (the knob demo and status-line-only illustrations)
- Modify: `kln90b/src/components/KlnScreen.astro` doc comment (both modes)

- [ ] **Step 1:** For each hand-typed screen, write the description that reaches the same page in the same state with
  real navdata (a flight plan KPDX to KSEA where the draft shows one; positions with `place()` and `pointFrom`), the
  fields the draft has (same ids), and move the draft's `<Field>` explanations into `fields.mdx` unchanged. A screen
  that cannot be reached as drawn (the draft invented it) is generated in the nearest real state, and the difference is
  listed in the commit message.
- [ ] **Step 2:** `npm run screens` — all PASS; `git add kln90b/screens`; `npm run screens` again — `git status`
  shows no change.
- [ ] **Step 3:** `npm run build` — PASS with no `KlnScreen` warnings; `grep -rn "left={\`" kln90b/src/content`
  finds hand markup only in the hand-built exceptions.
- [ ] **Step 4: Commit** `Replace the hand-typed example screens with generated ones.`
