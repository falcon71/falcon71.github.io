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
| 4 | Fixes by writers per page, with a review of the changes only | done 2026-11-23; approved by the maintainer |

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

The maintainer answered the open questions on 2026-11-23, and the answers are applied:

- kln90b#533 is filed (a unit without almanac data skips the almanac search for dates around November 2028); the
  paragraph on the never-used unit in GPS reception and RAIM carries the comment.
- The temperature of CAL 1 is the static air temperature (word list). CAL 2 takes the total air temperature, as the
  code has it.
- The GPS CRS switch is pressed (word list); no text names a switch position any more.
- The dark screen after power-on takes "about 5 to 7 seconds"; the brightening and the shorter warm-up after a
  brief time off have no numbers.
- The title case of the home page's heading stays (style guide, section 12). The thresholds in the message lists,
  the place of the box on the missing vertical guidance in Tutorial flight 2 and the other points stay as they are.

Left as it is: the field `use` (`USE? INVRT?`) has two wordings across the screens under `flight-plans/` and
`pages/ctr/`; the `sidebar.order` of Operation has a gap at 16 and DME arcs at 8.5.

## How the pass was run (2026-11-23)

- The readers, the cross-chapter check and the reviewers could not write their findings files: the harness lets a
  subagent write scripts and repository files, but refuses a report file. Their findings came back as their final
  message, and the coordinator saved them to the scratchpad with a script that reads the session transcript. A
  later session tells its agents to return findings as text from the start.
- The review of the changes had one round, by three reviewers; one writer applied its findings. There was no
  second round: the build passes and no link or anchor is dead, and the maintainer's review is the next check.
