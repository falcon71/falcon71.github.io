# Knob demo as faceplate knobs: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Quickstart's knob demo so that each side shows the faceplate knobs and their labels, turns by
clicking a knob's left or right half, lights the selected page type's label in amber, and shows the page types as a
tree that expands only the selected one.

**Architecture:** The faceplate labels and their positions move into a data module that `KlnUnit.astro` and the demo
both read. The demo's state and its tree become pure functions in `src/lib/knobDemo.ts`, unit tested; the Astro
component draws one SVG per side and a small client script renders the state.

**Tech Stack:** Astro 7 with Starlight, TypeScript, inline SVG, Vitest (run through `kln90b/generator/run.mjs`).

**Spec:** `docs/superpowers/specs/2026-11-19-knob-demo-faceplate-design.md`

## Global Constraints

- Work on the branch `knob-demo-faceplate`. Never push. Never change `vendor/kln90b`.
- `KlnUnit.astro` must render exactly as before (byte-identical SVG in the built pages).
- Highlight color: `#ffc233`, the amber of `.kln-unit-markers`. Labels at rest: `#ececec`, as in `KlnUnit.astro`.
- The status-line strip stays as it is; the Quickstart text does not change.
- Start pages: NAV 1 on the left (page type index 3), APT 1 on the right (index 5), as today.
- Optional pages stay dashed, and the note "Dashed pages exist only in some installations." stays.
- No third-party code. Light and dark themes both readable; the knob drawing is the dark faceplate in both.
- Commit messages are plain sentences in American English, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- **The boundary between inner and outer knob.** A click just inside the inner knob's edge must turn the inner knob
  and one just outside it the outer knob, never both and never neither (Task 3, step 5).
- **Keyboard.** Tab reaches each of the four halves per side; Enter and Space turn the knob, and Space does not scroll
  the page (Task 3, step 5).
- **Rapid clicks.** A quick double click turns two steps and selects no label text (Task 3, step 5).
- **A long page type.** Turning the left outer knob to FPL opens 26 leaves below the knob; the knob stays where it was
  under the pointer (Task 3, step 5).
- **Phone width.** At 375 px the two sides stack, each knob drawing fills its column, and the page does not scroll
  sideways (Task 3, step 5).

---

### Task 1: Faceplate labels as shared data

**Files:**
- Create: `kln90b/src/data/faceplate.ts`
- Create: `kln90b/src/lib/faceplate.test.ts`
- Modify: `kln90b/src/components/KlnUnit.astro:59-62, 107-108, 133-134`

**Interfaces:**
- Produces:
  ```ts
  export interface FaceplateLabel { text: string; column: 0 | 1; row: number }
  export interface FaceplateSide {
  	knob: { x: number; y: number };     // knob center in the 912 x 290 panel
  	columnX: [number, number];          // x of the left and right label column
  	firstRowY: number;                  // y of row 0
  	rowStep: number;                    // 20
  	labels: FaceplateLabel[];           // in knob order: labels[i] belongs to page type i of the side's tree
  }
  export const leftFaceplate: FaceplateSide;
  export const rightFaceplate: FaceplateSide;
  export function labelPosition(side: FaceplateSide, label: FaceplateLabel): { x: number; y: number };
  ```
- Values (from `KlnUnit.astro` today): left knob 118, 226; columns 42 and 190; first row y 196. Right knob 803, 226;
  columns 724 and 880; first row y 190. Row 0 is the top row of a column.

- [ ] **Step 1: Save the baseline.** Run `npm run build` in `kln90b/` and copy `dist/index.html` and
  `dist/unit/controls-and-display/index.html` to the scratchpad.

- [ ] **Step 2: Write the failing test `faceplate.test.ts`** with these assertions:
  - `leftFaceplate.labels.map(l => l.text)` equals
    `['TRIP', 'MODE', 'FPL', 'NAV', 'CALC', 'STAT', 'SETUP', 'OTHER']`.
  - `rightFaceplate.labels.map(l => l.text)` equals
    `['CTR', 'REF', 'ACTV', 'D/T', 'NAV', 'APT', 'VOR', 'NDB', 'INT', 'SUPL']`.
  - The label count of each side equals `leftTree.length` / `rightTree.length` from `../data/pageTree`.
  - `labelPosition(leftFaceplate, leftFaceplate.labels[0])` is `{x: 42, y: 256}` (TRIP, bottom left);
    `labels[3]` (NAV) is `{x: 42, y: 196}`; `labels[4]` (CALC) is `{x: 190, y: 196}`.
  - `labelPosition(rightFaceplate, rightFaceplate.labels[0])` is `{x: 724, y: 270}` (CTR); `labels[9]` (SUPL) is
    `{x: 880, y: 270}`.

- [ ] **Step 3: Run it and see it fail.** `node generator/run.mjs --project unit src/lib/faceplate` in `kln90b/`.
  Expected: FAIL, the module does not exist.

- [ ] **Step 4: Implement `faceplate.ts`** with the interfaces and values above, and a doc comment that says the
  labels are in knob order and run around the knob from the bottom of the left column up, then down the right column.

- [ ] **Step 5: Run the test.** Same command. Expected: PASS.

- [ ] **Step 6: Make `KlnUnit.astro` read the module.** Replace the four label arrays and the four `.map` lines with a
  render of each side's labels through `labelPosition`. To keep the output identical, emit them in the order the
  arrays had: column 0 by ascending row, then column 1 by ascending row.

- [ ] **Step 7: Check the drawing is unchanged.** Run `npm run build` and diff the two pages against the baseline.
  Expected: no difference inside `<svg … class="kln-unit-panel">`. Other differences in the files (asset hashes) are
  acceptable; report them.

- [ ] **Step 8: Commit.** "Move the faceplate labels of the front panel drawing into a data module."

### Task 2: The demo's state and tree as pure functions

**Files:**
- Create: `kln90b/src/lib/knobDemo.ts`
- Create: `kln90b/src/lib/knobDemo.test.ts`

**Interfaces:**
- Consumes: `PageGroup`, `leftTree`, `rightTree` from `src/data/pageTree.ts`.
- Produces:
  ```ts
  export type Knob = 'outer' | 'inner';
  export interface KnobState { type: number; page: number[] }   // page[i]: the last page of page type i
  export interface TreePage { name: string; current: boolean; optional: boolean }
  export interface TreeType { name: string; current: boolean; pages: TreePage[] }
  export function initialState(tree: PageGroup[], startType: number): KnobState;
  export function turn(state: KnobState, tree: PageGroup[], knob: Knob, dir: 1 | -1): KnobState; // returns a new state
  export function statusName(state: KnobState, tree: PageGroup[]): string;  // padded, as the status line shows it
  export function treeView(state: KnobState, tree: PageGroup[]): TreeType[];
  ```
- `treeView` rules: every page type appears in knob order; only the current one has pages; a page type with a single
  page (REF, ACT, VOR, NDB, INT, SUP) has none (a leaf that repeats its parent says nothing); page names are trimmed
  at the end (`'REF  '` → `'REF'`, `'FPL10'` stays).

- [ ] **Step 1: Write the failing tests `knobDemo.test.ts`:**
  - `statusName(initialState(leftTree, 3), leftTree)` is `'NAV 1'`; for `rightTree` with 5 it is `'APT 1'`.
  - Outer clockwise from OTH (left index 7) gives TRI; outer counterclockwise from TRI gives OTH.
  - Inner clockwise from NAV 5 gives NAV 1; inner counterclockwise from NAV 1 gives NAV 5.
  - Remembered page: from NAV 1, inner clockwise twice (NAV 3), outer clockwise, outer counterclockwise: `'NAV 3'`.
  - `turn` leaves the state it was given unchanged (compare a deep copy).
  - `treeView` at NAV 1 on the left: eight types; only NAV has `current: true`; NAV has five pages with `NAV 1`
    current; every other type has `pages: []`.
  - At FPL: 26 pages, from `'FPL 0'` to `'FPL25'`.
  - At OTH: `optional` is true for exactly `OTH 5` to `OTH10`; at APT on the right, for exactly `APT 8`.
  - At REF on the right: `pages` is `[]`.
  - At SET: the last page is `'SET 0'`.

- [ ] **Step 2: Run them and see them fail.** `node generator/run.mjs --project unit src/lib/knobDemo`. Expected: FAIL.

- [ ] **Step 3: Implement `knobDemo.ts`.**

- [ ] **Step 4: Run the tests.** Expected: PASS.

- [ ] **Step 5: Commit.** "Add the state and the page tree of the knob demo as tested functions."

### Task 3: The demo component

**Files:**
- Modify (rewrite): `kln90b/src/components/KnobDemo.astro`

**Interfaces:**
- Consumes: `leftFaceplate`, `rightFaceplate`, `labelPosition` (Task 1); `initialState`, `turn`, `statusName`,
  `treeView` (Task 2); `leftTree`, `rightTree`.
- The page keeps `<KnobDemo />` without props.

**What it draws** (spec, "What the demo shows"):
- The status-line strip at the top, as today.
- Per side a `<section>` with an SVG whose viewBox crops that side of the 912 x 290 panel to the knob and its two label
  columns (left about `10 165 208 120`, right about `694 165 208 120`; adjust so that no label is clipped), on a
  rounded rect in the faceplate's colors. The knob circles, gradients and grip strokes are copied from `KlnUnit.astro`,
  including `PULL SCAN` on the right inner knob. Gradient ids carry the side (`kln-knobdemo-left-knob`), so they never
  collide with `KlnUnit`'s or with each other.
- Labels in `#ececec`; the label of the current page type gets a class that fills it with `#ffc233`.
- Four hit areas per side, each a `<path>` with `role="button"`, `tabindex="0"` and an `aria-label` such as "Left
  outer knob, counterclockwise": the outer knob is the ring from r 29 to r 53 split at the knob's vertical center line,
  the inner knob the disc of r 29 split the same way. The rings and discs do not overlap.
- Per turn, the dashed grip circle of that knob (r 43 for the outer, r 27 for the inner) rotates 12° in the turn's
  direction; text does not rotate. On hover and on focus, a half shows a faint curved arrow in its direction.
- Below the SVG, the tree from `treeView`: nested lists, lines drawn with CSS (a vertical line along the leaves, a
  short horizontal tick per leaf, the last leaf ending the vertical line). Current type and current page use the
  site's `--kln-affordance` highlight as the chips do today; optional pages are dashed.
- The page names reach screen readers through an `aria-live="polite"` region, as today.
- The sides sit side by side where both fit and stack otherwise; the SVG is `width: 100%` of its column.
- `user-select: none` on the SVG. Enter and Space on a focused half turn the knob and call `preventDefault`.

- [ ] **Step 1: Rewrite the component** as above. Remove the old button grid and chip lists and their CSS.

- [ ] **Step 2: Build.** `npm run build` in `kln90b/`. Expected: success, no new `[page links]` warnings.

- [ ] **Step 3: Start the preview.** `preview_start` with the name `kln90b-dev`, then open
  `/kln90b/getting-started/quickstart/#selecting-a-page`. Expected: no console errors.

- [ ] **Step 4: Check the behavior by clicking.** On the left: click the right half of the outer ring once. Expected:
  strip `CAL 1`, CALC amber and NAV white, the tree shows CAL with CAL 1 to CAL 7 and NAV collapsed. Click the right
  half of the inner knob. Expected: `CAL 2`. Click the left half of the outer ring, then the right half again.
  Expected: `CAL 2` (remembered). On the right: click the left half of the outer ring five times. Expected: `CTR 1`,
  CTR amber, then once more: `SUP`, SUPL amber, no leaves.

- [ ] **Step 5: Check the Review Focus.**
  - Click 2 px inside and 2 px outside the inner knob's edge (use the SVG's `getScreenCTM` to place the points).
    Expected: inner turns once, then outer turns once.
  - Tab from the paragraph before the demo. Expected: focus reaches the four halves of the left side, then the right;
    Enter and Space each turn one step; `window.scrollY` does not change on Space.
  - Double click the right half of the left outer ring. Expected: two steps; `getSelection().toString()` is empty.
  - Turn the left outer knob to FPL. Expected: 26 leaves; the knob's bounding box has the same top as before.
  - `resize_window` mobile (375 x 812). Expected: the sides stack, `document.documentElement.scrollWidth` is 375 or
    less. Then reset with preset desktop.
  - Switch to the light and to the dark theme. Expected: the labels and tree are readable in both.

- [ ] **Step 6: Screenshot** the demo in dark and light at desktop width, with FPL open on the left.

- [ ] **Step 7: Commit.** "Draw the knob demo as the faceplate knobs with their labels and the pages as a tree."

### Task 4: Close-out checks

- [ ] **Step 1:** Run all unit tests: `node generator/run.mjs --project unit` in `kln90b/`. Expected: all pass.
- [ ] **Step 2:** Open the home page and `/kln90b/unit/controls-and-display/` in the preview. Expected: the panel
  drawings look as before, no console errors.
- [ ] **Step 3:** `git status` is clean and `git log main..` shows the spec, the plan and the three commits.
