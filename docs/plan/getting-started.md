# Package: getting started (Installation and Quickstart)

Worked ahead of the planning session at the maintainer's request (2026-11-16), because pilots need these two pages
first. The pages they link to for the full treatment (Controls and display, Keyboard mode, Power-on) are not written
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
5. `#an-aircraft-that-carries-the-unit`: the package alone puts the unit into no aircraft; the wiki list; aircraft
   that switch between the unit and another GPS; aircraft that bring their own copy of the unit.
6. `#next-steps`: Quickstart, Tutorial flight 1.

### Quickstart (`getting-started/quickstart.mdx`)

As written:

1. Summary: two pages side by side, pages chosen with the knobs, the cursor, ENT.
2. `#turning-the-unit-on`: the brightness knob, the procedure from the Turn-On page to the normal pages, link to
   Power-on and initialization.
3. `#the-two-halves-of-the-screen`: the halves, which controls serve which, the status line; screen
   `nav-1-apt-1-ksea`.
4. `#selecting-a-page`: groups and pages, outer and inner knob, subpages (`+`), the knob demo.
5. `#the-cursor-and-entering-data`: the CRSR keys, the knobs with the cursor on, ENT and CLR; screen
   `apt-1-ksea-cursor`; the worked example (KSEA on the APT pages); the Direct To page as the case that needs ENT.
6. `#the-controls-in-the-simulator`: the mouse depends on the aircraft (no common pattern described, see "Open"
   below); Keyboard mode in three sentences.
7. `#where-to-go-next`: Tutorial flight 1, Controls and display.

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
  `/kln90b/operation/navigation-modes/` with `#the-active-waypoint` (both already planned in the index)

## Screens

The package generated one screen, `nav-1-apt-1-ksea` (NAV 1 and APT 1 of KSEA with the status line, every field
explained), and shows the existing `apt-1-ksea-cursor`. Nothing could not be staged.

## Open

- **The mouse pattern.** The style guide (section 17) asks the Quickstart to describe the common pattern of the mouse
  controls. Neither the code nor the wiki has a source for one: the unit receives only the events of its controls, and
  each aircraft's model decides which click sends which. The page says that the controls differ and gives the
  right click for power as the example. The maintainer supplies the pattern, or the requirement is dropped.
- **What an update keeps.** Installation says to delete the folder and install the new version. Whether flight
  plans, user waypoints and settings survive that is not stated; the maintainer confirms it, then one sentence is
  added.
- **Where the Community folder is.** No source says, so the page does not either.
- **The knob demo** steps through optional pages (marked dashed) and shows no subpages; the Quickstart says so. SET 0
  was added after SET 10 in `pageTree.ts` in this package.

## Notes for packages that are not planned yet

The planning session moves these into the files of the packages that own the topics. All facts are from the code and
the staged unit, found by the writers and the reviewer of this package.

**Power-on and initialization** (facts for its writer; all from the code and the staged unit):

- The power control is a knob that is also the brightness control; pushing it toggles the unit on and off
  (`PowerSupply.ts`). Name to be fixed with Controls and display.
- The display warms up for up to about 6 seconds after a long time off, less after a short one (`BrightnessManager.ts`,
  `TIME_TO_WARM`, `TIME_UNTIL_COLD` 10 minutes).
- The Turn-On page shows `SELF TEST IN PROGRESS` for 17 seconds (`WelcomePage.tsx`, `TEST_TIME`). While the left cursor
  is on there (editing the four lines of the Turn-On page), the unit stays on it.
- In take-home mode a Take-Home warning page comes before the Self Test page (`WelcomePage.showSelfTestPage`).
- The Self Test page opens with the cursor on the barometric setting; each ENT moves the cursor on, also where the
  field had nothing to accept, until `APPROVE?` (`SelfTestRightPage.tsx`, `enterAlwaysMoves`). With an air data input
  the setting is read only and not a cursor field. ENT on `APPROVE?` gives five short beeps.
- After approval: the VFR-only page with `ACKNOWLEDGE?` in a VFR-only installation; then the OBS warning page if the
  unit is in OBS mode, which has no acknowledgement and stays until the aircraft's GPS CRS switch selects leg mode;
  then the database page (expires or expired, with `ACKNOWLEDGE?`).
- The normal pages then show NAV 2 on the left and, on the right, the page of the last active waypoint (APT 4 for an
  airport), or the SUP page when there was none (`PageManager.startMainPage`).
- An aircraft loaded with its engine running skips the Turn-On page, the self test and the database page, and the GPS
  acquires at once; every later power-on runs the full sequence (`KLN90BCore.isForceReadyToUse`, harness
  `FrontPanel.powerCycle`). A failed self test shows `TEST FAIL` and the message `DATA BASE CHECKSUM ERR`
  (`WelcomePage.leaveFailed`).
- Power losses of up to 1.5 seconds are carried without a restart (`PowerSupply.ts`, `RIDE_THROUGH_TIME`).

**Controls and display**:

- The anchor `#selecting-a-page` that the Quickstart links does not exist yet on the placeholder page; the other planned
  anchors do.
- The `+` appears on the left only on STA 1, TRI 2, TRI 4 and TRI 6, never on FPL pages; on the right on APT 3, APT 4,
  APT 7, CTR 2, the ACT pages and the waypoint confirmation (`numPages` in those page classes).
- SET 0 follows SET 10 in the knob order; while it is shown, the status line shows no mode and no right page name.

**Keyboard mode**: keyboard mode works only while that side's cursor is on and the page has a status line; it ends with
a right click on the screen, with Escape, with a click outside the instrument's view, and when the cursor goes off
(`PageContainer.tsx`). The H events `KLN90B_LeftKeyboard_Toggle` and `KLN90B_RightKeyboard_Toggle` toggle it from
hardware (kln90b README); the External hardware page can carry them.

**Generator** (coordinator): the generator does not fail when cells with text belong to no field, which is how the
`CL B` row of `quickstart-screen` went unexplained. A check that every non-blank cell of a shown half belongs to a
field (with an explicit opt-out for free text) would catch this in future screens. `home-nav-1` has the same gap, but
it is shown without fields.

**Controls and display, from the Quickstart's writer**: the Quickstart names the power control "the brightness knob"
(the class comment `BRT/PUSH ON` in `PowerSupply.ts`, the `BRT` label of the drawing in `KlnUnit.astro`); Controls and
display fixes the names of all controls and must use this one or change the Quickstart with it. Text cut from the
Quickstart because Controls and display owns it: some aircraft need a right click on the knob to turn the unit on, and
a pilot who uses the right mouse button to pan the camera holds the left mouse button before the right click (wiki).
On the identifier of a waypoint page, the first step of the inner knob goes from the existing character on through
the character set (from `0` to `1`), not to `A`.

**Power-on, from the Quickstart's writer**: after the database page the unit shows NAV 2 on the left and the SUP page
on the right when no waypoint was last active, or the page of the last active waypoint (APT 4 for an airport)
(`PageManager.startMainPage`). Three presses of ENT move the cursor from the barometer setting to `APPROVE?`, a fourth
approves.

**FAQ and Known limitations, from the Installation writer**: the package cannot be installed on Xbox, so only
aircraft that bundle their own copy offer the unit there (wiki, "Bundling the KLN with your aircraft").

**The home page** (`Downloads.astro`): its fallback text names the zip "falcon71-kln90b"; the file is named
`falcon71-kln90b-` and the version, ending in `.zip` (`releases.ts`). A wording mismatch only.

## Notes from other packages

None.

## Changes to earlier pages

None planned.
