# Package: nav-pages (the NAV chapter)

Done 2026-11-18. One chapter of the page reference, `pages/nav.mdx`, for both sides (style guide, section 17).
Researched and written in two halves (NAV 1 to NAV 4 with Super NAV 1; NAV 5 and Super NAV 5), one writer each, one
after the other on the same file. The maintainer decided (2026-11-18) to extend the generator in this package, so that
Super NAV 5 is shown with its pop-up menu and with its window (`kln90b/generator/README.md`, "Super NAV 5"). The
page-link plugin now links Super NAV 1 and Super NAV 5 as whole names (`README.md`, "Page links").

## Sections as written (`/kln90b/pages/nav/`)

- Summary; `#the-nav-pages-on-both-sides`: the same pages on both sides, NAV 4's entries act on its side, the
  cursor fields of NAV 3 and NAV 5, the ALT button showing NAV 4 on the right (link to Airspace and altitude
  alerting), the page pairs of the full-screen pages (link to Controls and display).
- `#nav-1-the-navigation-situation`, with `#nav-1-after-a-direct-to`, `#nav-1-in-obs-mode` (blank before the
  arrow), `#nav-1-without-an-active-waypoint`, `#nav-1-without-a-position`, `#nav-1-in-the-approach-modes` (what NAV 1
  shows; `F L A G` and dashes when integrity is lost in approach active mode; links Non-precision approaches).
- `#super-nav-1-nav-1-on-the-whole-screen`.
- `#nav-2-the-present-position`: the nearby VOR (NAV 2's own search, not the nearest list) and the VOR of a DME arc.
- `#nav-3-tracks-and-minimum-safe-altitudes`, with `#nav-3-in-obs-mode`, `#nav-3-without-an-active-waypoint`,
  `#nav-3-without-a-position` (`ESA` keeps a value; bug pending, see below), `#minimum-safe-altitudes` (owns `MSA`
  and `ESA`: terrain grid with the clearance included, no obstacles).
- `#nav-4-altitude-and-vnav`, with `#nav-4-without-an-altitude-input` (Availability box).
- `#nav-5-the-map`, with `#what-nav-5-draws`, `#the-range-scale`, `#the-map-orientation` (Availability box for heading
  up), `#the-map-is-blank-in-actual-track-up` (the Good to know box),
  `#the-plus-of-a-waypoint-page`.
- `#super-nav-5-the-map-on-the-whole-screen`, with `#what-super-nav-5-draws`, `#the-left-side-of-super-nav-5`,
  `#the-range-scale-and-auto`, `#the-pop-up-menu`, `#the-vor-ndb-and-apt-selections`, `#runway-diagrams`,
  `#decluttering`, `#the-window`.
- `#where-to-go-next`.

## Screens not staged

- MSA and ESA outside the terrain grid (no such place in the FAA extract).
- NAV 4 with `VNV ARMED`, `VNV IN` and an advisory altitude: the field explanations name the states and link VNAV;
  the package vnav-alerts shows them.
- NAV 2 with the VOR of a DME arc, and the window of Super NAV 5 with `MOVE ?` on a DME arc waypoint: DME arcs were
  not staged; the package approaches can.

## Issues

- Filed: kln90b#498 (the map orientation field after a heading input arrives; its paragraph was cut at the
  maintainer's request, 2026-11-18), kln90b#499 (the star without an identifier, `#what-super-nav-5-draws`),
  kln90b#500 (the hidden cursor stop on the selected course of Super NAV 5, `#the-left-side-of-super-nav-5`),
  kln90b#501 (NAV 4 `ANGLE` `0.0` for 10° or more, in the `angle` fields of `nav-4` and `nav-4-no-altitude`),
  kln90b#502 (`ESA` without a position, `#nav-3-without-a-position` and the `esa` fields).
- kln90b#495 did not reproduce at the pin; a comment says so, and the maintainer checks it. The NAV chapter
  describes the blank before the arrow in OBS mode and has no `kln90b#495` comment.
