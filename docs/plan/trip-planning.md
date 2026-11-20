# Package: trip-planning (Trip planning and calculators; the TRI and CAL chapters)

Many small pages of one pattern. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research. If the
package is too large for one session, the CAL chapter becomes a package of its own.

## Pages

### Trip planning and calculators (`operation/trip-planning.mdx`)

1. Summary.
2. Planning a trip: from the present position, between two waypoints, along a flight plan; the speed, wind and fuel
   the unit plans with; the airspaces and the minimum safe altitude along the route.
3. Times in flight: the D/T pages in use, time zones, the flight timer and SET 4.
4. The calculators: which page answers which question, with one worked example where the pages work together.
5. Links on.

### TRI pages (`pages/tri.mdx`)

TRI 0 to TRI 6: the pages, their variants (`TRI+2`, `TRI+4`, `TRI+6`; no position; no flight plan), the fields.

### CAL pages (`pages/cal.mdx`)

CAL 1 to CAL 7: the pages, what each takes from the aircraft's sensors where the installation has them
(Availability boxes), the fields.

## Topics this package owns

See the index: trip planning, the calculators, times and the flight timer as tasks.

## Where to look

`pages/left/Tri0Page.tsx` to `Tri6Page.tsx`, `Cal1Page.tsx` to `Cal7Page.tsx`, `services/AirspacesAlongRoute.ts`,
`services/MSA.ts`, `services/KLNNavmath.ts`, `services/Timers.ts`, `services/TimezoneService.ts`, `data/Time.ts`,
`data/Sun.ts`, `pages/left/Set4Page.tsx`, `pages/right/Dt4Page.tsx`.

## Notes from other packages

From the planning survey: the fuel values of the TRI pages are the pilot's own entries and separate from the fuel
computer of OTH 5 to OTH 8; the chapter says so and links to Fuel and air data (planned).

### From the package flight-plan-pages (2026-11-20)

- The D/T chapter (`pages/dt.mdx`) explains the D/T pages and their fields, including the time zone field of D/T 2
  and D/T 4 and the flight time of D/T 4, and links to this page (page link only) for times, time zones and the
  flight timer as tasks. Sharpen those links to this page's sections.
- The time zone list, as the writer of D/T read it in the code (check it): 19 zones in knob order, UTC, GST, GDT,
  ATS, ATD, EST, EDT, CST, CDT, MST, MDT, PST, PDT, AKS, AKD, HAS, HAD, SST, SDT, each with a fixed offset from UTC
  and no automatic change to daylight saving time. The zone is one setting shared by D/T 2, D/T 4, SET 2, STA 5 and
  the CAL pages that show it; it changes at once as the knob turns, without ENT. This page owns the list.
- The flight timer: it runs at a groundspeed of 30 kt or more (the code compares `>=` 30 while SET 4 labels it
  `GS > 30kt`) or from power-on, as SET 4 sets; the setting takes effect at once. The departure time of D/T 4 is the
  time at which the timer starts. Both are cleared at every power-on, and the pilot cannot reset them.

## Changes to earlier pages

The D/T chapter and the SET chapter (SET 4) get their links to this page sharpened to its sections.
