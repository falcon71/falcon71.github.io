# Package: fuel-air-data (Fuel and air data; the OTH chapter)

Pointers come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not
checked facts. Screens are planned by the session after its research.

## Pages

### Fuel and air data (`operation/fuel-air-data.mdx`)

Both halves stand under Availability boxes (a fuel computer; an air data computer).

1. Summary.
2. Fuel management: entering the fuel on board where the aircraft does not send it, reading fuel required, reserve,
   endurance and range, the message that asks for the fuel on board.
3. Air data: true airspeed, wind and temperatures, and what needs a heading input.
4. Links on.

### OTH pages (`pages/oth.mdx`)

OTH 1 to OTH 10. The pages that exist depend on the installation, and so do the numbers of the air data pages; the
type's opening section says which pages a pilot finds. OTH 1 says in one sentence that the simulator has no flight
service stations (style guide, section 3). OTH 3 and OTH 4 are the lists for deleting user waypoints and remarks.

## Topics this package owns

Fuel management and air data; the OTH pages and their fields. Links instead of explanations: user waypoints
(Waypoints and the database); remarks (APT 5); the center's airspace (Airspace and altitude alerting).

## Where to look

`pages/left/Oth1Page.tsx` to `Oth10Page.tsx`, `pages/PageTreeController.ts` (which pages exist), `Sensors.ts`,
`pages/PageManager.ts` (the fuel message), `controls/WaypointDeleteListItem.tsx`, `settings/RemarksManager.ts`.

## Notes from other packages

- From the package apt: APT 5 links to OTH 4 for deleting remarks; a remark blanked out on APT 5 keeps its slot
  until it is deleted on OTH 4.
- From the planning survey: without a fuel computer the air data pages carry the names OTH 5 and OTH 6. The page
  links and `kln90b/src/data/pageTree.ts` know OTH 5 to OTH 10 as optional pages; the session settles with the
  maintainer how the chapter's headings name the air data pages so that the page links stay right.

### From the package waypoints (2026-11-17)

- OTH 3 is shown on User waypoints for the deleting task (`#deleting-a-user-waypoint`): the screens
  `pages/oth/oth-3-user-waypoints`, `pages/oth/oth-3-delete-question` and `pages/oth/oth-3-used-in-fpl` exist; the OTH chapter reuses them and
  links back for the task. OTH 3 checks only the active waypoint and the flight plans before it deletes; what happens
  to a deleted waypoint that TRI, CAL 7, NAV 4 or STA 5 holds was not settled.

## Changes to earlier pages

None planned.
