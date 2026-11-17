# Package: waypoints (Waypoints and the database)

One large Operation page, the owner of everything the waypoint pages have in common. Pointers come from the
planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not checked facts. Screens are
planned by the session after its research.

## Pages

The research (2026-11-17) found two subjects of about equal size: how any waypoint is found, chosen and approved,
and the user waypoints with their own tasks and screens. The package therefore writes two Operation pages, as this
file foresaw; the anchor `#user-waypoints` moved to the new page, and the links to it are corrected (below).

### Waypoints and the database (`operation/waypoints.mdx`, sidebar order 1)

As written (2026-11-17), with the anchors:

- Summary.
- `#the-database`: the waypoint types, where the data comes from, the cycle and its expiry; under it
  `#no-sup-wpts-and-the-other-empty-lists` (screen `waypoint-no-sup-wpts`), `#data-base-out-of-date`,
  `#recycle-power-to-use`, `#outdated-db`.
- `#entering-an-identifier`: `#on-a-waypoint-page` (screen `apt-1-ksea-cursor`), `#in-a-field-of-a-left-page`
  (screen `direct-to-ident-entry`), `#no-such-wpt` (screen `waypoint-no-such-wpt`).
- `#scanning-through-the-database`: the complete list, its order and ends, the step into the nearest list.
- `#duplicate-identifiers`: `#choosing-between-duplicate-identifiers` (the Duplicate Waypoint page, screen
  `waypoint-dup-page`), `#dup-ident`.
- `#approving-the-waypoint-page` (screen `apt-confirm`): `#taking-the-waypoint-of-the-right-page` (screens
  `waypoint-take-right-before`, `waypoint-take-right-after`, added at the maintainer's review).
- `#the-act-pages` (screen `apt-act-1`): the concept only.
- `#changing-the-data-of-a-database-waypoint`.
- `#where-to-go-next`.

`PRES POS?` without a position fix stores the last position the unit held; User waypoints describes it. The
maintainer does not know the real unit's behavior and decided not to file it (2026-11-17).

Not staged: `DUP IDENT` (a same-type duplicate needs stored user data the extract cannot give; the text quotes it).
The message screens show both halves (style guide, section 13).

### User waypoints (`operation/user-waypoints.mdx`, new, sidebar order 2)

As written (2026-11-17), with the anchors:

- Summary: what a user waypoint is, its five waypoint types, the limit.
- `#creating-a-user-waypoint`: `#creating-a-waypoint-on-a-waypoint-page` (screens `apt-create-new-wpt`,
  `apt-1-user-pos`), `#creating-a-waypoint-from-a-reference-waypoint` (screen `sup-create-by-radial`; kln90b#488),
  `#creating-a-waypoint-from-the-direct-to-page-or-a-flight-plan` (screen `direct-to-create-waypoint`),
  `#creating-a-user-vor-or-a-user-ndb`.
- `#usr-db-full` (screen `sup-usr-db-full`).
- `#editing-a-user-waypoint` (screen `sup-user-waypoint`).
- `#deleting-a-user-waypoint` (screens `oth-3-user-waypoints`, `oth-3-delete-question`, `oth-3-used-in-fpl`;
  kln90b#487).
- `#waypoints-the-unit-creates-by-itself`: reference, center and DME arc waypoints, the waypoints of a route from
  the EFB.
- `#keeping-user-waypoints`: one sentence each and the links to Power-on and Simulated failures.
- `#where-to-go-next`.

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

### From the package controls (2026-11-17)

Cut from Controls and display, which keeps only the scan as a control and links here (check each in the code):

- **The scan:** the pulled right inner knob steps through the waypoints of the page's waypoint type; the order puts
  digits before letters; quick turning makes larger steps, up to 250 waypoints per click (`pages/WaypointPage.tsx:14-15,
  41-50`); the list stops at its end, and going back leads into the nearest list. It acts only with the cursor off.
  The pulled state survives a power cycle (`Hardware.ts`, `KLN90BCore.ts:232-252`).
- **An unknown identifier** on the Direct To page and in a flight plan brings up the offer to create a user waypoint
  instead of `NO SUCH WPT` (`controls/editors/WaypointEditor.tsx`, `offerCreation`, about lines 28-32, 98-104).
- ENT on an identifier entry shows the waypoint page for approval without moving the cursor
  (`WaypointEditor.tsx:190-196`); ENT on a closed identifier takes the waypoint shown on the right page.
- On a waypoint page's identifier, the first step of the inner knob goes from the existing character on through the
  character set; Controls and display gives the character cycle.

### From the package power-on (2026-11-17)

- Power-on and initialization shows the Database page (screens `database-page`, `database-page-expired`) and links
  here for the database and its cycle. The page shows the last day of the cycle (`data/navdata/Database.ts:20`,
  the expiration minus one second), and `EXPIRES` for every current database, however many days it has left. This
  page explains the cycle and expiry and links back to `/kln90b/unit/power-on/#the-database-page` for the page.

## Changes to earlier pages

- The links to `/kln90b/operation/waypoints/#user-waypoints` (APT chapter, the APT user-airport screens and
  `apt-create-new-wpt`) go to `/kln90b/operation/user-waypoints/` instead. A link change only, made by the
  coordinator.
- The sidebar orders of the Operation pages after User waypoints move up by one, so that the order of the style
  guide's chapter list holds (index, "Site and generator notes").
- The package waypoint-pages, which follows, cuts the APT chapter back to these owners.
- From the seam check (2026-11-17):
  - Power-on and initialization, SET 2 section: the quoted `RECYCLE POWER TO USE` block and its explanation become
    one sentence that names the message and links to `/kln90b/operation/waypoints/#recycle-power-to-use`.
  - Controls and display: the ENT-on-an-identifier bullet links to `#entering-an-identifier`; the paragraph on the
    approval keeps its sentence, links to `#approving-the-waypoint-page` and drops the `apt-confirm` screen, which
    Waypoints and the database shows; "Questions in lists" drops the clause about the waypoint page of a user
    waypoint, which User waypoints owns.
  - Quickstart: "the confirmation of a waypoint" becomes "approving the waypoint page" (word list).
  - `<Term t="CRSR">` added to the CRSR fields of `oth-3-used-in-fpl`, `sup-usr-db-full` and
    `direct-to-create-waypoint`, like the other screens.
