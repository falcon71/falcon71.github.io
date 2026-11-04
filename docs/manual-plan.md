# Manual plan

The coordinator's working structure of the KLN 90B manual (`docs/coordinator-prompt.md`, "The plan file"). It holds
no fact and no text from a real manual. **Dry run of 2026-11-04:** only the APT chapter of the page reference is
planned and written, so that the maintainer can judge prose, length, detail and screens before the full run. The full
run replaces this file with the plan of the whole manual; the APT part below is meant to carry over.

## Outline

Chapter order and page list: style guide, section 17. Page slugs used in links (planned; pages that do not exist yet
are linked by these paths already, so that the links work once they are written):

| Chapter | Slug |
| --- | --- |
| The unit | `unit/controls-and-display`, `unit/keyboard-mode`, `unit/power-on` |
| Operation | `operation/waypoints`, `operation/nearest`, `operation/direct-to`, `operation/flight-plans`, `operation/navigation-modes`, `operation/sequencing`, `operation/departures-arrivals`, `operation/approaches`, `operation/vnav`, `operation/messages`, `operation/alerts`, `operation/trip-planning`, `operation/fuel-air-data` |
| Page reference | `pages/tri`, `pages/mod`, `pages/fpl`, `pages/nav`, `pages/cal`, `pages/sta`, `pages/set`, `pages/oth`, `pages/ctr`, `pages/ref`, `pages/act`, `pages/dt`, `pages/apt`, `pages/vor`, `pages/ndb`, `pages/int`, `pages/sup` |
| Reference lists | `lists/messages`, `lists/status-line-messages`, `lists/glossary` |

### Page reference: APT pages (`pages/apt.mdx`)

Summary: what the APT pages are (the airport waypoint pages, eight pages about one airport), how the airport is chosen
and shared by all of them.

1. **The APT pages as a group:** the shared airport identifier, the header line (identifier, `nr n`), entering an
   identifier on any APT page, the subpages (`APT+3`, `APT+4`, `APT+7`), scanning with the right inner knob pulled out,
   an identifier the database does not know (the offer to create a user airport, in one paragraph with a link),
   the nearest-airport variant of the header, the ACT page and the waypoint confirmation showing the same pages.
2. **APT 1: name, position and airspace.** Database airport; cursor on the identifier; nearest variant (runway,
   lighting, bearing, distance; the cursor parked on `nr n`); user airport.
3. **APT 2: city, elevation, time zone and approach type.** Database airport; user airport (elevation entry).
4. **APT 3: runways.** The diagram; the list pages (codes for surface and lighting); user airport (one runway).
5. **APT 4: communication frequencies.** The frequency type labels; several pages; no data.
6. **APT 5: remarks.** Entering, limits, where they are deleted (OTH 4, link).
7. **APT 6: services.** What the simulator cannot supply.
8. **APT 7: departures and arrivals.** The lists; the selection flow for a SID and for a STAR (runway, transition,
   when a step is skipped); the waypoint list and `LOAD IN FPL`; the add-airport question; the replace question; no
   procedure; what the loader drops (legs without a fix, holds); the two rules of section 17 of the style guide.
9. **APT 8: approaches.** Availability box; the list; approach names; the IAF list; the waypoint list; the questions;
   no approach; what is not offered (RF legs, RNP AR, ILS/LOC); the two rules.
10. Links on: Waypoints and the database, Nearest, Direct-to, Flight plans, Departures and arrivals, Non-precision
    approaches.

## Topic ownership

The page that explains a topic, and the pages that only link to it. For the dry run only the topics the APT chapter
touches are listed.

| Topic | Owner | Links only |
| --- | --- | --- |
| The cursor, entering characters with the knobs, the scan (right inner knob pulled out) | Controls and display | APT chapter (one sentence each, link) |
| Waypoint pages in general: the five kinds, how an identifier is entered, the ACT page and the waypoint confirmation | Waypoints and the database (Operation) | APT chapter says what is special to airports and links (one sentence for the general operation; maintainer's feedback of 2026-11-04, style guide section 10) |
| Creating a user waypoint (`CREATE NEW WPT AT`, user or present position, the 250 limit, `USR DB FULL`); user waypoints as a concept, linked as `/kln90b/operation/waypoints/#user-waypoints` | Waypoints and the database | APT chapter shows the offer once, names the user-airport fields on APT 1 to APT 3, links |
| The nearest lists: criteria (SET 3), radius, count, how they are reached, the MSG + ENT shortcut; the nearest list as a concept, linked as `/kln90b/operation/nearest/` | Nearest (Operation) | APT chapter explains the nearest *variant of the pages* (header `nr n`, the fields that change on APT 1, the cursor parked on `nr n`) and links for the rest |
| The active waypoint and the active leg, linked as `/kln90b/operation/navigation-modes/#the-active-waypoint` | Navigation modes (Operation) | every page that names the active waypoint links at its first use (no glossary entry, style guide section 14) |
| Waypoint alerting, linked as `/kln90b/operation/sequencing/#waypoint-alerting`; turn anticipation | Sequencing and turn anticipation (Operation) | every page that names them links at its first use (no glossary entry) |
| What a loaded procedure does in FPL 0: where it is inserted, headers and markers, `CHANGE`/`DELETE` on a header, editing procedure waypoints, the make-room question, the 30/45 limits | Flight plans (Operation), with Departures and arrivals and Non-precision approaches | APT 7 and APT 8 say in one sentence where the procedure goes and link |
| Approach arming and activation, `PRESS ALT TO SET BARO`, the CDI scale | Non-precision approaches | APT 8 links |
| Remarks: deleting on OTH 4 | OTH chapter | APT 5 links |
| Message texts and what to do | Message page messages / Status line messages (lists) | APT chapter quotes the text at the place it is raised and links |
| The two rules (a transition must be selected; an approach starts only at an IAF) | Departures and arrivals, Non-precision approaches (Operation); FAQ | APT 7 and APT 8 state them plainly too (style guide, section 17) |

## Screens

All generated from the FAA extract around Seattle. The tutorial screens (`tut2-apt-*`) stay the tutorial's; the page
reference has its own ids. Status per screen: planned, generated, done.

| Id | Page and state | Shown on |
| --- | --- | --- |
| `apt-1-ksea` | APT 1, KSEA, database airport, cursor off (existing; field explanations rewritten) | APT 1 |
| `apt-1-ksea-cursor` | APT 1, KSEA, cursor on the identifier | APT 1 |
| `apt-1-nearest` | APT 1, a nearest entry (`nr n`, longest runway, bearing and distance), aircraft 10 NM from KSEA | APT 1 |
| `apt-1-user-airport` | APT 1, a user airport created at the present position | APT 1 |
| `apt-1-user-pos` | APT 1, entering the position of a new user airport (`USER POS?`), the latitude entered | APT group |
| `apt-1-nearest-cursor` | APT 1, nearest entry with the cursor parked on `nr n` | APT 1 |
| `apt-create-new-wpt` | The offer `CREATE NEW WPT AT` after an unknown identifier | APT group |
| `apt-2-ksea` | APT 2, KSEA, with the time zone answered | APT 2 |
| `apt-2-user-airport` | APT 2 of a user airport with the elevation entered | APT 2 |
| `apt-3-diagram-kpdx` | APT 3 runway diagram of KPDX (map) | APT 3 |
| `apt-3-list-ksea` | APT 3 first list page of KSEA (`APT+3`) | APT 3 |
| `apt-3-user-airport` | APT 3 of a user airport with a runway entered | APT 3 |
| `apt-4-kykm` | APT 4 first page of KYKM (`APT+4`) | APT 4 |
| `apt-4-no-data` | APT 4 with `COMM FREQ DATA NOT AVAILABLE` (a user airport) | APT 4 |
| `apt-5-ktiw` | APT 5 of KTIW with a remark entered | APT 5 |
| `apt-6-ksea` | APT 6 of KSEA | APT 6 |
| `apt-7-sids-ksea` | APT 7 first page, SIDs of KSEA, cursor on a departure | APT 7 |
| `apt-7-stars-ksea` | APT 7 second page, STARs of KSEA (`APT+7`) | APT 7 |
| `apt-7-runway` | the runway list of a SID (KSEA BANGR9) | APT 7 |
| `apt-7-transition` | the transition list of a SID | APT 7 |
| `apt-7-load` | the waypoint list of a SID with `LOAD IN FPL` | APT 7 |
| `apt-7-add-airport` | the question to add the airport to FPL 0 | APT 7 |
| `apt-7-replace` | the question to replace a loaded procedure of the same kind | APT 7 |
| `apt-7-none` | `NO SID/STAR FOR THIS AIRPORT IN DATABASE` (KTIW) | APT 7 |
| `apt-8-approaches-ksea` | APT 8 list of approaches of KSEA | APT 8 |
| `apt-8-iaf` | the IAF list of an approach | APT 8 |
| `apt-8-load` | the waypoint list of an approach with `LOAD IN FPL` (IAF and MAHP marks) | APT 8 |
| `apt-8-load-scrolled` | the end of that list (FAF and MAP marks) | APT 8 |
| `apt-8-none` | `NO APPROACH FOR THIS AIRPORT IN DATABASE` (2S1) | APT 8 |

The writers may add a screen where a variant needs one, and drop one that turns out to show nothing the text does not
say; they report the change. Variants without a screen, because the FAA extract cannot stage them: APT 3 `RUNWAY DATA
NOT AVAILABLE` (every airport of the extract has a runway), `MILTRY`, `PRIVAT`, `(R)`, `LPC`/`LPT`, the state on APT 2
(the extract carries the country only). The APT 8 questions (add, replace) have no screens of their own; the APT 7
questions differ by one word and stand for both.

## Status

| Page | Status |
| --- | --- |
| APT pages (page reference) | done for the dry run (2026-11-04): two review passes, every finding that matters applied; the maintainer's feedback of the same day applied (group section cut to what is specific to airports, concepts linked instead of tooltipped, choices in screen order, excerpts of screens for the ACT page and the confirmation, APT 5 trimmed); bug candidates unfiled. The maintainer keeps the branch as the example for the full run. |
| Every other page | not started (dry run) |

## Open questions for the maintainer

- Plan approval was skipped for the dry run; the full run stops here.
- The maintainer's feedback on the dry run (2026-11-04) is written into the style guide as rules: the basic
  operation is said once and linked (sections 8 and 10), a capable reader is assumed (section 8), choices are named
  in the screen's order (section 12), an excerpt of a screen where the text describes a single line (section 13),
  operating concepts link to their section instead of a tooltip (section 14), and the checklist (section 21). The
  anchors the links use (`#the-active-waypoint`, `#waypoint-alerting`, `#user-waypoints`) are planned; the writers
  of those pages must create them, and the final pass checks every planned anchor.
- The glossary still holds the placeholder entry `Turn anticipation` from before the dry run, used by the lorem text
  of Navigation modes; under section 14 it goes when that placeholder is replaced.
- Suspected bugs are not filed during the dry run. The paragraphs that describe the suspect behavior carry a
  `{/* kln90b bug candidate: … */}` comment instead of `kln90b#NN`; once the maintainer agrees, the coordinator files
  the issues and replaces the comments. After the review:
  - Worth filing, confirmed in the code and not settled by the real manual (comments in the chapter):
    1. APT 4 shows blank rows after the airport changes while a later frequency page is shown.
    2. APT 3: typing an unknown identifier and then a valid one on a list page jumps to the diagram and drops the
       cursor.
    3. APT 3 diagram throws for airports with helipad-style runway entries and stays blank; the extract of the
       screens turns helipads into such entries, and whether the simulator's data does is unverified.
  - Confirmed against the real manual, but belonging to other pages (held for the Flight plans writer in the
    coordinator's scratchpad, `handoff-flight-plans.md`):
    4. A route from the EFB loads an approach into a unit not installed for approaches; `CHANGE APR?` then throws.
    5. The real unit finds an airport by typing its name on APT 1 or its city on APT 2; the simulation has no such
       search (a missing feature; the chapter leaves it out, style guide section 3).
  - Not settled by the manual, the maintainer decides:
    6. A STAR or an approach is inserted before the first occurrence of the airport, which puts it at the start of a
       round trip (held in `handoff-flight-plans.md` with its paragraph).
    7. The frequencies of the simulator's flight service stations are labeled `AFIS` on APT 4; the real unit uses
       that label differently and has a label of its own for radio frequencies.
  - Dropped after review (the real unit behaves the same, or the manual leans the code's way): the airspace text of
    APT 1 ignores the airspace floor (the real unit uses the lateral outline too); a `/` in an airport name is deleted
    without a blank; a remark blanked out on APT 5 keeps its slot until it is deleted on OTH 4.
- Text that the review moved out of the APT chapter because other pages own it (the scan rules, creating a user
  waypoint in full, the `USER POS?` entry, where a procedure goes in FPL 0 in detail, the make-room question, the 30 NM
  arming) is held in the coordinator's scratchpad as `handoff-waypoints.md` and `handoff-flight-plans.md` for the
  writers of Controls and display, Waypoints and the database, Flight plans and Non-precision approaches.
- Style questions the dry run raised: a glossary term that stands as screen text gets its tooltip on the code
  (`<Term t="HRD">`HRD`</Term>`); whether abbreviations every pilot knows (GRND, TWR, APR, ELV, L) need the tooltip at
  all, or only the glossary entry; and whether a message page message of several lines is quoted on one line.
- Whether APT 2's state abbreviation and the private/military flags can be shown at all from the FAA extract (the
  extract has no state and only public airports), which would need an extract change, not a manual change.
