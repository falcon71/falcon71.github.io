# Package: approaches (Non-precision approaches)

One large and intricate Operation page; it runs on Opus. Pointers come from the planning survey of the code (paths
relative to `vendor/kln90b/kln90b/`); they are not checked facts. Screens and drawings are planned by the session
after its research.

## Pages

### Non-precision approaches (`operation/approaches.mdx`)

Requirements: style guide, section 17 ("SID and STAR procedures and approaches"). The whole page stands under the
Availability box for an approach-certified installation.

1. Summary.
2. What the unit offers and what it does not fly.
3. Loading an approach: the task (APT 8 has the page); the rule that an approach starts only at an IAF and the rule
   about the transition, stated plainly.
4. The approach in FPL 0: the header, the suffixes, what differs from a SID or a STAR (link to SID and STAR
   procedures for the rest).
5. The approach modes: arming, activation and its conditions, the CDI scale along the approach (a drawing), the
   annunciations.
6. RAIM in an approach: what the unit checks and what it does when the check fails (link to GPS reception and RAIM).
7. Flying the approach step by step: one worked example with screens at the points where the pilot must recognize
   the state.
8. DME arcs.
9. Course reversals and holds: what the unit shows and what the pilot does in OBS mode.
10. The missed approach.
11. Changing or deleting the approach.
12. Links on.

## Topics this package owns

See the index: arming and activation, the approach modes, DME arcs, the missed approach, what the unit does not
fly; with SID and STAR procedures, the two rules.

## Where to look

`services/ModeController.ts` (arming, activation, the integrity check), `data/navdata/SidStar.ts` (the approach
legs), `data/flightplan/ActiveWaypoint.ts`, `data/navdata/NavCalculator.ts`, `pages/right/Apt8Page.tsx`,
`data/PersistentMessages.ts` (the approach messages); tests `test/render/services/ModeControllerApproach.test.ts`,
`test/flight/flights/dmeArc.test.ts`; the APT chapter's sections on APT 8.

## Notes from other packages

- From the package apt: the text about the arming distance that the review cut from the APT chapter is in the git
  history (`docs/plan/apt.md`).
- The worked example uses an approach of the FAA extract; Tutorial flight 2 flies the RNAV (GPS) Y approach to
  runway 32L at Boeing Field, so this page takes another one.
- The word list has approach header, DME arc waypoint, suffix.

## Changes to earlier pages

APT 8's "Questions before the load and where the approach goes" is compared with this page and cut back where this
page now owns the text. The pages of the package sta get their link to this page sharpened to its RAIM section.
