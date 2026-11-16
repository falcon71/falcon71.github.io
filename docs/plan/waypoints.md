# Package: waypoints (Waypoints and the database)

One large Operation page, the owner of everything the waypoint pages have in common. Pointers come from the
planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not checked facts. Screens are
planned by the session after its research.

## Pages

### Waypoints and the database (`operation/waypoints.mdx`)

Planned sections:

1. Summary.
2. The database: what it holds, the waypoint types, the cycle and its expiry, the messages about it.
3. Selecting a waypoint by its identifier: on a waypoint page, and in a field of another page.
4. Selecting a waypoint by scanning: what the scan goes through, where the nearest waypoints stand in it (link to
   Nearest).
5. Duplicate identifiers: the duplicate waypoint page.
6. Approving the waypoint page: the page shown for approval, ENT and CLR, taking the waypoint of the right page
   into a field.
7. The active waypoint's pages (ACT), as a concept; the ACT chapter has the pages.
8. `#user-waypoints` (planned): what a user waypoint is, creating one (`CREATE NEW WPT AT`, `USER POS?`, the present
   position, a position by radial and distance), the limit and `USR DB FULL`, editing, deleting on OTH 3, waypoints
   the unit creates and removes by itself.
9. Changing data of a database waypoint, if the research confirms a pilot can.
10. Links on.

If the research shows the page is too large, the user waypoints become a page of their own
(`operation/user-waypoints`); the planned anchor then moves, and the session corrects the links to it.

## Topics this package owns

See the index: waypoint pages in general, user waypoints, the database. Links instead of explanations: the cursor,
data entry and the scan as a control (Controls and display); the nearest lists (Nearest); remarks (APT 5); the
reference and center waypoints as tasks (Flight plans).

## Where to look

`controls/editors/WaypointEditor.tsx` (the entry and approval; `docs/architecture.md` describes the flow),
`controls/selects/WaypointSelector.tsx`, `pages/right/WaypointPage.tsx` (the scan), `data/navdata/Scanlist.ts`,
`pages/right/WaypointConfirmPage.tsx`, `pages/left/DuplicateWaypointPage.tsx`,
`controls/selects/CreateWaypointMessage.tsx`, `data/navdata/KLNFacilityRepository.ts`, `IcaoBuilder.ts`,
`services/TemporaryWaypointDeleter.ts`, `pages/left/Oth3Page.tsx`, `data/navdata/Database.ts`,
`pages/AiracPage.tsx`, `pages/left/Set0Page.tsx`; tests `test/flight/flights/duplicateWaypoint.test.ts`,
`test/render/pages/right/`.

## Notes from other packages

- From the package apt: the text about creating a user waypoint, the `USER POS?` entry and the scan rules that the
  review cut from the APT chapter is in the git history (`docs/plan/apt.md`, "Text the review moved out of the
  chapter"). The APT chapter keeps the offer once and the fields of a user-defined airport.
- The word list has the terms: waypoint type, user waypoint, user-defined airport, approve the waypoint page.
- From the planning survey: the real unit's search by name is not simulated; Known limitations names it, this page
  does not (style guide, section 3).

## Changes to earlier pages

The package waypoint-pages, which follows, cuts the APT chapter back to this owner. This package itself changes no
earlier page; its seam check verifies that `#user-waypoints` exists.
