# Package: sid-star (SID and STAR procedures)

One Operation page; APT 7 of the page reference is written. Pointers come from the planning survey of the code
(paths relative to `vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after
its research; the APT 7 screens (`apt-7-*`) exist and are reused where they fit.

## Pages

### SID and STAR procedures (`operation/departures-arrivals.mdx`)

The slug stays, because pages link to it; the title is "SID and STAR procedures". Requirements: style guide,
section 17 ("SID and STAR procedures and approaches").

1. Summary.
2. What the unit keeps of a procedure, and which procedures it offers.
3. Loading a SID; loading a STAR: the task from start to end (APT 7 has the page and its lists).
4. The rule that a transition must be selected, stated plainly, with the duplicates the pilot then deletes.
5. The procedure in FPL 0: where it goes, the header and the suffixes, the make-room question (shown and explained
   here).
6. Changing and deleting a loaded procedure; editing its waypoints; adding a waypoint by hand to a procedure.
7. Flying it: what the pilot flies by hand; what the unit forgets while it is off (one sentence, link to Power-on).
8. Links on.

## Topics this package owns

See the index: what a loaded procedure does in FPL 0, and (with Non-precision approaches) the two rules.

## Where to look

`data/navdata/SidStar.ts`, `pages/right/Apt7Page.tsx`, `pages/left/ProcedureMakeRoomPage.tsx`,
`controls/FlightplanList.tsx` (the header and its `CHANGE` and `DELETE`), `services/FlightplanUtils.ts`,
`services/FlyOverWaypoints.ts`; the APT chapter's sections on APT 7, whose terms this page keeps.

## Notes from other packages

- From the package apt: the text about where a procedure goes in FPL 0 and about the make-room question that the
  review cut from the APT chapter is in the git history (`docs/plan/apt.md`, "Text the review moved out of the
  chapter").
- From the package apt, filed as kln90b#480 (the maintainer decides): a STAR or an approach is inserted before the first occurrence of the
  airport, which puts it at the start of a round trip. Not settled by the real manual; the maintainer decides
  whether it is filed. The page describes the current behavior.
- The maintainer's findings on the route of Tutorial flight 2 (style guide, section 17) show the rules at work.

## Changes to earlier pages

APT 7's "Where the procedure goes in FPL 0" and "What the unit keeps of a procedure" are compared with this page
and cut back to the sentence and the link where this page now owns the text. The session lists the cuts here first.
