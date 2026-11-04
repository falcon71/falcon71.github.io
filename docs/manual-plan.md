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
| Waypoint pages in general: the five kinds, how an identifier is entered, the ACT page and the waypoint confirmation | Waypoints and the database (Operation) | APT chapter says what is special to airports and links |
| Creating a user waypoint (`CREATE NEW WPT AT`, user or present position, the 250 limit, `USR DB FULL`) | Waypoints and the database | APT chapter shows the offer once, names the user-airport fields on APT 1 to APT 3, links |
| The nearest lists: criteria (SET 3), radius, count, how they are reached, the MSG + ENT shortcut | Nearest (Operation) | APT chapter explains the nearest *variant of the pages* (header `nr n`, the fields that change on APT 1, the cursor parked on `nr n`) and links for the rest |
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
| `apt-create-new-wpt` | The offer `CREATE NEW WPT AT` after an unknown identifier | APT group |
| `apt-2-ksea` | APT 2, KSEA, with the time zone answered | APT 2 |
| `apt-2-user-airport` | APT 2 of a user airport with the elevation entered | APT 2 |
| `apt-3-diagram-kpdx` | APT 3 runway diagram of KPDX (map) | APT 3 |
| `apt-3-list-ksea` | APT 3 first list page of KSEA (`APT+3`) | APT 3 |
| `apt-3-user-airport` | APT 3 of a user airport with a runway entered | APT 3 |
| `apt-4-kykm` | APT 4 first page of KYKM (`APT+4`) | APT 4 |
| `apt-5-ktiw` | APT 5 of KTIW with a remark entered | APT 5 |
| `apt-6-ksea` | APT 6 of KSEA | APT 6 |
| `apt-7-sids-ksea` | APT 7 first page, SIDs of KSEA, cursor on a departure | APT 7 |
| `apt-7-stars-ksea` | APT 7 second page, STARs of KSEA (`APT+7`) | APT 7 |
| `apt-7-runway` | the runway list of a SID (KSEA BANGR9) | APT 7 |
| `apt-7-transition` | the transition list of a SID | APT 7 |
| `apt-7-load` | the waypoint list of a SID with `LOAD IN FPL` | APT 7 |
| `apt-7-add-airport` | the question to add the airport to FPL 0 | APT 7 |
| `apt-7-none` | `NO SID/STAR FOR THIS AIRPORT IN DATABASE` (KTIW) | APT 7 |
| `apt-8-approaches-ksea` | APT 8 list of approaches of KSEA | APT 8 |
| `apt-8-iaf` | the IAF list of an approach | APT 8 |
| `apt-8-load` | the waypoint list of an approach with `LOAD IN FPL` | APT 8 |
| `apt-8-none` | `NO APPROACH FOR THIS AIRPORT IN DATABASE` | APT 8 |

The writers may add a screen where a variant needs one, and drop one that turns out to show nothing the text does not
say; they report the change.

## Status

| Page | Status |
| --- | --- |
| APT pages (page reference) | researched (fact sheets in the coordinator's scratchpad, 2026-11-04); writing |
| Every other page | not started (dry run) |

## Open questions for the maintainer

- Plan approval was skipped for the dry run; the full run stops here.
- Suspected bugs are not filed during the dry run. The paragraphs that describe the suspect behavior carry a
  `{/* kln90b bug candidate: … */}` comment instead of `kln90b#NN`; once the maintainer agrees, the coordinator files
  the issues and replaces the comments. The candidates, from the researchers (to be confirmed by review):
  1. APT 4 shows blank rows after the airport changes while a later frequency page is shown.
  2. Airport names drop the `/` without a blank (`BOEING FLDK`).
  3. A remark blanked out on APT 5 keeps its slot in the 100-airport limit and stays listed on OTH 4.
  4. The airspace text on APT 1 (`CL B`) ignores the airspace floor; airports under a shelf show it too.
  5. APT 3: typing an unknown identifier and then a valid one on a list page jumps to the diagram and drops the cursor.
  6. APT 3 diagram throws for airports with helipad-style runway entries (KMWH, 2S1 and others) and stays blank.
  7. A route from the EFB loads an approach into a unit not installed for approaches; `CHANGE APR?` then throws.
  8. A STAR or an approach is inserted before the first occurrence of the airport, which is wrong when the same
     airport is also the departure.
- Whether APT 2's state abbreviation and the private/military flags can be shown at all from the FAA extract (the
  extract has no state and only public airports), which would need an extract change, not a manual change.
