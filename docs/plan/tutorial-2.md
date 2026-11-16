# Package: tutorial-2 (Tutorial flight 2)

Requirements: style guide, section 10 ("Tutorial flights") and section 17 ("Tutorial flights"): the route
`KYKM/27 YKM7 TITON V4 CHINS CHINS5 KBFI/R32LY`, what the maintainer chose it for and found when flying it, the
aircraft requirement, the EFB afterwards, no flight plan file. The page runs on Opus.

## Pages

### Tutorial flight 2 (`getting-started/tutorial-2.mdx`)

Phases as sections: what the pilot needs (with the note that SIDs and STARs work without an approach-certified
installation); entering the flight plan by hand, the airway waypoint by waypoint; loading the SID, the STAR and
the approach with their transitions and deleting the duplicates; the EFB as a reference; the departure along the
radial in OBS mode; the hold at TITON; en route in leg mode; the arrival; the approach, or the visual approach for
a pilot without approaches.

## Screens

Ids start with `tut2-`. Some exist from the dry run of the screen generator (`tut2-apt-*`); the session reviews
them against the pages written since and plans the rest.

## Notes for the session

- The maintainer flies the tutorial in the simulator before it is published; the session's report hands over a
  list of what to check in the cockpit.
- The tutorial owns no topic. Every fact it states is checked against the owning page as well as the code.
- If the page is too large for one session, the session splits it at the top of descent and records the second
  half as a package of its own.

## Notes from other packages

### From the package failures (2026-11-16)

- The route exchange with the EFB stops while the output that carries the navigation data has failed (Simulated
  failures, `/kln90b/operation/failures/#the-outputs-to-the-aircraft`). Where the tutorial has the pilot load
  FPL 0 into the EFB, one sentence says that a simulated failure of that output makes the step fail silently,
  with the link.

## Changes to earlier pages

None planned.
