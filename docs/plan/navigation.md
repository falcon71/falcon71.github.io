# Package: navigation (Navigation modes; Sequencing and turn anticipation; the MOD chapter)

The core of en route navigation. Written in the package session of 2026-11-18; the sections below are what was
written, with their anchors. Pointers are paths relative to `vendor/kln90b/kln90b/`.

## Pages

### Navigation modes (`operation/navigation-modes.mdx`, `sidebar.order` 6)

The title and slug stay "Navigation modes"; the official term for leg and OBS mode as a kind is "course mode" (word
list), which the text uses (open question to the maintainer in the index).

1. Summary.
2. `#the-active-waypoint`: the active waypoint and the active leg, how the pages mark them; `#no-active-waypoint`.
3. `#leg-mode`.
4. `#obs-mode`: `#selecting-leg-or-obs-mode` (MOD pages; `#with-the-gps-crs-switch-of-the-aircraft` with the
   Availability box; `#no-actv-wpt-in-the-status-line`); `#the-selected-course` (the three installations, the
   variation of the selected course, the DTK that flashes while the external indicator is more than 10° off).
5. `#the-course-messages`: `#adj-nav-ind-crs-to-nnn`, `#adj-nav-ind-crs` (the unit turns the indicator itself),
   `#obs-wpt--200nm`.
6. `#changing-between-the-modes`: leg to OBS, OBS to leg on the TO and the FROM side.
7. `#the-mode-annunciations`: the five annunciations with their official mode names and status line excerpts;
   arming and activation in one sentence each with the link to Non-precision approaches.
8. `#the-cdi-scale` (explicit anchor; the heading is "The CDI scale factor", `#the-cdi-scale-factor`): the factors,
   MOD 1, the automatic changes; drawing `CdiScale.astro`.
9. `#magnetic-variation`: `#flying-without-a-magnetic-variation` (the primary coverage area, SET 2),
   `#magnetic-var-invalid`.
10. Where to go next.

### Sequencing and turn anticipation (`operation/sequencing.mdx`, `sidebar.order` 7)

1. Summary.
2. `#waypoint-alerting`: the alert times (about 20, 15 and 36 seconds; the list is the one place they stand), what
   flashes and what goes steady in the transition (the active arrows keep flashing: correct, maintainer 2026-11-18);
   `#the-wpt-annunciator` with the Availability box.
3. `#waypoint-sequencing`: the midpoint of the transition, abeam the waypoint, more than 4 NM off the leg;
   `#when-the-unit-does-not-sequence` (for the FAQ); the ACT page keeps the passed waypoint (kln90b#491).
4. `#turn-anticipation`: `#where-turn-anticipation-begins` (a table by groundspeed and course change, drawing
   `TurnAnticipation.astro`), `#far-off-the-leg` (without the simulation's numbers), `#turning-off-turn-anticipation`
   (SET 6 with a procedure).
5. `#fly-over-waypoints`: no page marks them; the waypoint type identification page belongs to Flight plans.
6. Where to go next.

### MOD pages (`pages/mod.mdx`, `sidebar.order` 2)

`#the-mod-pages-one-page-for-each-course-mode` (with `#with-the-gps-crs-switch-of-the-aircraft`), `#mod-1-leg-mode`,
`#mod-2-obs-mode`.

## Screens

All planned states were staged, `APR-LEG` included (a direct-to JALON on the RNAV 34L of KSEA, 1.5 NM before it):
`navigation/*` (leg, obs, obs-to-leg, no-actv-wpt, arm-leg, arm-obs, apr-leg, the course messages, `MAGNETIC VAR
INVALID`, SET 2 without a variation at a position north of 74°N), `pages/mod/*`, `sequencing/alert`,
`sequencing/turn`, `sequencing/super-nav-5-turn`, `pages/set/set-6`, `pages/set/set-6-cursor` (staging shared in
`screens/sequencing/olm-turn.ts`).

Not staged: Super NAV 5 during the alert. Its identifier flashes by disappearing, and the capture showed it steady;
the page describes it in words. The WPT annunciator is outside the screen. No FPL 0 screen in OBS mode, because the
text does not describe it.

## Topics this package owns

See the index: the active waypoint, the modes, the selected course, the mode annunciations, the CDI scale, magnetic
variation; waypoint alerting, sequencing, turn anticipation, fly-over waypoints.

## Bugs (2026-11-18)

- An approach loaded through the EFB route in an installation without APT 8 is armed within 30 NM: part of the open
  kln90b#479, not filed again.
- To be filed with the maintainer's approval: clearing a direct-to in OBS mode (`pages/left/DirectToPage.tsx:104`)
  keeps OBS mode and the selected course but measures the deviation from the plan leg nearest the aircraft; OBS to
  leg mode on the FROM side with an active waypoint outside FPL 0 keeps a direct-to to the passed waypoint instead of
  the nearest leg of FPL 0 (`services/ModeController.ts:130-143`; kln90b#155 fixed the case of a waypoint in FPL 0).
- Not filed: the variation of the selected course at an approach waypoint (the code uses the model's variation,
  the real unit the published one; low confidence, the simulator's data may carry none). With the LEG/OBS switch
  and no active waypoint the code enters OBS mode anyway; the real unit's behavior is not documented.
- Not a bug: the active arrows keep flashing during the transition while the WPT annunciator and Super NAV 5 go
  steady (maintainer, 2026-11-18). DTK does flash while the external indicator is more than 10° off
  (`controls/selects/ObsDtkElement.tsx`).

## Changes to earlier pages

Made by this package, through its reviewer and seam check:

- Direct-to, "What the unit does": `ADJ NAV IND CRS TO nnn°` after a direct-to comes only where the unit reads the
  external indicator, after it stays off the new desired track; the paragraph links `#adj-nav-ind-crs-to-nnn`.
- The official terms of this package on earlier pages: external indicator (Direct-to, Sequencing, the Self Test
  screens), course mode (Controls and display and the mode annunciation fields of older screens), selected course
  (Controls and display, Power-on, Simulated failures), GPS CRS switch (Power-on, the OBS warning page screen), the
  TO/FROM indicator (Power-on, the Self Test screen).
- The CDI scale factors are said once, on Navigation modes: Power-on and the field explanations of
  `pages/nav/nav-1-apt-1-ksea` link there instead.
- The placeholder drawing `CourseDeviation.astro` and the glossary's placeholder entry `Turn anticipation` are gone;
  the glossary expansions of the five mode annunciations carry the official mode names.
