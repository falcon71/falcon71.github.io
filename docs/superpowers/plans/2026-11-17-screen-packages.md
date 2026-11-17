# Screen Packages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Screens in `kln90b/screens/` may sit in nested package folders, and a screen's id is its path below `screens/`
with `/`.

**Architecture:** A folder with `screen.ts` is a screen, any other folder a package. The generator derives the id from
the path, the site's globs become recursive, and a check refuses a screen inside a screen. The existing screens are then
moved into the packages of the design, with every reference rewritten.

**Tech Stack:** Astro/Starlight, Vite `import.meta.glob`, Vitest (run through `generator/run.mjs`), TypeScript, Node.

**Spec:** `docs/superpowers/specs/2026-11-17-screen-packages-design.md`

## Global Constraints

- Never change `vendor/kln90b`.
- Commit messages are plain sentences in American English, ending with the `Co-Authored-By` line of the session.
- Prose follows `docs/style-guide.md`; no counts for things that grow ("the screens", not "the 120 screens").
- The id has one spelling everywhere: `screen="pages/apt/apt-1-ksea"`, `#screen-pages/apt/apt-1-ksea--name`,
  `npm run screens -- screens/pages/apt/apt-1-ksea`, and the error messages.
- Dated records (`docs/plan/`, `docs/superpowers/specs/` and `plans/` other than this pair) are not rewritten.
- Commands run from `kln90b/`: `npm run screens:test` (projects `unit`, `capture`), `npm run screens` (all screens),
  `npm run build`.

## Review Focus

- **Windows separators.** `path.relative` yields `pages\apt\apt-1-ksea` on Windows; the id must be
  `pages/apt/apt-1-ksea` (test in Task 1).
- **Prefix collisions while rewriting references.** `apt-1-ksea` is a prefix of `apt-1-ksea-cursor`, `nav-1` of
  `nav-1-apt-1-ksea`, `sta-1-nav` of `sta-1-nav-2`; the rewrite must match whole ids (check in Task 3).
- **A generated screen outside `screens/`.** The capture tests generate into a temp folder and expect the id
  `nav-1-smoke`; such a folder keeps its basename (test in Task 1).
- **Generator id and content-collection id disagree.** Both must give the same string for a nested folder, or
  `getEntry` finds no `fields.mdx` (proved by the build in Task 3).
- **An anchor with slashes.** `#screen-pages/nav/nav-1--dis` must open the field's explanation (preview check in Task 3).

---

### Task 1: The generator takes the id from the path

**Files:**
- Modify: `kln90b/generator/lib/paths.ts`
- Modify: `kln90b/generator/lib/generate.ts:150-172` (`generateScreen`, `defineScreen`)
- Modify: `kln90b/generator/vitest.config.mts` (project `screens`)
- Test: `kln90b/generator/test/paths.test.ts` (new, project `unit`)

**Interfaces:**
- Produces: `screenId(dir: string, root?: string): string` in `generator/lib/paths.ts`, `root` defaulting to `SCREENS`.

- [ ] **Step 1: Write the failing tests** in `generator/test/paths.test.ts`, building paths with `path.join` so they use the
  host's separator:
  - `screenId(path.join(SCREENS, 'nav-1'))` is `'nav-1'`.
  - `screenId(path.join(SCREENS, 'pages', 'apt', 'apt-1-ksea'))` is `'pages/apt/apt-1-ksea'` (no backslash).
  - `screenId(path.join(os.tmpdir(), 'kln-screen-x', 'nav-1-smoke'))` is `'nav-1-smoke'` (outside the root: basename).
  - `screenId(path.join(root, 'a', 'b'), root)` is `'a/b'` for a given `root`.
- [ ] **Step 2: Run** `npm run screens:test -- generator/test/paths.test.ts`; expected FAIL, `screenId` not exported.
- [ ] **Step 3: Implement `screenId`**: `path.relative(root, dir)`; when it is empty, starts with `..` or is absolute, return
  `path.basename(dir)`; otherwise split on `path.sep` and join with `/`.
- [ ] **Step 4: Use it** in `generateScreen` (the id in errors) and in `defineScreen` (the test name). Update the doc
  comment ("The id of the screen is its path below `screens/`; a folder elsewhere is named by its basename"). In
  `vitest.config.mts` the project `screens` includes `screens/**/screen.ts`.
- [ ] **Step 5: Run** `npm run screens:test`; expected PASS, the capture test of `nav-1-smoke` included. Run
  `npm run screens`; expected PASS and `git status` shows no change under `screens/`.
- [ ] **Step 6: Commit** `generator/lib/paths.ts`, `generator/lib/generate.ts`, `generator/vitest.config.mts`,
  `generator/test/paths.test.ts`.

### Task 2: The site finds screens at any depth

**Files:**
- Modify: `kln90b/src/lib/screens.ts`
- Modify: `kln90b/src/content.config.ts`
- Modify: `kln90b/src/lib/screenFile.test.ts:116-123`
- Modify: `kln90b/src/components/KlnScreen.astro:49` (prop comment)
- Test: `kln90b/src/lib/screens.test.ts`

**Interfaces:**
- Produces: `screenIdOfFile(key: string): string` (glob key `../../screens/<id>/<file>` to `<id>`) and
  `nestedScreen(ids: Iterable<string>): [outer: string, inner: string] | null` in `src/lib/screens.ts`.

- [ ] **Step 1: Write the failing tests** in `screens.test.ts`:
  - `screenIdOfFile('../../screens/pages/apt/apt-1-ksea/screen.txt')` is `'pages/apt/apt-1-ksea'`;
    `screenIdOfFile('../../screens/nav-1/map-L.svg')` is `'nav-1'`.
  - `nestedScreen(['pages/apt/apt-1-ksea', 'pages/apt/apt-1-ksea-cursor', 'nav-1'])` is `null` (a shared prefix is no
    nesting).
  - `nestedScreen(['pages/nav', 'pages/nav/nav-1'])` is `['pages/nav', 'pages/nav/nav-1']`.
  - The committed tree has no nesting: `nestedScreen` over the keys of
    `import.meta.glob('../../screens/**/screen.ts')` (lazy, keys only) mapped with `screenIdOfFile` is `null`, and the
    key list contains `'../../screens/nav-5-ksea/screen.ts'` until Task 3 moves it.
- [ ] **Step 2: Run** `npm run screens:test -- src/lib/screens.test.ts`; expected FAIL, the functions are not exported.
- [ ] **Step 3: Implement** both functions. The `screen.txt` and `map-*.svg` globs become `../../screens/**/…`. At
  module load, `nestedScreen` over the ids of `screen.txt` throws
  `screen <inner> lies inside screen <outer>; a screen folder holds no other screen, move it into a package` when not
  `null`. Update the file's header comment: `<id>` is the path below `screens/`, packages included.
- [ ] **Step 4:** In `content.config.ts` the pattern becomes `**/fields.mdx` and `generateId` returns the entry without
  its trailing `/fields.mdx`; the comment says the id is the folder's path. In `screenFile.test.ts` the glob becomes
  `../../screens/**/screen.txt`. The prop comment in `KlnScreen.astro` reads: id of a generated screen, its folder's path
  below `screens/`, e.g. `"pages/nav/nav-1"`; the figure is `#screen-pages/nav/nav-1`.
- [ ] **Step 5: Run** `npm run screens:test` and `npm run build`; expected PASS, the site unchanged.
- [ ] **Step 6: Commit.**

### Task 3: Move the screens into packages

**Files:**
- Move: every folder of `kln90b/screens/` except `shared/`, by the table of the spec ("The grouping")
- Modify: every `screen.ts` moved (relative imports); `src/content/docs/**` (references); the tests and fixtures that
  name a screen id (`src/lib/screens.test.ts`, `src/lib/screenFile.test.ts`, `src/lib/screenHtml.test.ts`, and any other
  hit of the grep in Step 4)
- Script: a one-off in the session's scratchpad, not committed

**Interfaces:**
- Consumes: `screenId` (Task 1) and the recursive globs and `nestedScreen` (Task 2).

- [ ] **Step 1: Write the mapping** old id → new id as data in the script, one entry per folder, following the spec's table:
  `pages/<prefix>/` keeps the name; in topic packages the prefix the package states is dropped
  (`tut2-apt-7-sid-load` → `tutorial-2/apt-7-sid-load`, `gpsfail-jamming` → `gps/failures/jamming`,
  `failure-msg-battery-low` → `failures/msg-battery-low`, `direct-to-ident-entry` → `direct-to/ident-entry`,
  `waypoint-dup-page` → `waypoint/dup-page`, `gps-msg-raim-not-available` → `gps/raim-not-available`). The script fails
  when a folder of `screens/` (other than `shared/`) has no entry or when two entries give the same new id.
- [ ] **Step 2: Move** each folder with `git mv`, creating parent folders first.
- [ ] **Step 3: Rewrite relative imports** in each moved `screen.ts`: resolve every `from '…'` that starts with `.`
  against the old folder and write it relative to the new one, with `/`.
- [ ] **Step 4: Rewrite references** in `kln90b/src/`, `kln90b/screens/**/fields.mdx`, `kln90b/generator/` (comments
  and tests) and `README.md`: `screen="<old>"` and `#screen-<old>` followed by `--`, `"`, `)` or end of the token, and
  `screens/<old>/` followed by a path or end. An old id is replaced only as a whole id, never as the prefix of a longer
  one. Afterwards `git grep -nE` for each old id that is no longer a valid id must find nothing outside dated records.
- [ ] **Step 5: Run** `npm run screens:test`; expected PASS. Then `npm run screens` (all, no filter); expected PASS and
  `git diff -M --stat` shows only renames for `screen.txt` and `map-*.svg`, with no content change.
- [ ] **Step 6: Run** `npm run screens -- screens/pages/apt`; expected only the APT screens run.
- [ ] **Step 7: Run** `npm run build`; expected PASS with no `[page links]` warning that was not there before.
- [ ] **Step 8: Preview check.** Start the dev server (`.claude/launch.json`), open the NAV page, follow
  `#screen-pages/nav/nav-1--dis`: the explanation opens pinned. Open a page with an excerpt (`rows`) and a map screen
  (`pages/nav/nav-5-ksea`): both render.
- [ ] **Step 9: Commit** the move and the rewrites in one commit, so that history follows the renames.

### Task 4: Describe packages in the docs

**Files:**
- Modify: `README.md` ("Writing a screen"), `kln90b/generator/README.md` ("Commands", "Describing a screen"),
  `docs/style-guide.md` (lines about `screens/<id>/`), `docs/coordinator-prompt.md` if it names a screen path

- [ ] **Step 1:** Say in each place: a screen is a folder with `screen.ts`; any other folder is a package, nested at any
  depth, and optional; the id is the path below `screens/` with `/`, used as is in `screen="…"`, in the anchor and in the
  filter `npm run screens -- screens/<id>` (a package path runs the whole package); a screen folder holds no other
  screen; helpers live in `screens/shared/`. Examples use the new ids (`pages/apt/apt-1-ksea`,
  `pages/nav/nav-5-ksea`, `pages/nav/home-nav-1`).
- [ ] **Step 2: Run** `npm run build`; expected PASS.
- [ ] **Step 3: Commit.**
