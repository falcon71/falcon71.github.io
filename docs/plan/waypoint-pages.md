# Package: waypoint-pages (the VOR, NDB, INT, SUP and ACT chapters)

Five small chapters of the page reference, written right after their owner, Waypoints and the database. Pointers
come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not checked facts.
Screens are planned by the session after its research.

## Pages

Each chapter follows the APT chapter's form at a smaller size: what the page shows, the screen, the variants, and
one sentence with the link for everything that works as on every waypoint page.

- **VOR page** (`pages/vor.mdx`): a database VOR; a nearest VOR; a user-defined VOR and its entry; the fields a
  pilot can change.
- **NDB page** (`pages/ndb.mdx`): the same for NDBs.
- **INT page** (`pages/int.mdx`): an intersection; the reference VOR with radial and distance, and the time the
  unit takes to find it; a user-defined intersection.
- **SUP page** (`pages/sup.mdx`): supplemental waypoints; the page with none stored; the page as the place where a
  new waypoint is defined.
- **ACT pages** (`pages/act.mdx`): the waypoint pages of the active waypoint; scanning through FPL 0; the page with
  no active waypoint; which pages exist for which waypoint type (ACT 8 with the Availability box).

VOR and NDB, and INT and SUP, are near twins: one writer per pair, so that the twins read alike.

## Topics this package owns

Only the pages and their fields. Everything general links to Waypoints and the database; the nearest variant links
to Nearest (planned); the active waypoint links to Navigation modes (planned anchor).

## Where to look

`pages/right/VorPage.tsx`, `NdbPage.tsx`, `IntPage.tsx`, `SupPage.tsx`, `ActPage.tsx`, `WaypointPage.tsx`,
`controls/displays/ActiveArrow.tsx`, `pages/PageTreeController.ts` (which ACT pages exist).

## Notes from other packages

None.

## Changes to earlier pages

The APT chapter was written before its owner existed. Its opening section ("The APT pages: one airport on every
page", with "User-defined airports" and "The ACT page and approving the waypoint page of an airport") is compared
with Waypoints and the database and the ACT chapter and cut back to what is specific to airports, with the links.
The session lists the exact cuts here first; they go through the reviewer.

The glossary entries that only one APT screen uses (the codes of APT 3, the frequency types of APT 4 and the like)
move into the field explanations of those screens, and their `<Term>` tags go (style guide, section 14, rule of
2026-11-16). The coordinator edits the glossary; the writer edits the chapter and the field explanations.
