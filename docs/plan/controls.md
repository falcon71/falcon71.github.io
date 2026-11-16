# Package: controls (Controls and display; Keyboard mode)

The basics every other page links to. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research.

## Pages

### Controls and display (`unit/controls-and-display.mdx`)

Requirements: style guide, section 12 ("Controls", "Mouse and keyboard") and section 17. Planned sections; the
anchors marked planned are linked already and must exist with exactly these names:

1. Summary.
2. The front panel: every control with its name (a drawing or the unit's picture with the names). Every other page
   uses exactly these names.
3. `#the-screen` (planned): the two sides, the status line and its segments (page identification, mode
   annunciation, `ent`, `msg`), flashing.
4. `#selecting-a-page` (planned): page types and pages, the outer and the inner knobs, several pages with one name
   (`+`), the page tree as a table or drawing, the full-screen pages and what brings them up, pages that open by a
   button and close with the outer knob.
5. `#page-pairs` (planned): right pages that work with the left page (D/T, REF and CTR with an FPL page on the
   left).
6. `#entering-data-with-the-cursor` (planned): the cursor, the two ways of entering data, ENT and CLR, which side
   they act on, lists with a delete question.
7. `#scanning` (planned): the right inner knob pulled out, as a control.
8. `#using-the-controls-in-the-simulator` (planned): the mouse special cases; keyboard mode in one sentence.
9. Links on.

### Keyboard mode (`unit/keyboard-mode.mdx`)

Simulator only. Based on the wiki page `Keyboard-Mode.md` and the code: entering and leaving it, the keys, where it
works, the two hardware toggles (with the link to External hardware).

## Topics this package owns

See the index: the front panel and its names, the screen, page selection, page pairs, the cursor and data entry,
the scan as a control, the controls in the simulator, keyboard mode. Waypoints and the database owns what an
identifier entry and the scan do with the database; this page links there.

## Where to look

`pages/MainPage.tsx` (the buttons and knobs, the full-screen pages, the `+`), `pages/PageTreeController.ts`,
`pages/CursorController.ts`, `controls/editors/`, `controls/selects/`, `controls/StatusLine.tsx`,
`controls/ListItem.tsx`, `controls/PageContainer.tsx` and `services/KeyboardService.ts` (keyboard mode),
`BrightnessManager.ts`, `PowerSupply.ts`, `HEvents.ts`; `docs/architecture.md` on the cursor and on how the two
sides share ENT and CLR; `kln90b/src/data/pageTree.ts` of the site; the Quickstart, whose terms this page keeps.

## Notes from other packages

From the package getting-started (facts from the code and the staged unit, to be checked again):

- The anchor `#selecting-a-page` does not exist on the placeholder page; the other three planned anchors of the
  Quickstart do.
- The `+` appears on the left only on STA 1, TRI 2, TRI 4 and TRI 6, never on FPL pages; on the right on APT 3, APT
  4, APT 7, CTR 2, the ACT pages and the waypoint page shown for approval (`numPages` in those page classes).
- SET 0 follows SET 10 in the knob order; while it is shown, the status line shows no mode and no right page name.
- Text cut from the Quickstart because this page owns it: some aircraft need a right click on the knob to turn the
  unit on, and a pilot who uses the right mouse button to pan the camera holds the left mouse button before the
  right click (wiki). On the identifier of a waypoint page, the first step of the inner knob goes from the existing
  character on through the character set (from `0` to `1`), not to `A`.
- The power control is a knob that is also the brightness control; pushing it toggles the unit on and off
  (`PowerSupply.ts`). Its name is in the word list: the power/brightness knob.
- Keyboard mode works only while that side's cursor is on and the page has a status line; it ends with a right
  click on the screen, with Escape, with a click outside the instrument's view, and when the cursor goes off
  (`PageContainer.tsx`). The H events `KLN90B_LeftKeyboard_Toggle` and `KLN90B_RightKeyboard_Toggle` toggle it from
  hardware (kln90b README); the External hardware page carries them.

From the package apt: text about the scan that the review cut from the APT chapter is in the git history
(`docs/plan/apt.md`, "Text the review moved out of the chapter").

From the planning survey: the FLR pages are a page type that the outer knob does not reach
(`docs/plan/failures.md`); the page tree of this page says so in one sentence and links to the FLR chapter.

## Changes to earlier pages

The seam check compares the Quickstart with Controls and display: the terms, the names of the controls, and the
four planned anchors. The pages of the packages sta and failures get their links checked against the anchors that
now exist.
