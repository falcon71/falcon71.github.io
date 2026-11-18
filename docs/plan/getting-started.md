# Package: getting started (Installation and Quickstart)

Done. Worked ahead of the planning session at the maintainer's request (2026-11-16), because pilots need these two
pages first. The pages they link to for the full treatment (Controls and display, Keyboard mode, Power-on) are not written
yet, so the Quickstart links to planned anchors, and the package that writes Controls and display must create them
(see "Planned anchors" below).

Requirements for both pages: style guide, section 17 ("Installation", "Quickstart"), section 3 (version 1.x is named
only on Installation) and section 12 ("Mouse and keyboard").

## Pages

### Installation (`getting-started/installation.md`)

As written:

1. Summary: what to download, where it goes, and that an aircraft must carry the unit.
2. `#choosing-the-version`: 2.x for Microsoft Flight Simulator 2024, 1.x for 2020; this manual describes 2.x.
3. `#downloading`: the download buttons of the home page; other versions on the Releases page; the name of the file
   to take; the Source code archives are the wrong ones; pre-releases.
4. `#installing-in-the-community-folder`: the folder structure, the install procedure, updating, removing.
5. `#an-aircraft-that-carries-the-unit`: the package alone puts the unit into no aircraft; the wiki list;
   hot-swapping in one sentence; aircraft that bring their own copy of the unit.
6. `#next-steps`: Quickstart, Tutorial flight 1.

### Quickstart (`getting-started/quickstart.mdx`)

As written:

1. Summary: two pages side by side, pages chosen with the knobs, the cursor, ENT.
2. `#turning-the-unit-on`: the power/brightness knob, the warm-up of the screen in a Good to know box, the procedure from the Turn-On
   page to the normal pages with the screen `self-test`, link to Power-on and initialization.
3. `#the-two-sides-of-the-screen`: the two sides, which controls serve which, the status line; screen
   `nav-1-apt-1-ksea`.
4. `#selecting-a-page`: page types and pages, outer and inner knob, subpages (`+`), the knob demo.
5. `#changing-a-field-with-the-knobs`: the CRSR keys, fields that the inner knob changes at once; screen
   `set-3-cursor`; the identifier of a waypoint page as such a field, with the worked example (KSEA on the APT pages).
6. `#entering-a-value-with-ent`: entries that flash and take effect only with ENT, what ENT and CLR do, the
   worked example (direct to KBFI); screen `direct-to-ident-entry`.
7. `#the-controls-in-the-simulator`: the two special cases of the mouse (right click for power; a second mouse
   button held), keyboard mode in three sentences.
8. `#where-to-go-next`: Tutorial flight 1, Controls and display.

Each section is a few sentences and links to the full treatment.

## Topic ownership for this package

| Topic | Owner | What these pages say |
| --- | --- | --- |
| Download, versions, Community folder, the aircraft requirement | Installation | everything |
| The screen halves, the status line, page selection, the cursor, data entry, the scan, the page tree | Controls and display | the Quickstart gives each in a few sentences and links |
| How the controls react to the mouse, in full | Controls and display, `#using-the-controls-in-the-simulator` | the Quickstart gives the common pattern and links |
| Keyboard mode | Keyboard mode | the Quickstart names it in one sentence and links |
| Self test, database confirmation, initialization | Power-on and initialization | the Quickstart says what to press to get past it and links |
| Aircraft integration (hot-swapping, panel.xml) | the kln90b wiki | Installation says what a pilot needs and links to the wiki |

## Planned anchors

The Quickstart links to these; the writer of the owning page must create them:

- `/kln90b/unit/controls-and-display/#the-screen`
- `/kln90b/unit/controls-and-display/#selecting-a-page`
- `/kln90b/unit/controls-and-display/#entering-data-with-the-cursor`
- `/kln90b/unit/controls-and-display/#using-the-controls-in-the-simulator`
- `/kln90b/unit/keyboard-mode/`, `/kln90b/unit/power-on/`, `/kln90b/getting-started/tutorial-1/` (pages)
- `/kln90b/operation/waypoints/` (page), and in the field explanations of `nav-1-apt-1-ksea`
  `/kln90b/operation/modes-of-operation/` with `#the-active-waypoint` (both already planned in the index)

## Screens

The package generated `nav-1-apt-1-ksea` (NAV 1 and APT 1 of KSEA with the status line), `self-test` (the Self Test
page as the pilot first sees it, cursor on the barometer setting), `set-3-cursor` (SET 3 with the cursor on the
minimum runway length) and `direct-to-ident-entry` (the Direct To page with KBFI entered, waiting for ENT), each with
every field explained, and shows the existing `apt-1-ksea-cursor`. The packages that own those pages (Power-on, the
SET chapter, Direct-to) reuse these screens or replace them; one screen, one id. Nothing could not be staged.

## Open

- **The names of the other modes.** The glossary entries `enr:`, `arm-leg`, `arm:` and `apr-leg` were written before
  the rule on official terms; only `enr-leg` (Enroute-Leg mode) was checked. The reviewer of Modes of operation checks
  the names of all modes and the coordinator corrects the glossary.
- **The knob demo** steps through optional pages (marked dashed) and shows no subpages; the Quickstart says so. SET 0
  was added after SET 10 in `pageTree.ts` in this package.

The maintainer decided on 2026-11-16 that the manual uses all official terms, also where they replaced a form of
the word list: button (not key), page type (not page group), groundspeed, Enroute-Leg mode, NAV ready, D-bar. They
are in the word list (style guide, section 12).

Settled by the maintainer's review (2026-11-16) and written into the style guide (sections 8, 12 and 17): no common
mouse pattern is described; an update keeps all user data; the page does not say where the Community folder is; the
zip contains the folder itself.

## Notes for other packages

The planning session of 2026-11-16 moved the notes this package left for pages that were not planned yet into the
files of the packages that own them: `docs/plan/power-on.md`, `docs/plan/controls.md` (with Keyboard mode) and
`docs/plan/help.md`; the notes about the generator and the home page are in `docs/manual-plan.md`, "Site and
generator notes".

## Notes from other packages

None.

## Changes to earlier pages

None planned.
