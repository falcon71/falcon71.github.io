# Package: tutorial-2-approach (Tutorial flight 2, from the top of descent)

Split from the package tutorial-2 on 2026-11-22 (`docs/plan/tutorial-2.md`, "Split"). It writes the second half of
the same page, `getting-started/tutorial-2.mdx`, after the section En route that tutorial-2 ends with near RADDY.
Requirements: style guide, sections 10 and 17 ("Tutorial flights"). The page runs on Opus.

## Sections as written (2026-11-22)

The package worked on the branch `manual-tutorial-2`, which stayed open from the package tutorial-2 (maintainer,
2026-11-22). Anchors under `/kln90b/getting-started/tutorial-2/`:

1. **The descent and the arrival** (`#the-descent-and-the-arrival`): the NAV 4 countdown (`VNV IN`), `VNV ALERT` in a
   sentence with the link; about 2 NM before HUMPP the descent point and the 30 NM arming point fall together: VNAV
   active, `ARM-LEG` and with the arming `PRESS ALT TO SET BARO` (not where an air data system supplies the baro
   setting); "To check the baro setting" on the ALT page; the CDI scale factor to ±1.00 NM; VNAV ends at COVOG; the
   course message before AUBRN (311°) and perhaps before DUANE (316°), unless the unit sets the indicator's course
   itself.
2. **The approach** (`#the-approach`): activation 2 NM before DUANE (`APR-LEG`, ±0.30 NM, the pilot watches MOD 1 on
   the left), `ARM-LEG` at DUANE means fly the missed approach; past the threshold RW32L stays active, FROM, the fence;
   "To fly the missed approach instead" (Direct To, FEVAS, `ARM-LEG`, the baro message again) and "To hold at LOFAL"
   (`IF REQUIRED SELECT OBS`, the GPS CRS switch first, MOD 2 and MOD 1 with ENT for aircraft without one), with the
   kln90b#513 comments.
3. **A visual approach without approaches on the unit** (`#a-visual-approach-without-approaches-on-the-unit`): FPL 0
   as the section Deleting the waypoints shows it; `ENR-LEG` and ±5 NM throughout; VNAV planned to KBFI at 700 ft MSL
   (the pattern altitude of runway 32L from the FAA's KBFI pilot page, maintainer, 2026-11-22) with an offset of 3 NM;
   the course message of 313° at AUBRN; the VFR procedures from the Chart Supplement and the KBFI pilot page, no steps
   of our own.
4. **Where to go next** (`#where-to-go-next`).

The sentence of En route about a unit without an approach points to section 3. The course message in The departure
(290°) got the same correction as the new sections ("Unless the unit sets the course of your indicator itself").

## Screens

All staged, under `kln90b/screens/tutorial-2/`: `nav-4-vnav-countdown`, `nav-4-vnav-arm`, `alt-baro`, `nav-1-apr`
(MOD 1 and NAV 1, because a half screen cannot show `APR-LEG`), `nav-1-past-threshold`, `direct-to-fevas`,
`nav-4-vnav-kbfi`. The flight steps beyond 12 NM past CHINS are helpers in `kln90b/screens/shared/tut2.ts`
(`flyPastChins`, `vnavCountdown`, `vnavActiveAndArmed`, `altPageBeforeHumpp`, `approachActive`, `pastThreshold`, and
for a unit without approaches `tut2NoApproachBoot`, `CLEANED_UP_NO_APPROACH`, `vnavToKbfi`).

## For the maintainer's flight in the simulator

To check in the cockpit before the tutorial is published (researcher, writer and reviewer, 2026-11-22), in addition to
the list in `docs/plan/tutorial-2.md`:

1. NAV 4 shows `VNV IN` and a countdown before RADDY; VNAV becomes active about 2 NM before HUMPP, at the same moment
   as `ARM-LEG` and `PRESS ALT TO SET BARO` (the order of the two may differ by a fraction of a mile).
2. `ADJ NAV IND CRS TO 311°` comes before AUBRN; before DUANE the 316° message came in one staging and not in another.
3. VNAV ends at COVOG; the approach becomes active about 2 NM before DUANE with `CDI:±0.30NM` on MOD 1.
4. Past the threshold RW32L stays active with FROM; Direct To offers FEVAS; `IF REQUIRED SELECT OBS` comes about
   3.5 NM before LOFAL; OBS gives `ARM:315`.
5. Without approaches: VNAV to KBFI at 700 ft with offset 3 NM starts about 4 NM before HUMPP and ends 3 NM before
   KBFI; `ADJ NAV IND CRS TO 313°` at AUBRN.
6. The FAA's KBFI pilot page gives 700 ft MSL as the pattern altitude of runway 32L (the reviewer could not open it).

## Notes from other packages

None open; the research notes of the package tutorial-2 and its review are used.

## Changes to earlier pages

None.
