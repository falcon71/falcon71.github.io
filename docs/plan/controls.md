# Package: controls (Controls and display; Keyboard mode)

The basics every other page links to. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research.

## Pages

### Controls and display (`unit/controls-and-display.mdx`)

As written (2026-11-17), with the anchors:

1. Summary.
2. `#the-front-panel`: the drawing of the unit (`KlnUnit.astro` with its optional `markers` prop; the Hero is
   unchanged) with numbered markers and the names in an HTML table under it; the power/brightness knob (pushed in for
   on, pulled out for off; brightness in 20 steps). The text uses the status-line names of the page types, not the
   words printed on the panel (which match the real face).
3. `#the-screen`: the two sides. `#the-status-line`: three parts (left page identification, the middle part with the
   mode annunciation and the enter prompt or message prompt, right page identification), the CRSR annunciation, the
   `+`, status line messages. `#what-flashes`.
4. `#selecting-a-page`: the knobs, the page last shown in a page type (forgotten at power-off). `#the-page-tree` (a
   table; the FLR pages as pages no knob reaches, linked to the FLR chapter; the ACT pages), `#pages-with-a-plus-sign`,
   `#pages-that-no-knob-reaches` (Direct To, ALT with NAV 4, FLR over SET 10; how a knob step closes them),
   `#pages-that-use-the-whole-screen` (Super NAV 1, Super NAV 5, the MSG page, SET 0; the right knobs work on the
   hidden right side).
5. `#page-pairs`: the general rule; D/T, REF and CTR give their own variants.
6. `#entering-data-with-the-cursor`: the cursor, its start field. `#fields-the-knob-changes-directly` (the character
   cycle), `#entries-that-take-effect-with-ent` (with the procedure for the position on SET 1),
   `#which-side-takes-ent-and-clr` (also with the cursor off), `#questions-in-lists`.
7. `#scanning`: the pulled right inner knob as a control; order and speed are left to Waypoints and the database.
8. `#using-the-controls-in-the-simulator`: the mouse special cases; keyboard mode in one sentence.
9. Where to go next.

Screens: `nav-1-apt-1-ksea`, `apt-1-ksea-cursor`, `set-3-cursor`, `direct-to-ident-entry`, `apt-confirm`,
`home-nav-1` (in the drawing, without fields), and the new `status-line-crsr-both-sides`, `page-pair-fpl-0-dt-1`,
`set-1-latitude-entry`, `fpl-0-delete-question` (helper `screens/shared/fpl-0-olm.ts`, KPDX KOLM KSEA). Not staged:
Super NAV 5 with its scan window or menu (the generator cannot stage them).

### Keyboard mode (`unit/keyboard-mode.mdx`)

Simulator only, from the wiki page `Keyboard-Mode.md` and the code (the wiki is incomplete; the page follows the
code). Sections: `#entering-keyboard-mode`, `#the-keys` (a table), `#typing-into-a-field` (a refused key still opens
an entry: kln90b#485), `#leaving-keyboard-mode`, `#switching-keyboard-mode-on-and-off-with-hardware` (links to
External hardware, names no event). Screen: `keyboard-mode-kybd`.

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

All used by this package (2026-11-17).

## Changes to earlier pages

- **Quickstart, the Good to know box on the warm-up:** "Do not push the knob again, which turns the unit off" teaches
  a movement the knob does not have; the knob is pushed in for on and pulled out for off. It becomes "Do not pull the
  knob out, which turns the unit off" (review of Controls and display, 2026-11-17).
- **Shared screens:** the field explanations of the left and right page identification of `nav-1-apt-1-ksea` say
  "subpage", which the word list forbids; the character cycle in `apt-1-ksea-cursor` is given in the same order as on
  Controls and display.

The seam check compares the Quickstart with Controls and display: the terms, the names of the controls, and the
four planned anchors. The pages of the packages sta and failures get their links checked against the anchors that
now exist.
