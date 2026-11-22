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
   to runway 32L; the "checked with" cell: flown with the simulator's default data, AIRAC 2611, screens from the
   FAA's AIRAC 2610.
2. **What you need** (`#what-you-need`): the aircraft requirement; the Availability box for the approach (SIDs and
   STARs work without it); the charts by name through the FAA chart search; the en route low altitude chart L-13,
   with where V4 is on it.
3. **Entering the flight plan** (`#entering-the-flight-plan`): KYKM, TITON, CADED, CHINS, KBFI by hand; the unit loads
   no airway; FPL 0 becomes active with the second waypoint.
4. **Loading the departure** (`#loading-the-departure`): YKM7 on APT 7, no runway question, `REDUNDANT WPTS IN FPL`;
   the unit drops the climb (it ends at an altitude) and the heading to intercept, and keeps YKM and TITON; the data
   codes no hold.
5. **Loading the arrival** (`#loading-the-arrival`): CHINS5 with the YKM transition; a transition must be selected.
6. **Loading the approach** (`#loading-the-approach`): RNAV 32L with the IAF HUMPP; an approach starts only at an IAF.
7. **Deleting the waypoints the flight plan holds twice** (`#deleting-the-waypoints-the-flight-plan-holds-twice`):
   five deletions bottom up (the en route copies of CHINS and TITON, so that the STAR and the SID stay complete), the
   finished FPL 0 with and without the approach.
8. **The flight plan in the EFB** (`#the-flight-plan-in-the-efb`): `REQUEST FROM AVIONICS`; the runways 09 and 14L the
   EFB names (no bug: the EFB needs a runway, kln90b#409, maintainer 2026-11-22); the failed output, with the link.
9. **The departure** (`#the-departure`): the climbing right turn direct to YKM and the direct-to, OBS mode on the
   radial 284 and back to leg mode, each with the GPS CRS switch first and MOD 2 or MOD 1 with ENT for aircraft
   without one (maintainer, 2026-11-22); the Good to know box on the courses along the radial (290° on the unit, 284°
   on the chart), right after the change back to leg mode at the screen `nav-3-leg-titon`.
10. **The hold at TITON** (`#the-hold-at-titon`): the hold as charted, inbound course 284° toward TITON, outbound 104°,
    turns as the chart shows (the turn direction is not confirmed, so the page names none); no
    `IF REQUIRED SELECT OBS`, because the data codes no hold, so the pilot changes to OBS before TITON; the indicator
    stays on 290°; TO/FROM in the hold.
11. **En route** (`#en-route`): leg mode on V4, NAV 3 with `MSA` and `ESA` 16,300 ft past CHINS (`MSA` and `ESA` off-route
    values; V4 TITON to CADED 7,400 ft, the maintainer's figure), Super NAV 5 in actual track up at range 30, then VNAV
    planned on NAV 4 12 NM past CHINS at 10,000 ft: 6,000 ft at COVOG, offset 00, angle 3.0°, armed, descent point
    about 12 NM past RADDY, about 2 NM before HUMPP. The page ends with a comment where the package tutorial-2-approach goes on.

## Screens

All staged. Ids under `kln90b/screens/tutorial-2/`, shared steps in `kln90b/screens/shared/tut2.ts` (hand entry of the
route from an empty FPL 0, and the flight steps from the climb-out to 12 NM past CHINS). The unit of the flight is
installed with the GPS CRS switch (`LEG_OBS_SWITCH`), and the steps change the course mode with the switch
(`gpsCrsSwitch`); the screens came out the same as with ENT on the MOD pages. `nav-4-vnav-covog` (VNAV armed,
`vnavToCovog`) was added on 2026-11-22. `super-nav-5-route` is deleted.

## Notes for the session

- The maintainer flies the tutorial in the simulator before it is published; the session's report hands over a
  list of what to check in the cockpit.
- The screens use the FAA extract of AIRAC 2610 (NASR 2026-10-01, CIFP 2610). The extract carries no altitudes; the
  VNAV altitudes come from the charts (maintainer, 2026-11-22): propeller and turboprop aircraft cross RADDY at
  10,000 ft on CHINS FIVE (11,000 ft is for turbojets), and the approach has COVOG at or above 6,000 ft. The unit
  reads no altitudes, so the chart wins over any data.

## For the maintainer's flight in the simulator

To check in the cockpit before the tutorial is published (researcher, writer and reviewer, 2026-11-22):

1. Entering TITON, CADED or CHINS in FPL 0 brings up neither the Duplicate Waypoint page nor the waypoint type
   identification page.
2. KYKM has one APT 7 page with GROMO4, WENAS7 and YKM7; YKM7 and CHINS5 ask no runway.
3. After takeoff, with NAV 1 on the right, the Direct To button offers YKM; YKM's VOR page shows 21°E.
4. The GPS CRS (LEG/OBS) switch to OBS with the indicator on 284 gives `ENR:284` and centers the needle on the
   radial near YKM; MOD 2 showed `PRESS GPS` `CRS FOR` before. Back to LEG, `ADJ NAV IND CRS TO 290°` comes.
5. Answered (2026-11-22): the simulator's YKM7 (AIRAC 2611) codes no hold, so no `IF REQUIRED SELECT OBS` comes at
   TITON. Check that none comes.
6. In OBS mode at TITON (switch to OBS before TITON), 290° centers the needle on the inbound course; in the hold the
   TO/FROM indicator shows FROM from TITON until abeam TITON again in the turn, and TO on the outbound and inbound
   legs; the turns as the chart shows them. Leaving the hold with the switch to LEG
   and TITON ahead, the unit goes direct to TITON and then on to CADED.
7. Past CHINS `MSA` and `ESA` read 16,300 ft, and `MSA` drops to 9,900 ft near 47°N.
8. Super NAV 5: after North up, two steps of the right inner knob give actual track up; range 30 shows the map as the
   screen does.
9. The EFB after `REQUEST FROM AVIONICS` names runway 09 and 14L (no bug, kln90b#409).
10. Done (2026-11-22): the table names AIRAC 2611 and the text names L-13.
11. VNAV, 12 NM past CHINS at 10,000 ft: NAV 4 takes COVOG (its INT page comes for approval), the angle field first
    shows about -0.9° with VNAV active, and 3.0 entered gives `VNV ARMED`; the countdown starts later, and VNAV
    becomes active about 12 NM past RADDY, about 2 NM before HUMPP.
12. On the charts of 2611: RNAV (GPS) Y RWY 32L has COVOG at or above 6,000 ft.

## Notes from other packages

None open; the note of the package failures (the EFB and the failed output) is used.

## Changes to earlier pages

None planned.
