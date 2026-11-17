# Package: nav-pages (the NAV chapter)

One large chapter of the page reference. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research. If the
research shows the chapter is too large for one session, NAV 5 and Super NAV 5 (the map) become a package of their
own within the same chapter file.

## Pages

### NAV pages (`pages/nav.mdx`)

One chapter for both sides (style guide, section 17). Sections in page order:

1. The NAV pages as a type: they exist on both sides; what differs between the sides; the full-screen pages.
2. NAV 1: the navigation situation. Variants by mode; no active waypoint; no position.
3. Super NAV 1.
4. NAV 2: the present position.
5. NAV 3: the tracks and the minimum safe altitudes (`MSA`, `ESA`; this section owns them). Variant in OBS mode.
6. NAV 4: altitude and VNAV. The fields only; the tasks are VNAV's and Airspace and altitude alerting's (planned).
7. NAV 5: the map. Orientation (heading up with the Availability box), range, what it draws.
8. Super NAV 5: the full-screen map, its fields on the left, its menu, the scan on the map, decluttering.
9. Links to the Operation pages that use the pages.

## Topics this package owns

The pages and their fields; minimum safe altitudes. Links instead of explanations: the active waypoint, the modes
and the CDI scale (Navigation modes); alerting and sequencing (Sequencing); direct-to from the map (Direct-to);
which page pair brings up a full-screen page (Controls and display).

## Where to look

`pages/left/Nav1Page.tsx` to `Nav5Page.tsx`, `SuperNav1Page.tsx`, `SuperNav5Page.tsx`, `controls/Canvas.tsx`,
`controls/selects/MapOrientationSelector.tsx`, `services/MSA.ts`, `pages/MainPage.tsx` (the full-screen pages).

## Notes from other packages

- The screens `pages/nav/nav-1-apt-1-ksea` (Quickstart) and `pages/nav/home-nav-1` (home page) exist; reuse or replace, one screen, one
  id.
- The word list has D-bar, groundspeed, Enroute-Leg mode.
- From the planning survey: the wiki's Known limitations names a missing outline of text on NAV 5; that belongs to
  Known limitations, not to this chapter.

### From the package controls (2026-11-17)

- **Super NAV 5:** with its right menu open, pulling the right inner knob closes the menu and shows the scan window.
  Controls and display says only that Super NAV 5 uses the pulled knob for its scan window; the NAV chapter owns the
  rest. The generator cannot stage the scan window or the menu (`kln90b/generator/README.md`, "Super NAV 5").
- Controls and display says which page pair brings up Super NAV 1 and Super NAV 5, and that the right knobs keep
  working on the hidden right side while a full-screen page is shown.

## Changes to earlier pages

None planned.
