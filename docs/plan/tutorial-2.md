# Package: tutorial-2 (Tutorial flight 2, up to the top of descent)

Requirements: style guide, section 10 ("Tutorial flights") and section 17 ("Tutorial flights"): the route
`KYKM/27 YKM7 TITON V4 CHINS CHINS5 KBFI/R32LY`, what the maintainer chose it for and found when flying it, the
aircraft requirement, the EFB afterwards, no flight plan file. The page runs on Opus.

**Split (coordinator, 2026-11-22).** The research showed about 330 to 400 lines and 22 to 26 screens for the whole
flight, twice Tutorial flight 1. As this file foresaw, the package is split at the top of descent, near RADDY: this
package writes the page up to there; the package tutorial-2-approach writes the descent, the arrival and the approach
on the same page (`docs/plan/tutorial-2-approach.md`).

## Pages

### Tutorial flight 2 (`getting-started/tutorial-2.mdx`)

The tutorial owns no topic. Every step links the section that owns it; a difference between the tutorial and its
owner is a finding for the owner. It does not teach again what Tutorial flight 1 taught (the cursor, entering an
identifier, the power-on); it says in one sentence that the flight assumes it, with the link.

Sections as written (2026-11-22), with their anchors under `/kln90b/getting-started/tutorial-2/`:

1. **Summary and the table of the flight** (before the first heading): KYKM to KBFI, 100 NM along the flight plan
   to runway 32L; the "checked with" cell carries a comment for the maintainer to confirm the cycle.
2. **What you need** (`#what-you-need`): the aircraft requirement; the Availability box for the approach (SIDs and
   STARs work without it); the charts by name through the FAA chart search; the en route low altitude chart, whose
   number a comment leaves to the maintainer.
3. **Entering the flight plan** (`#entering-the-flight-plan`): KYKM, TITON, CADED, CHINS, KBFI by hand; the unit loads
   no airway; FPL 0 becomes active with the second waypoint.
4. **Loading the departure** (`#loading-the-departure`): YKM7 on APT 7, no runway question, `REDUNDANT WPTS IN FPL`;
   the unit drops the climb (it ends at an altitude) and the hold, and keeps YKM and TITON.
5. **Loading the arrival** (`#loading-the-arrival`): CHINS5 with the YKM transition; a transition must be selected.
6. **Loading the approach** (`#loading-the-approach`): RNAV 32L with the IAF HUMPP; an approach starts only at an IAF.
7. **Deleting the waypoints the flight plan holds twice** (`#deleting-the-waypoints-the-flight-plan-holds-twice`):
   five deletions bottom up, the finished FPL 0 with and without the approach.
8. **The flight plan in the EFB** (`#the-flight-plan-in-the-efb`): `REQUEST FROM AVIONICS`; the runways 09 and 14L the
   EFB names (bug candidate, see below); the failed output, with the link.
9. **The departure** (`#the-departure`): the climbing right turn direct to YKM and the direct-to, OBS mode on the
   radial 284, the steps back to leg mode (given once, the hold links them).
10. **The hold at TITON** (`#the-hold-at-titon`): the Good to know box on the course at TITON (290°, not 284°); the
    hold in OBS mode, inbound on the radial with left turns; TO/FROM and the reversed D-bar outbound; the reminder
    `IF REQUIRED SELECT OBS` where the database has the hold.
11. **En route** (`#en-route`): leg mode on V4, NAV 3 with `MSA` and `ESA` 16,300 ft past CHINS, Super NAV 5 in actual
    track up at range 30. The page ends with a comment where the package tutorial-2-approach goes on.

## Screens

All staged except `IF REQUIRED SELECT OBS` at TITON (CIFP 2610 codes no hold in YKM7). Ids under
`kln90b/screens/tutorial-2/`, shared steps in `kln90b/screens/shared/tut2.ts` (hand entry of the route from an empty
FPL 0, and the flight steps from the climb-out to 8 NM past CHINS). `super-nav-5-route` is deleted.

## Notes for the session

- The maintainer flies the tutorial in the simulator before it is published; the session's report hands over a
  list of what to check in the cockpit.
- The screens use the FAA extract of AIRAC 2610 (NASR 2026-10-01, CIFP 2610).

## For the maintainer's flight in the simulator

To check in the cockpit before the tutorial is published (researcher, writer and reviewer, 2026-11-22):

1. Entering TITON, CADED or CHINS in FPL 0 brings up neither the Duplicate Waypoint page nor the waypoint type
   identification page.
2. KYKM has one APT 7 page with GROMO4, WENAS7 and YKM7; YKM7 and CHINS5 ask no runway.
3. After takeoff, with NAV 1 on the right, the Direct To button offers YKM; YKM's VOR page shows 21°E.
4. OBS 284 centers the needle on the radial near YKM; back in leg mode `ADJ NAV IND CRS TO 290°` comes.
5. The simulator's YKM7 has the hold at TITON: `IF REQUIRED SELECT OBS` appears; note the hold's side, turns and
   inbound course (the page says southeast of TITON, inbound on the radial 284, left turns).
6. In OBS mode at TITON, 290° centers the needle on the radial; leaving the hold in leg mode with TITON ahead, the
   unit goes direct to TITON and then on to CADED.
7. Past CHINS `MSA` and `ESA` read 16,300 ft, and `MSA` drops to 9,900 ft near 47°N.
8. Super NAV 5: after North up, two steps of the right inner knob give actual track up; range 30 shows the map as the
   screen does.
9. The EFB after `REQUEST FROM AVIONICS` names runway 09 and 14L (bug candidate).
10. The table names the cycle flown, and the en route chart's number is filled in (the two comments on the page).

## Notes from other packages

None open; the note of the package failures (the EFB and the failed output) is used.

## Changes to earlier pages

None planned.
