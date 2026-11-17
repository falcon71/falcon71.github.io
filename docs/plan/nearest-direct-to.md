# Package: nearest-direct-to (Nearest; Direct-to)

Two Operation pages for getting somewhere now. Pointers come from the planning survey of the code (paths relative
to `vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research.

## Pages

### Nearest (`operation/nearest.mdx`)

1. Summary.
2. The nearest lists: which waypoint types have one, how many entries, how far, how often they are renewed.
3. Showing the nearest airports, VORs and NDBs: by scanning; what the pages show for a nearest waypoint (link to the
   waypoint chapters).
4. The nearest airport in a hurry: MSG and ENT.
5. Which airports count: the criteria of SET 3.
6. Flying to a nearest waypoint (link to Direct-to); the nearest VOR on NAV 2 and the center on OTH 2, as links.

### Direct-to (`operation/direct-to.mdx`)

The candidate for the example page of the task pages (`docs/manual-plan.md`, "Example pages").

1. Summary.
2. Flying direct to a waypoint: the Direct To page (shown and explained here), entering the identifier, approving.
3. Which waypoint the Direct To page offers.
4. Direct to a waypoint of the active flight plan, and what happens to the flight plan afterwards (one paragraph,
   link to Flight plans).
5. Recentering the D-bar.
6. Canceling a direct-to.
7. Direct-to in OBS mode (link to Navigation modes).
8. What the unit forgets while it is off (one sentence, link to Power-on).

## Topics this package owns

See the index: the nearest lists; direct-to. Links instead of explanations: entering and approving a waypoint
(Waypoints and the database); the active waypoint and OBS mode (Navigation modes, planned); waypoint alerting
(Sequencing, planned anchor).

## Where to look

Nearest: `data/navdata/NearestList.ts`, `NearestUtils.ts`, `NearestAirportFinder.ts`,
`controls/selects/NearestSelector.tsx`, `pages/right/WaypointPage.tsx`, `controls/MessagePage.tsx`,
`pages/left/Set3Page.tsx`. Direct-to: `pages/left/DirectToPage.tsx`, `pages/MainPage.tsx` (the Direct To button),
`data/flightplan/ActiveWaypoint.ts`, `services/ModeController.ts`; test
`test/flight/flights/directToPlanWaypoint.test.ts`. The Quickstart has the screen `direct-to/ident-entry`; reuse or
replace it.

## Notes from other packages

None.

### From the package waypoints (2026-11-17)

- Waypoints and the database says in one sentence that scanning back past the first waypoint of the complete list
  leads into the nearest list (APT, VOR and NDB pages only), and links to Nearest. A run showed it arrives at `NR 9`;
  the count is Nearest's.
- An unknown identifier on the Direct To page brings up the offer to create a supplemental user waypoint (screen
  `direct-to/create-waypoint`); Direct-to links to User waypoints, `#creating-a-user-waypoint`.
- kln90b#487: Direct To prefills a user waypoint that was deleted on OTH 3 while its page still shows it.

### From the package waypoint-pages (2026-11-17)

- After a direct-to the unit puts NAV 1 on the right side unless the left side already shows NAV 1
  (`DirectToPage.tsx:148-150`, found by the ACT review). Direct-to owns it.
- The VOR, NDB and APT chapters each have "A nearest …" with the `NR` and rank and one sentence linking Nearest. The
  screens `pages/vor/vor-nearest` and `pages/ndb/ndb-nearest` reach the list by scanning back past the first station, not by the MSG
  shortcut; Nearest may want a screen of the shortcut. The rank fields of `pages/apt/apt-1-nearest`, `pages/vor/vor-nearest` and
  `pages/ndb/ndb-nearest` say what Nearest owns about the count and the refresh only by link; check them against Nearest.
- kln90b#489 also covers the left identifier fields (Direct To page, FPL pages): typing an identifier there skips
  localizers and VOTs as on the VOR page. Nothing describes the left-field half yet; Direct-to does, where it
  describes entering a VOR, with the comment.
- kln90b#491: the ACT page keeps the passed waypoint after a direct-to to another waypoint of FPL 0; the ACT chapter
  describes it.

## Changes to earlier pages

The APT chapter's "A nearest airport" is compared with Nearest and cut back if it says what Nearest now owns.
