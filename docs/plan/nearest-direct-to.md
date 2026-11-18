# Package: nearest-direct-to (Nearest; Direct-to)

Two Operation pages for getting somewhere now. Written in the package session of 2026-11-18; the sections below are
what was written, with their anchors. Pointers are paths relative to `vendor/kln90b/kln90b/`.

## Pages

### Nearest (`operation/nearest.mdx`, `sidebar.order` 3)

1. Summary.
2. `#the-nearest-lists`: the APT, VOR and NDB lists, the count and the radius, what each list holds (user waypoints,
   the VOR types, airports by the nearest airport criteria; heliports and closed airports never), the
   renewal ("a few seconds" for membership), the position the lists measure from before NAV ready (no dashes), an
   empty list after loading an aircraft with the unit running.
3. `#showing-a-nearest-list`: the procedure by scanning back past the first waypoint; `#the-page-keeps-its-waypoint`,
   `#the-cursor-on-the-rank`, `#leaving-a-nearest-list`.
4. `#finding-the-nearest-airport-quickly`: MSG, ENT, with the procedure that ends in a direct-to (screen
   `nearest/msg-ent`).
5. `#no-airport-in-the-nearest-list`: the empty lists; the blank MSG page that stays after MSG, ENT (screen
   `nearest/no-nearest-apt`; kln90b#494).
6. `#setting-the-nearest-airport-criteria`: SET 3, with a procedure (screen `pages/set/set-3`).
7. `#flying-to-a-nearest-waypoint`: the default waypoint of the Direct To page, link to Direct-to.
8. Where to go next.

### Direct-to (`operation/direct-to.mdx`, `sidebar.order` 4)

The example page of the task pages (`docs/manual-plan.md`, "Example pages"), approved 2026-11-18.

1. Summary.
2. `#flying-direct-to-a-waypoint`: the Direct To page (screens `direct-to/ident-entry`, `direct-to/approval`), the
   procedure, one ENT for the default waypoint and two for a typed one, an unknown identifier (link to User waypoints),
   localizers and VOTs (kln90b#489); `#what-the-unit-does`: the course from the present position, NAV 1 on the right
   (screen `direct-to/nav-1`), `ADJ NAV IND CRS TO nnn°`, approach active mode back to arm mode, the waypoint alert
   link, the five-minute rule (link to Power-on).
3. `#the-default-waypoint`: the order of the sources (FPL 0 cursor, the window of Super NAV 5, a right waypoint page
   including ACT and nearest pages, the active waypoint); kln90b#487.
4. `#leaving-the-direct-to-page`: closing without a direct-to; the knob step that also acts on the page beneath.
   Controls and display keeps one sentence and the link.
5. `#flying-direct-to-a-waypoint-of-the-flight-plan`: FPL 0 unchanged, sequencing on after the waypoint, a waypoint
   FPL 0 holds twice (kln90b#493), screen `direct-to/fpl-0`.
6. `#recentering-the-d-bar`.
7. `#canceling-a-direct-to`: DCT, CLR, ENT; the leg nearest the aircraft becomes active.
8. `#flying-a-direct-to-in-obs-mode`: the `DIRECT TO` and `ACTIVATE` annunciations (screen `direct-to/obs-activate`);
   `#crs-nnn-in-the-status-line`: the course message, with the Availability box (screen `direct-to/obs-crs-message`).
9. Where to go next.

## Screens

All staged. The plan's `direct-to/offered-fpl-0` became `direct-to/fpl-0` (the result, because the Direct To page
replaces FPL 0 on the left). The course message where the unit reads an indicator it cannot turn was not staged; the
staged screen is the installation without an indicator input.

## Bugs found (2026-11-18)

Filed with the maintainer's approval:

- kln90b#494: MSG, ENT with no airport in the nearest list leaves the blank MSG page up; comment in Nearest,
  `#no-airport-in-the-nearest-list`.
- kln90b#493: a direct-to to the default waypoint from the active waypoint, ACT or the Super NAV 5 window activates the
  first occurrence of a waypoint FPL 0 holds twice; comment in Direct-to, `#flying-direct-to-a-waypoint-of-the-flight-plan`.
- kln90b#495: NAV 1 in OBS mode shows the from waypoint; for the NAV chapter (`docs/plan/nav-pages.md`).

Not filed: after a direct-to from Super NAV 5 the screen ends on NAV 5 and NAV 1 (the reviewer found it consistent with
the unit's general rule).

Private airfields are not mentioned for the nearest list: the code filters only by surface class and leaves closed
airports out, and says nothing about private airfields (maintainer, 2026-11-18).
