# Final pass

The plan file of the final pass (`docs/coordinator-prompt.md`, "The final pass"). The whole manual is read in parts,
because no agent can hold all of it. This file says which parts there are, how far each one is, and what is still
open, so that a later session can continue. The notes that the packages left are in `docs/manual-plan.md`, "For the
final pass"; a note is deleted there when the final pass has applied it.

## Steps

| Step | What | Status |
| --- | --- | --- |
| 1 | Mechanical check over everything: the build, links and anchors, planned anchors, `<Term>` use, unused glossary entries and screens, old word forms, numbers said twice | done 2026-11-23 |
| 2 | One reader per part (below) | done 2026-11-23 |
| 3 | Across chapters: the statements the readers passed on, the links between Operation and the page reference, the late corrections | done 2026-11-23 |
| 4 | Fixes by writers per page, with a review of the changes only | done 2026-11-23; in review with the maintainer |

## Parts of step 2

Each reader reads its pages and the field explanations of the screen folders named, under the writer's rules.

| Part | Pages | Screen folders | Status |
| --- | --- | --- | --- |
| Getting started | home page, Installation, Quickstart, Tutorial flight 1, Tutorial flight 2 | `tutorial-1`, `tutorial-2` | read, fixed, changes reviewed |
| The unit and Help | Controls and display, Keyboard mode, Power-on and initialization; External hardware, FAQ and troubleshooting, Known limitations, Contact | `display`, `power-on` | read, fixed, changes reviewed |
| Operation A | Waypoints and the database, User waypoints, Nearest, Direct-to, Flight plans | `waypoint`, `nearest`, `direct-to`, `flight-plans` | read, fixed, changes reviewed |
| Operation B | Modes of operation, Sequencing and turn anticipation, SID and STAR procedures, DME arcs, Non-precision approaches | `navigation`, `sequencing`, `sid-star`, `dme-arcs`, `approaches` | read, fixed, changes reviewed |
| Operation C and the lists | VNAV, Airspace and altitude alerting, Trip planning and calculators, Messages; Message page messages, Status line messages, Glossary | `vnav`, `alerts`, `trip-planning`, `messages` | read, fixed, changes reviewed |
| Operation D | GPS reception and RAIM, Inside the GPS simulation, Simulated failures; STA and FLR chapters | `gps`, `failures`, `pages/sta`, `pages/flr` | read, fixed, changes reviewed |
| Page reference, left 1 | TRI, CAL, SET, OTH | `pages/tri`, `pages/cal`, `pages/set`, `pages/oth` | read, fixed, changes reviewed |
| Page reference, left 2 | MOD, FPL, NAV | `pages/mod`, `pages/fpl`, `pages/nav` | read, fixed, changes reviewed |
| Page reference, right | CTR, REF, ACT, D/T, APT, VOR, NDB, INT, SUP | the folders of these page types under `pages/` | read, fixed, changes reviewed |

## Decisions of the coordinator (2026-11-23)

The writers of step 4 follow these; they settle what the readers left open.

- **Glossary:** the entries `GS`, `BRG`, `ETE`, `ETA` and `BARO` are removed (style guide, section 14: an
  abbreviation every pilot reads at once, and the baro setting is a concept with an owner section). Their `<Term>`s
  are unwrapped everywhere.
- **The 2 kt of ETE and ETA** has one owner, the D/T chapter, `#dashes-and-blank-rows`; other places say "while the
  aircraft barely moves" and link there. The 2 kt of the actual track is another feature and is owned by the NAV
  chapter.
- **The GPS CRS switch first** wherever the course mode changes; the term stays; "often labeled LEG/OBS" once, on
  Modes of operation. The task is at `#selecting-leg-or-obs-mode`, the case without a switch at
  `#without-a-gps-crs-switch`; `#with-the-gps-crs-switch-of-the-aircraft` is gone.
- **Renamed anchors:** `#the-cdi-scale-factor-along-the-approach` (Non-precision approaches),
  `#apt-5-airport-remarks` (APT chapter).
- **Symbols in words** in every field explanation and text (style guide, section 12).
- **The message prompt** in a field explanation says whether it flashes (a message unread) or is steady.
- **The system time zone** is named so wherever it shows, with the link to Trip planning, `#the-time-zone`, which
  alone lists the zones.
- **Power-on against Direct-to:** the code backs Direct-to; Power-on is corrected. An active en route leg of FPL 0
  stays active over any time off; only a direct-to and a leg of a procedure are dropped after five minutes.
- **Drawings:** Flight plans shows the drawings of the REF and CTR chapters; those keep theirs.

## Open

For the maintainer; not changed in this pass:

- "Outside air temperature" on the CAL pages: the word list rules it out for OTH 10 (static air temperature), and
  the reader of the CAL chapter asks whether CAL 1's `TEMP` should carry the same term.
- The home page's heading "KLN 90B Simulator Manual" is in title case; the style guide asks for sentence case.
- The warm-up durations on Power-on and initialization (the dark screen, the brightening, the time off that
  shortens them): which of them are measured on the real unit and get a range with "about", and which are the
  simulation's choice and become "a few seconds" (style guide, section 8).
- The message lists repeat thresholds of their owner sections (seconds, miles, degrees). Section 8 says a number
  once at its owner; the lists own the meaning of a message. Only the entries a finding named were changed.
- Tutorial flight 2 names the CDI scale factors where the pilot sees them, and has its box on the missing vertical
  guidance at the activation of the approach, not where the approach arms.
- "Airport reference point" in the fields of the APT nearest list.
- The manual says "set the GPS CRS switch to OBS, to LEG". A reviewer names "press" as the action on the real
  installation's switch; the maintainer decides the verb, and with it the word list entry.
- The field `use` (`USE? INVRT?`) has the new wording "Questions to activate the plan" on `flight-plans/ctr-computed`
  and `pages/ctr/ctr-1-prompt`; the screens `flight-plans/created`, `ctr-complete`, `insert-entry`, `ref-approve`
  and `take-right-approve` keep the older one.
- The `sidebar.order` of Operation has a gap at 16 and DME arcs at 8.5; it sorts right and was left.
- One bug candidate waits for the maintainer's permission to be filed: a unit that never navigated stores an
  almanac time of zero, which the age check takes for current almanac data for simulator dates around the third
  GPS week rollover (about May 2028 to May 2029), so the unit skips the long search (`GpsSearch.ts`,
  `KLN90BUserSettings.ts`). If it is filed, the paragraph on the never-used unit in GPS reception and RAIM,
  "Acquiring satellites", gets the `kln90b#NN` comment.

## How the pass was run (2026-11-23)

- The readers, the cross-chapter check and the reviewers could not write their findings files: the harness lets a
  subagent write scripts and repository files, but refuses a report file. Their findings came back as their final
  message, and the coordinator saved them to the scratchpad with a script that reads the session transcript. A
  later session tells its agents to return findings as text from the start.
- The review of the changes had one round, by three reviewers; one writer applied its findings. There was no
  second round: the build passes and no link or anchor is dead, and the maintainer's review is the next check.
