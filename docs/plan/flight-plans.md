# Package: flight-plans (Flight plans; the FPL chapter)

The topic with the most edge cases. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research. If the
research shows the package is too large for one session, the FPL chapter becomes a package of its own, worked right
after the Operation page.

## Pages

### Flight plans (`operation/flight-plans.mdx`)

1. Summary.
2. The flight plans of the unit: FPL 0 and the stored ones, the limits, what is stored while the unit is off.
3. Creating a flight plan.
4. Adding, replacing and deleting waypoints; the waypoint type page; a full flight plan and the make-room page.
5. Activating a flight plan, also inverted.
6. Storing FPL 0 as a numbered flight plan; deleting a flight plan.
7. Flying the active flight plan: what FPL 0 marks, a direct-to to one of its waypoints (one paragraph, link),
   editing the active flight plan in flight.
8. Procedures in the flight plan: one paragraph and the link to SID and STAR procedures.
9. Reference waypoints and center waypoints: the tasks (the REF and CTR chapters have the pages).
10. A route from the EFB, and sending FPL 0 to the EFB.
11. Links on.

### FPL pages (`pages/fpl.mdx`)

FPL 0 and FPL 1 to FPL 25: the page, the variants (empty, filled, the cursor on, the active flight plan with its
marks, procedure headers, the questions of the top line) and the fields.

## Topics this package owns

See the index: flight plans, the EFB route exchange, reference and center waypoints as tasks.

## Where to look

`controls/FlightplanList.tsx`, `controls/FlightplanListItem.tsx`, `pages/left/FplPage.tsx`, `MakeRoomPage.tsx`,
`FplInsertMakeRoomPage.tsx`, `WaypointTypePage.tsx`, `data/flightplan/Flightplan.ts`, `ActiveWaypoint.ts`,
`services/FlightplanUtils.ts`, `services/Flightplanloader.ts`, `services/KlnEfbLoader.ts`, `KlnEfbSaver.ts`,
`EfbRouteFit.ts`, `settings/UserFlightplanPersistor.ts`; tests `test/flight/flights/nextLegEdit.test.ts`,
`skippedLeg.test.ts`, `test/unit/services/FlightplanUtils.test.ts`, `test/render/pages/left/`,
`test/render/services/KlnEfbLoader.test.ts`, `KlnEfbSaver.test.ts`; the wiki FAQ on loading a flight plan, whose
part about version 1.x does not apply.

## Notes from other packages

- From the package apt, filed as kln90b#479: a route from the EFB loads an approach into a unit not installed for
  approaches; `CHANGE APR?` then throws. Confirmed against the real manual by the dry run's reviewer; unfiled
  (`docs/plan/apt.md`). The researcher of this package reproduces it; the coordinator files it with the
  maintainer's word.
- The style guide (section 17, "Tutorial flights") has the EFB steps as the maintainer described them; Tutorial
  flight 2 uses them and links here.
- The word list has procedure header, approach header, suffix, DME arc waypoint.

### From the package controls (2026-11-17)

- **The leg marks of an FPL page** (as read by the writer of Controls and display in `controls/FlightplanArrow.tsx`;
  check them): one mark at the from-waypoint, one at the active waypoint, another for a direct-to, another for a
  waypoint inside a procedure; they vanish while an entry is open. The FPL chapter owns them; the field explanations
  of `status-line-crsr-both-sides` and `fpl-0-delete-question` name only the marks of the active leg.
- **CLR with the cursor off on an FPL page** asks `DELETE FPL?`, even when the CLR was meant for a field on the right
  side (fact sheet of the package controls). Controls and display does not describe it; say it here if it surprises.
  The screen `fpl-0-delete-question` shows the delete question of a waypoint in the list.
- Keyboard mode: typing into a filled waypoint of a flight plan inserts a new waypoint in front of it, and the key
  starts the new entry (`FlightplanListItem.tsx:468`); Keyboard mode links to Flight plans for `INVALID ADD` on an
  approach waypoint and the make-room question when the plan is full.

## Changes to earlier pages

None planned.
