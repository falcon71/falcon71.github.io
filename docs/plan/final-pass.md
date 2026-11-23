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
| 4 | Fixes by writers per page, with a review of the changes only | writers started 2026-11-23, one per part below |

## Parts of step 2

Each reader reads its pages and the field explanations of the screen folders named, under the writer's rules.

| Part | Pages | Screen folders | Status |
| --- | --- | --- | --- |
| Getting started | home page, Installation, Quickstart, Tutorial flight 1, Tutorial flight 2 | `tutorial-1`, `tutorial-2` | read; fixes with a writer |
| The unit and Help | Controls and display, Keyboard mode, Power-on and initialization; External hardware, FAQ and troubleshooting, Known limitations, Contact | `display`, `power-on` | read; fixes with a writer |
| Operation A | Waypoints and the database, User waypoints, Nearest, Direct-to, Flight plans | `waypoint`, `nearest`, `direct-to`, `flight-plans` | read; fixes with a writer |
| Operation B | Modes of operation, Sequencing and turn anticipation, SID and STAR procedures, DME arcs, Non-precision approaches | `navigation`, `sequencing`, `sid-star`, `dme-arcs`, `approaches` | read; fixes with a writer |
| Operation C and the lists | VNAV, Airspace and altitude alerting, Trip planning and calculators, Messages; Message page messages, Status line messages, Glossary | `vnav`, `alerts`, `trip-planning`, `messages` | read; fixes with a writer |
| Operation D | GPS reception and RAIM, Inside the GPS simulation, Simulated failures; STA and FLR chapters | `gps`, `failures`, `pages/sta`, `pages/flr` | read; fixes with a writer |
| Page reference, left 1 | TRI, CAL, SET, OTH | `pages/tri`, `pages/cal`, `pages/set`, `pages/oth` | read; fixes with a writer |
| Page reference, left 2 | MOD, FPL, NAV | `pages/mod`, `pages/fpl`, `pages/nav` | read; fixes with a writer |
| Page reference, right | CTR, REF, ACT, D/T, APT, VOR, NDB, INT, SUP | the folders of these page types under `pages/` | read; fixes with a writer |

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
