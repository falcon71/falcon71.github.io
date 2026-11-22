# Package: tutorial-2-approach (Tutorial flight 2, from the top of descent)

Split from the package tutorial-2 on 2026-11-22 (`docs/plan/tutorial-2.md`, "Split"). It writes the second half of
the same page, `getting-started/tutorial-2.mdx`, after the section En route that tutorial-2 ends with near RADDY.
Requirements: style guide, sections 10 and 17 ("Tutorial flights"). The page runs on Opus.

## Planned sections

Anchors under `/kln90b/getting-started/tutorial-2/`:

1. **The descent and the arrival** (`#the-descent-and-the-arrival`): from about RADDY, the STAR flown in leg mode;
   the procedure headers are no waypoints; waypoint alerting and the small turns; the course messages at AUBRN and
   DUANE.
2. **The approach** (`#the-approach`): arming at 30 NM, `PRESS ALT TO SET BARO`, the ARM annunciator, activation
   before DUANE, the CDI scale, the final to RW32L, the fence; the missed approach in a few sentences with the link.
3. **A visual approach without approaches on the unit** (`#a-visual-approach-without-approaches-on-the-unit`): the
   flight plan of such a unit and flying to KBFI from AUBRN.
4. **Where to go next** (`#where-to-go-next`).

## Screens

Ids under `kln90b/screens/tutorial-2/`. The researcher of tutorial-2 staged all of these: arming about 2 NM before
HUMPP (with the message and after it), active about 1.4 NM before DUANE, NAV 1 on the final; optionally FPL 0 of a
unit without approaches.

## Research notes from the package tutorial-2 (researcher, 2026-11-22)

Facts from the code and the generator at the kln90b pin of 2026-11-22 and CIFP 2610, with the owning sections. A
researcher of this package checks them again; they are a starting point, not a source to copy.

### 4. En route and the arrival

Staged flight along FPL 0 at 120 kt, stepping past each fix (leg mode):

- **Sequencing:** TITON → CADED → CHINS → RADDY → HUMPP → COVOG → AUBRN → DUANE, all automatically, no messages except where the course changes more than 5° and the indicator is off (`ADJ NAV IND CRS TO nnn°`, e.g. 310° at AUBRN, 316° at DUANE; answered on the CDI). Waypoint alerting (arrow flashes) before each fix. Turn anticipation: the turns are tiny (290→289→310→316); at YKM the turn is the big one (074 → 290) if flown in leg mode. Owners: [Waypoint alerting](/kln90b/operation/sequencing/#waypoint-alerting), [Turn anticipation](/kln90b/operation/sequencing/#turn-anticipation), [Fly-over waypoints](/kln90b/operation/sequencing/#fly-over-waypoints).
- **The procedure headers:** nothing happens at `CHINS5-STAR` or `R32L-KBFI`; they are no waypoints. Sequencing runs from `4:CADED` straight to `5.CHINS` and from `6.RADDY` to `7 HUMPP-I` ([The procedure in FPL 0](/kln90b/operation/departures-arrivals/#the-procedure-in-fpl-0), [Procedure headers](/kln90b/pages/fpl/#procedure-headers)).
- **NAV 3 MSA / ESA along the route** (1°×1° sectors, [Minimum safe altitudes](/kln90b/pages/nav/#minimum-safe-altitudes), `services/MSA.ts:48`, `:111`):

  | Where | MSA | ESA |
  | --- | --- | --- |
  | KYKM to CHINS (sector 46-47°N, 120-121°W) | 8,100 ft | 16,300 ft |
  | CHINS + ~3 NM to CHINS + ~18 NM (46-47°N, 121-122°W, the sector of Mount Rainier) | **16,300 ft** | 16,300 ft |
  | CHINS + ~19 NM (47°N) to COVOG | 9,900 ft | 9,900 ft |
  | COVOG (122°W) to KBFI | 5,400 ft | 5,400 ft |

  The screen to show: **12.5 NM past CHINS toward RADDY**: NAV 3 `CHINS›RADDY`, `DTK 290°`, `TK 290°`, `FLY L0.00nm`, `MSA 16300ft`, `ESA 16300ft`; NAV 1 `DIS 15.5nm`, `GS 120kt`, `ETE :08`. Teaching point: the sector value (16,300 ft, Rainier) is far above the 10,000 ft the arrival needs; MSA is a coarse grid value, not the MEA.
- **NAV 5 in actual track up:** left CRSR (cursor on the range, `40`), left outer one step counterclockwise (orientation), left inner clockwise: `N^` → `DTK^` → `TK^` (two steps; a third returns to `N^` in this installation without heading input). The field then shows the track, `290°`. Owner: [The map orientation](/kln90b/pages/nav/#the-map-orientation).
- **Super NAV 5 has its own orientation setting** (`superNav5MapOrientation`, `settings/KLN90BUserSettings.ts:87`; `pages/left/SuperNav5Page.tsx:49`): setting NAV 5 to TK^ does not turn Super NAV 5. On Super NAV 5: right CRSR opens the menu (`VOR:OFF`, `NDB:OFF`, `APT:OFF`, ` 000° N^`), right outer knob three steps to the orientation row, right inner two steps: `290°Ó^` (DTK^), then `290°Ö^` (TK^). Range scales with the left CRSR and left inner: 20, 30, 40 (default), 60. Owner: [The pop-up menu](/kln90b/pages/nav/#the-pop-up-menu), [The range scale and AUTO](/kln90b/pages/nav/#the-range-scale-and-auto).

---
### 5. The approach

Staged along RADDY → HUMPP → COVOG → AUBRN → DUANE (owner throughout: [Non-precision approaches](/kln90b/operation/approaches/)):

- **Arming:** at 30 NM straight-line from the KBFI reference point (`services/ModeController.ts:506-518`, 30 NM at `:514`), which on this route is **about 2.3 NM before HUMPP** on the leg from RADDY (33.7 NM from KBFI at RADDY+8.5: still `ENR-LEG`; 29.7 NM at RADDY+12.5: `ARM-LEG`). `MSG` flashes: **`PRESS ALT TO SET BARO`**. MOD 1 shows `CDI:±1.00NM` at once (the scale ramps from 5 to 1 over 30 s, `ModeController.ts:520-529`). ALT: the ALT page (`BARO:29.92"`, `ALERT: OFF`), ALT again, message gone. Owners: [Arming the approach](/kln90b/operation/approaches/#arming-the-approach), [`PRESS ALT TO SET BARO`](/kln90b/operation/approaches/#press-alt-to-set-baro), [The baro setting](/kln90b/operation/alerts/#the-baro-setting). The ARM annunciator of the GPS APR switch lights.
- **Activation:** FAF DUANE active, within 2 NM, MAP ahead, track within 110°, RAIM (`ModeController.ts:550-596`; 2 NM at `:569`, 110° at `:583`, RAIM check `:604`). Staged: at 3.4 NM before DUANE still `ARM-LEG`, at 1.4 NM `APR-LEG`. MOD 1 `CDI:±0.30NM` at once (the scale itself narrows to 0.30 at the FAF, `ModeController.ts:531-548`). ACTV annunciator. Owners: [Activating the approach](/kln90b/operation/approaches/#activating-the-approach), [The CDI scale along the approach](/kln90b/operation/approaches/#the-cdi-scale-along-the-approach).
- **RAIM:** nothing went wrong in the default simulation; owner [RAIM in an approach](/kln90b/operation/approaches/#raim-in-an-approach); prediction on STA 5 before the flight: [Predicting RAIM](/kln90b/operation/gps-receiver/#predicting-raim).
- **Final:** past DUANE `DUANE›RW32L`, DIS 4.6 at 0.5 NM past, `APR-LEG`, `CDI:±0.30NM`. At 5.5 NM past DUANE (past the threshold): RW32L stays active, FROM, `BRG 137°`, no sequencing (fence). Owner: [The missed approach](/kln90b/operation/approaches/#the-missed-approach) (the MAHP LOFAL asks OBS, the missed approach with D→ FEVAS).
- **NAV 1 / status line by stage:** ENR-LEG to 30 NM; ARM-LEG (msg for the baro) to ~1.4-2 NM before DUANE; APR-LEG to the runway. [NAV 1 in the approach modes](/kln90b/pages/nav/#nav-1-in-the-approach-modes), [The mode annunciations](/kln90b/operation/modes-of-operation/#the-mode-annunciations).
- **Without an approach-certified installation** (no GPS APR switch): no APT 8; from APT 1 the right inner knob runs APT 2 … APT 7 and wraps (staged). The pilot loads YKM7 and CHINS5 (YKM) all the same and deletes `7.YKM`, `6:CHINS`, `4:TITON` only. Final FPL 0, 9 waypoints: `1:KYKM`, `YKM7-SID` `2.YKM` `3.TITON`, `4:CADED`, `CHINS5-STAR` `5.CHINS` `6.RADDY` `7.HUMPP` `8.AUBRN`, `9:KBFI`; D/T 3: CHINS 30, RADDY 58, HUMPP 72, AUBRN 89, **KBFI 101 NM**, DTK to KBFI 313°. AUBRN is a fly-over waypoint (no turn anticipation). The unit stays in ENR-LEG with ±5.00 NM to the airport; the pilot flies a visual approach from AUBRN. Owner of the availability: the Callout in [Non-precision approaches](/kln90b/operation/approaches/) and [APT 8: approaches](/kln90b/pages/apt/#apt-8-approaches).

---
**Final FPL 0 (staged and verified), 15 waypoints, 19 rows:**

| Row | Text on FPL 0 | Cumulative DIS (D/T 3) | DTK (D/T 3) |
| --- | --- | --- | --- |
| 1 | `1:KYKM` | | |
| | `YKM7-SID` | | |
| 2 | `2.YKM` | 4 | 074° |
| 3 | `3.TITON` | 19 | 291° |
| 4 | `4:CADED` | 21 | 290° |
| | `CHINS5-STAR` | | |
| 5 | `5.CHINS` | 30 | 290° |
| 6 | `6.RADDY` | 58 | 290° |
| | `R32L-KBFI` | | |
| 7 | `7 HUMPP-I` | 72 | 289° |
| 8 | `8 COVOG` | 82 | 289° |
| 9 | `9 AUBRN` | 89 | 289° |
| 10 | `10 DUANE-F` | 94 | 310° |
| 11 | `11 RW32L-M` | 100 | 316° |
| | `*NO WPT SEQ` | | |
| 12 | `12 FEVAS` | 104 | 315° |
| 13 | `13 GRRAM` | 114 | 295° |
| 14 | `14 LOFAL-H` | 126 | 314° |
| 15 | `15:KBFI` | 150 | 126° |

Note for the writer: D/T 1 and D/T 3 count the missed approach to KBFI (150 NM); the distance to fly is to RW32L, 100 NM. While the MAP lies ahead the unit takes RW32L as the destination: D/T 4 shows `RW32L` at the top, and D/T 1 beside a non-FPL page shows `11 RW32L` as the destination ([The approach in FPL 0](/kln90b/operation/approaches/#the-approach-in-fpl-0), [D/T pages](/kln90b/pages/dt/)).

## Notes from other packages

### From the review of tutorial-2 (2026-11-22)

- Bug candidate for this half, not yet filed: in OBS mode the unit measures the selected course with the published
  variation only when the active waypoint is a VOR (`ModeController.getMagvarForObs`, `KLNMagvar.getReferenceMagvar`);
  an approach waypoint gets the variation at its position. The reviewer holds that an approach waypoint should be
  treated like a VOR. It matters if this half has the pilot use OBS at an approach waypoint (the MAHP LOFAL asks for
  OBS). kln90b#371 (closed) asked which variation the unit uses for a waypoint that is not a VOR; read it before
  filing, since this may continue it.
- The EFB step of the first half carries the runway bug (`REQUEST FROM AVIONICS` sends runway 09 and 14L); see the
  first half's paragraph for its `kln90b#` comment.

## Changes to earlier pages

None planned.
