# Package: approaches (Non-precision approaches)

One large and intricate Operation page; it runs on Opus. Pointers come from the planning survey of the code (paths
relative to `vendor/kln90b/kln90b/`); they are not checked facts. Screens and drawings are planned by the session
after its research.

## Pages

### Non-precision approaches (`operation/approaches.mdx`)

Written 2026-11-20 (`sidebar.order: 9`). The page opens with the Availability box for an approach-certified
installation. Sections as written, with their anchors:

- `#which-approaches-the-unit-offers`: what APT 8 lists and drops; **the Good to know box that ILS approaches are
  deliberately not in the database** (maintainer, 2026-11-20); APT 2 may still read `ILS`. Screen `approaches/apt-8-kolm`.
- `#loading-an-approach` (procedure, which leg is active afterwards), with `#an-approach-starts-only-at-an-iaf`,
  `#waypoints-that-fpl-0-holds-twice`, `#replacing-an-approach`, `#where-the-approach-goes-in-fpl-0` (kln90b#480).
- `#the-approach-in-fpl-0` (header, suffixes, fence), with `#invalid-add-and-invalid-del`.
- `#arming-the-approach` (30 NM from the airport reference point, the GPS APR switch, armed at any distance once
  armed), with `#press-alt-to-set-baro`, `#no-approach-in-the-status-line`, `#arm-gps-approach`.
- `#activating-the-approach`.
- `#the-cdi-scale-along-the-approach` with the drawing `ApproachCdiScale`.
- `#raim-in-an-approach`, with `#raim-not-available-apr-mode-inhibited` and `#press-gps-apr-for-nav`.
- `#flying-the-approach` (worked example KSEA to KOLM RNAV (GPS) RWY 17 via CARRO), with `#vectors-to-final`,
  `#course-reversals-and-holds-in-an-approach`, `#dme-arcs-in-an-approach`.
- `#the-missed-approach` (MAP alert, no sequencing, direct-to to the first missed approach waypoint, kln90b#493).
- `#changing-or-deleting-an-approach`.
- `#where-to-go-next`.

### Screens

All staged, in `kln90b/screens/approaches/` (shared state in `states.ts`). The RAIM screens are staged by
inhibiting satellites; `press-gps-apr` therefore also shows `BAD SATELLITE GEOMETRY` `AND RAIM NOT AVAILABLE`.

## Topics this package owns

See the index: arming and activation, the approach modes, DME arcs, the missed approach, what the unit does not
fly; with SID and STAR procedures, the two rules.

## Where to look

`services/ModeController.ts` (arming, activation, the integrity check), `data/navdata/SidStar.ts` (the approach
legs), `data/flightplan/ActiveWaypoint.ts`, `data/navdata/NavCalculator.ts`, `pages/right/Apt8Page.tsx`,
`data/PersistentMessages.ts` (the approach messages); tests `test/render/services/ModeControllerApproach.test.ts`,
`test/flight/flights/dmeArc.test.ts`; the APT chapter's sections on APT 8.

## Notes from other packages

All used by the package (2026-11-20).

## Changes to earlier pages

Made by the package (2026-11-20): APT 8 cut back to the page, the two rules and the links ("Questions before
loading an approach"); the approach messages and the RAIM paragraph on GPS reception and RAIM cut to the message and
the link; the RAIM links of GPS reception and RAIM, the STA chapter and the NAV chapter sharpened to
`#raim-in-an-approach`.

## Left open

- When Super NAV 5 with the `AUTO` range scale shows the runway diagram on an approach (the code: at a range scale of
  2 NM or less, so within about 2 NM of the MAP) could not be settled by the review; not filed, for the maintainer.
