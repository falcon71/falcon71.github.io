# Package: navigation (Navigation modes; Sequencing and turn anticipation; the MOD chapter)

The intricate core of en route navigation; the Operation pages run on Opus (`docs/coordinator-prompt.md`,
"Models"). Pointers come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are
not checked facts. Screens and drawings are planned by the session after its research. If the research shows the
package is too large for one session, Sequencing and turn anticipation becomes a package of its own.

## Pages

### Navigation modes (`operation/navigation-modes.mdx`)

1. Summary.
2. `#the-active-waypoint` (planned): the active waypoint and the active leg, how the pages mark them.
3. Leg mode: what the unit does in it.
4. OBS mode: what changes; selecting leg and OBS on the MOD pages or with the aircraft's switch (Availability box);
   the OBS course and where it is set; the messages that ask for a course on the indicator.
5. Changing between the modes in flight: what the unit keeps.
6. The mode annunciations of the status line.
7. The CDI scale: the scale of each mode, changing it, a drawing (style guide, section 16).
8. Magnetic variation: where the unit has none, entering one.
9. Links on (Non-precision approaches for the approach modes).

### Sequencing and turn anticipation (`operation/sequencing.mdx`)

1. Summary.
2. `#waypoint-alerting` (planned): when and how the unit announces the next waypoint.
3. Waypoint sequencing: when the unit makes the next leg active, and when it does not.
4. Turn anticipation: the geometry (a drawing), the limits, turning it off on SET 6.
5. Fly-over waypoints.
6. Links on.

### MOD pages (`pages/mod.mdx`)

MOD 1 and MOD 2: the pages, their variants with the aircraft's switch, the fields.

## Topics this package owns

See the index: the active waypoint, the modes, the OBS course, the mode annunciations, the CDI scale, magnetic
variation; waypoint alerting, sequencing, turn anticipation, fly-over waypoints.

## Where to look

`services/ModeController.ts`, `data/navdata/NavCalculator.ts`, `ObsGeometry.ts`, `SequencingGeometry.ts`,
`WaypointAlert.ts`, `data/flightplan/ActiveWaypoint.ts`, `services/FlyOverWaypoints.ts`,
`data/navdata/KLNMagvar.ts`, `pages/left/Mod1Page.tsx`, `Mod2Page.tsx`, `Set6Page.tsx`, `pages/ObsWarningPage.tsx`, `pages/left/DirectToPage.tsx` (the direct-to in OBS mode);
tests `test/render/services/ModeController*.test.ts` and in `test/flight/flights/`: `turnLead`,
`waypointAlertTurn`, `largeTurn`, `bisectorSequencing`, `offCourseSequencing`, `hsiToFromFlags`.

## Notes from other packages

- From the package getting-started: the glossary entries `enr:`, `arm-leg`, `arm:` and `apr-leg` were written
  before the rule on official terms; the reviewer of Navigation modes checks the names of all modes and the
  coordinator corrects the glossary. The word list has Enroute-Leg mode, leg mode, OBS mode, D-bar.
- The glossary's placeholder entry `Turn anticipation` goes when this package replaces the placeholder page (style
  guide, section 14: operating concepts are no glossary terms).
- The FAQ entry "Why does the unit not sequence to the next waypoint?" links to Sequencing; note the anchor in
  `docs/plan/help.md`.

## Changes to earlier pages

The seam check verifies that `#the-active-waypoint` and `#waypoint-alerting` exist, since earlier pages and field
explanations link to them.
