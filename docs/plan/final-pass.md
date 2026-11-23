# Final pass

The plan file of the final pass (`docs/coordinator-prompt.md`, "The final pass"). The whole manual is read in parts,
because no agent can hold all of it. This file says which parts there are, how far each one is, and what is still
open, so that a later session can continue. The notes that the packages left are in `docs/manual-plan.md`, "For the
final pass"; a note is deleted there when the final pass has applied it.

## Steps

| Step | What | Status |
| --- | --- | --- |
| 1 | Mechanical check over everything: the build, links and anchors, planned anchors, `<Term>` use, unused glossary entries and screens, old word forms, numbers said twice | started 2026-11-23 |
| 2 | One reader per part (below) | started 2026-11-23 |
| 3 | Across chapters: the statements the readers passed on, the links between Operation and the page reference, the late corrections | not started |
| 4 | Fixes by writers per page, with a review of the changes only | not started |

## Parts of step 2

Each reader reads its pages and the field explanations of the screen folders named, under the writer's rules.

| Part | Pages | Screen folders | Status |
| --- | --- | --- | --- |
| Getting started | home page, Installation, Quickstart, Tutorial flight 1, Tutorial flight 2 | `tutorial-1`, `tutorial-2` | reading |
| The unit and Help | Controls and display, Keyboard mode, Power-on and initialization; External hardware, FAQ and troubleshooting, Known limitations, Contact | `display`, `power-on` | reading |
| Operation A | Waypoints and the database, User waypoints, Nearest, Direct-to, Flight plans | `waypoint`, `nearest`, `direct-to`, `flight-plans` | reading |
| Operation B | Modes of operation, Sequencing and turn anticipation, SID and STAR procedures, DME arcs, Non-precision approaches | `navigation`, `sequencing`, `sid-star`, `dme-arcs`, `approaches` | reading |
| Operation C and the lists | VNAV, Airspace and altitude alerting, Trip planning and calculators, Messages; Message page messages, Status line messages, Glossary | `vnav`, `alerts`, `trip-planning`, `messages` | reading |
| Operation D | GPS reception and RAIM, Inside the GPS simulation, Simulated failures; STA and FLR chapters | `gps`, `failures`, `pages/sta`, `pages/flr` | reading |
| Page reference, left 1 | TRI, CAL, SET, OTH | `pages/tri`, `pages/cal`, `pages/set`, `pages/oth` | reading |
| Page reference, left 2 | MOD, FPL, NAV | `pages/mod`, `pages/fpl`, `pages/nav` | reading |
| Page reference, right | CTR, REF, ACT, D/T, APT, VOR, NDB, INT, SUP | the folders of these page types under `pages/` | reading |

## Open

Nothing yet.
