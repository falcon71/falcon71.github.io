# Manual plan

The index of the plan of the KLN 90B manual (`docs/coordinator-prompt.md`, "The plan"). Every coordinator session
reads this file; the detail of a package is in `docs/plan/<package>.md`. The plan holds no fact and no text from a
real manual. What it says about the unit comes from the survey of the code made in the planning session (2026-11-16)
and is a pointer for researchers, not a source for writers: every fact is checked in the code before it is written.

**Status of the plan:** written in the planning session of 2026-11-16 and approved by the maintainer the same day.

## Outline

Chapter order: style guide, section 17. Every page with its slug (the path under `kln90b/src/content/docs/`, linked
as `/kln90b/<slug>/`) and its package. Pages that do not exist yet are linked by these paths already.

| Chapter | Page | Slug | Package |
| --- | --- | --- | --- |
| Getting started | Installation | `getting-started/installation` | getting-started (done) |
| | Quickstart | `getting-started/quickstart` | getting-started (done) |
| | Tutorial flight 1 | `getting-started/tutorial-1` | tutorial-1 |
| | Tutorial flight 2 | `getting-started/tutorial-2` | tutorial-2 |
| The unit | Controls and display | `unit/controls-and-display` | controls |
| | Keyboard mode | `unit/keyboard-mode` | controls |
| | Power-on and initialization | `unit/power-on` | power-on |
| Operation | Waypoints and the database | `operation/waypoints` | waypoints |
| | Nearest | `operation/nearest` | nearest-direct-to |
| | Direct-to | `operation/direct-to` | nearest-direct-to |
| | Flight plans | `operation/flight-plans` | flight-plans |
| | Navigation modes | `operation/navigation-modes` | navigation |
| | Sequencing and turn anticipation | `operation/sequencing` | navigation |
| | SID and STAR procedures | `operation/departures-arrivals` | sid-star |
| | Non-precision approaches | `operation/approaches` | approaches |
| | VNAV | `operation/vnav` | vnav-alerts |
| | GPS reception and RAIM (new) | `operation/gps-receiver` | sta |
| | Messages | `operation/messages` | messages |
| | Airspace and altitude alerting | `operation/alerts` | vnav-alerts |
| | Trip planning and calculators | `operation/trip-planning` | trip-planning |
| | Fuel and air data | `operation/fuel-air-data` | fuel-air-data |
| | Simulated failures (new) | `operation/failures` | failures |
| Page reference, left | TRI | `pages/tri` | trip-planning |
| | MOD | `pages/mod` | navigation |
| | FPL | `pages/fpl` | flight-plans |
| | NAV (both sides, with Super NAV 1 and Super NAV 5) | `pages/nav` | nav-pages |
| | CAL | `pages/cal` | trip-planning |
| | STA | `pages/sta` | sta |
| | SET (with SET 0 and SET 10) | `pages/set` | set |
| | FLR (new; opened from SET 10) | `pages/flr` | failures |
| | OTH | `pages/oth` | fuel-air-data |
| Page reference, right | CTR | `pages/ctr` | flight-plan-pages |
| | REF | `pages/ref` | flight-plan-pages |
| | ACT | `pages/act` | waypoint-pages |
| | D/T | `pages/dt` | flight-plan-pages |
| | APT | `pages/apt` | apt (done) |
| | VOR, NDB, INT, SUP | `pages/vor`, `pages/ndb`, `pages/int`, `pages/sup` | waypoint-pages |
| Reference lists | Message page messages | `lists/messages` | messages |
| | Status line messages | `lists/status-line-messages` | messages |
| | Glossary | `lists/glossary` | every package adds entries; messages checks the page |
| Help | External hardware | `help/external-hardware` | help |
| | FAQ and troubleshooting | `help/faq` | help |
| | Known limitations | `help/known-limitations` | help |
| | Contact | `help/contact` | help |

Three pages are new against the style guide's first chapter list; section 17 of the style guide names them now:

- **GPS reception and RAIM** (Operation): what the receiver does and how the pilot reads it. It exists so that the
  STA chapter, Power-on, Non-precision approaches and Simulated failures have one place to link to for the receiver
  states, RAIM and the position error.
- **Simulated failures** (Operation) and the **FLR chapter** (page reference), both Simulator only. The FLR pages
  are not on the left outer knob; they open from SET 10. The chapter stands after SET.

**Pages of the unit that are in no page type** have no chapter in the page reference. Their screens and field
explanations stand on the page that owns their task:

| Page of the unit | Shown and explained on |
| --- | --- |
| The Turn-On page, the Self Test page, the take-home warning, the VFR-only page, the OBS warning page, the database page | Power-on and initialization |
| The Direct To page | Direct-to |
| The duplicate waypoint page; the waypoint page shown for approval | Waypoints and the database |
| The waypoint type page, the make-room pages | Flight plans (the make-room question for a procedure: SID and STAR procedures, linked from Non-precision approaches) |
| The ALT page | Airspace and altitude alerting |
| The MSG page | Messages |

Placeholder pages with filler text exist for some slugs (`operation/direct-to`, `operation/navigation-modes`,
`pages/nav`, `pages/oth`, `pages/set`, the pages of The unit, Help, `lists/messages`, the tutorials). A package
replaces its placeholders completely; nothing in them is a source.

## Topic ownership

The page and section that explains a topic; every other page gives at most what the last column allows, and links.
An anchor is given where pages link to a section. **(planned)** marks an anchor that pages already link to before its
section exists: the writer of the owning page must create it. Where no anchor is given, link to the page; the session
that writes the owner records the anchors in this table, and the final pass sharpens page links to section links.

| Topic | Owner | What other pages may say |
| --- | --- | --- |
| The front panel: every control and its name | Controls and display | use exactly its names |
| The two sides of the screen, the status line and its segments | Controls and display, `#the-screen` (planned) | Quickstart: a few sentences; others: nothing |
| Selecting a page type and a page, several pages with one name (`+`), the page tree, the full-screen pages and what brings them up | Controls and display, `#selecting-a-page` (planned) | Quickstart: a few sentences; the NAV chapter says which page pair gives Super NAV 1 and Super NAV 5 |
| The cursor; the two ways of entering data; ENT and CLR; which side an ENT or CLR acts on | Controls and display, `#entering-data-with-the-cursor` (planned) | one sentence and the link |
| The scan with the right inner knob pulled out, as a control | Controls and display, `#scanning` (planned) | Waypoints and the database owns what the scan goes through |
| Right pages that depend on the left page (D/T, REF, CTR with an FPL page on the left) | Controls and display, `#page-pairs` (planned) | each of those chapters: one sentence, the link, then its own variants |
| The controls in the simulator (mouse special cases) | Controls and display, `#using-the-controls-in-the-simulator` (planned) | Quickstart: the two special cases |
| Keyboard mode | Keyboard mode | Quickstart and Controls and display: one sentence and the link |
| Download, versions, the Community folder, the aircraft that carries the unit | Installation | the home page has the buttons; others link |
| The power-on sequence and its pages; the screen warm-up; an aircraft loaded with the engine running | Power-on and initialization | Quickstart: what to press; Tutorial flight 1 walks through it and links |
| Initializing position, date and time (the task; SET 1 and SET 2 are its pages) | Power-on and initialization | SET chapter: the pages and fields; GPS reception and RAIM links |
| What the unit keeps while it is off, and what it forgets after a longer time off | Power-on and initialization | owners of the single items (procedures in FPL 0, the direct-to, the entered magnetic variation) say their own item in one sentence and link |
| Features that depend on the installation, each in its Availability box | the page that owns the feature | no list of installation options anywhere (style guide, section 3) |
| The receiver states, the satellites, acquisition and what slows it, NAV ready as a state, the position error, RAIM (what it is, when it is needed, its messages), RAIM prediction as a task, real and fast acquisition | GPS reception and RAIM | STA chapter: the pages and fields; Power-on: what the pilot does while waiting, and the link; Non-precision approaches: what RAIM decides in an approach; SET chapter (SET 10): the setting and the link |
| The failures: what can fail, what each failure does, when the unit notices, random failures, the battery and the loss of user data, service | Simulated failures | FLR chapter: the pages and fields; a page whose values a failure blanks says nothing about failures; the message lists give the text, the meaning and the link |
| Opening the FLR pages from SET 10 and leaving them | FLR chapter, the type's opening section | SET chapter (SET 10): one sentence and the link |
| Waypoint pages in general: the waypoint types, entering an identifier, the scan through the database, duplicate identifiers, the waypoint page shown for approval, the ACT pages as a concept | Waypoints and the database | waypoint chapters (APT, VOR, NDB, INT, SUP, ACT): one sentence, the link, then what is specific |
| User waypoints: creating (`CREATE NEW WPT AT`, `USER POS?`, present position), the limit, `USR DB FULL`, editing, deleting, temporary waypoints | Waypoints and the database, `#user-waypoints` (planned) | waypoint chapters: the fields of a user waypoint of their type; OTH chapter: OTH 3 as a page |
| The database: cycle, expiry, the messages about it | Waypoints and the database | Power-on: the database page; SET chapter: SET 0 |
| Airport remarks | APT chapter (APT 5) | OTH chapter: OTH 4 as a page (deleting) |
| The nearest lists: criteria (SET 3), radius, count, refresh, how they are reached, the MSG and ENT shortcut | Nearest, `/kln90b/operation/nearest/` | waypoint chapters: the nearest variant of their page; SET chapter: SET 3 as a page |
| Direct-to: every way to start one, the default waypoint, recentering, canceling, direct-to in OBS mode | Direct-to | Flight plans: a direct-to to a waypoint of FPL 0, in one paragraph with the link |
| The active waypoint and the active leg | Navigation modes, `#the-active-waypoint` (planned) | every page that names it links at its first use |
| Leg and OBS mode, selecting them, the OBS course and where it is set, the mode annunciations, the CDI scale | Navigation modes | MOD chapter: the pages; NAV chapter: the fields; Non-precision approaches: the scale and the modes of an approach |
| Magnetic variation: where the unit has none, the entered variation | Navigation modes | SET chapter (SET 2): the field |
| Waypoint alerting | Sequencing and turn anticipation, `#waypoint-alerting` (planned) | every page that names it links at its first use |
| Waypoint sequencing, turn anticipation (SET 6), fly-over waypoints, when the unit does not sequence | Sequencing and turn anticipation | SET chapter: SET 6 as a page; FAQ: the question and the link |
| Flight plans: FPL 0 and the stored ones, creating, editing, the limits, activating and inverting, storing FPL 0, deleting, flying the active flight plan | Flight plans | FPL chapter: the page, its variants and fields |
| A route from the EFB and FPL 0 sent to the EFB | Flight plans | Tutorial flight 2: the steps (style guide, section 17); FAQ: the question and the link |
| Reference waypoints and center waypoints as tasks | Flight plans | REF and CTR chapters: the pages, their states and fields |
| What a loaded procedure does in FPL 0: where it goes, headers and suffixes, `CHANGE` and `DELETE` on a header, editing procedure waypoints, the make-room question | SID and STAR procedures (Non-precision approaches for what differs for an approach) | Flight plans: one paragraph and the link; APT 7 and APT 8: one sentence and the link |
| The two rules (a transition must be selected; an approach starts only at an IAF) | SID and STAR procedures, Non-precision approaches | stated plainly on APT 7, APT 8 and in the FAQ too (style guide, section 17) |
| Approach arming and activation, the approach modes, DME arcs, the missed approach, what the unit does not fly | Non-precision approaches | APT 8 links |
| VNAV | VNAV | NAV chapter: the fields of NAV 4; CAL chapter: CAL 4 as a page |
| The ALT page, the barometric setting, the selected altitude, altitude alerting, the height above airport alert | Airspace and altitude alerting | NAV chapter: the altitude fields of NAV 4; SET chapter: SET 5, SET 7, SET 9 as pages |
| The airspace alert (SET 8), its messages | Airspace and altitude alerting | APT 1, OTH 2, TRI 2, TRI 4, TRI 6 show airspaces and link |
| Minimum safe altitudes (`MSA`, `ESA`) | NAV chapter (NAV 3) | TRI chapter links |
| Trip planning; the calculators; times, time zones and the flight timer as tasks | Trip planning and calculators | TRI, CAL, D/T chapters: the pages; SET chapter: SET 4 as a page |
| Fuel management and air data | Fuel and air data | OTH chapter: the pages; TRI chapter: its own fuel fields |
| The MSG page, how messages arrive and are read, the annunciators | Messages | others link |
| Message texts: meaning and what to do | Message page messages, Status line messages | a page quotes the text where it is raised and links |
| Hardware events and their setup | External hardware | Keyboard mode: its two toggles, with the link |

## Example pages

Every writer reads the example of its kind before it writes, and every reviewer compares against it.

| Kind (style guide, section 10) | Example |
| --- | --- |
| Page reference | the APT chapter, `pages/apt.mdx` |
| Getting started | Installation and the Quickstart (approved 2026-11-16) |
| Task page (Operation) | Direct-to, once it is written and approved (maintainer, 2026-11-16). Until then a writer of a task page reads the Quickstart for the form of procedures and the APT chapter for density and voice |
| Tutorial flight | Tutorial flight 1, once approved |
| Lists | Message page messages, once approved |
| FAQ, Known limitations | the pages of the help package, once approved |

The first Operation pages come from the packages sta and failures, which are not typical task pages and are not
examples. The final pass compares them with Direct-to.

## Packages

In the order they are worked. The maintainer asked for STA and FLR first (2026-11-16), because the pages are new and
pilots need guidance for them; these two packages therefore link to owners that are written later, by the planned
anchors and page links above. After them the order follows "owners before the pages that link to them".

| # | Package | Pages | Status |
| --- | --- | --- | --- |
| – | getting-started | Installation, Quickstart | done (2026-11-16) |
| – | apt | APT chapter | done (dry run 2026-11-04, corrected 2026-11-16) |
| 1 | sta | STA chapter; GPS reception and RAIM | not started |
| 2 | failures | FLR chapter; Simulated failures | not started |
| 3 | controls | Controls and display; Keyboard mode | not started |
| 4 | power-on | Power-on and initialization | not started |
| 5 | waypoints | Waypoints and the database | not started |
| 6 | waypoint-pages | VOR, NDB, INT, SUP and ACT chapters; the APT chapter cut back to its owner | not started |
| 7 | nearest-direct-to | Nearest; Direct-to | not started |
| 8 | navigation | Navigation modes; Sequencing and turn anticipation; MOD chapter | not started |
| 9 | nav-pages | NAV chapter with Super NAV 1 and Super NAV 5 | not started |
| 10 | flight-plans | Flight plans; FPL chapter | not started |
| 11 | flight-plan-pages | D/T, REF and CTR chapters | not started |
| 12 | sid-star | SID and STAR procedures | not started |
| 13 | approaches | Non-precision approaches | not started |
| 14 | vnav-alerts | VNAV; Airspace and altitude alerting | not started |
| 15 | set | SET chapter | not started |
| 16 | trip-planning | Trip planning and calculators; TRI and CAL chapters | not started |
| 17 | fuel-air-data | Fuel and air data; OTH chapter | not started |
| 18 | messages | Messages; Message page messages; Status line messages; the Glossary page | not started |
| 19 | help | External hardware; FAQ and troubleshooting; Known limitations; Contact | not started |
| 20 | tutorial-1 | Tutorial flight 1 | not started |
| 21 | tutorial-2 | Tutorial flight 2 | not started |
| – | final pass | the whole manual (`docs/coordinator-prompt.md`, "The final pass") | not started |

The SET chapter comes late on purpose: nearly every SET page is the setting of a function that another page owns, so
it is written when those owners exist. A package that proves too large in its research is split by its session
(`docs/coordinator-prompt.md`, "A package session"); the likely splits are named in the package files.

## Open questions for the maintainer

- **Suspected bugs of the APT chapter are still unfiled** (`docs/plan/apt.md`, "Bug candidates"). The maintainer
  has an agent triage them later (2026-11-16); the paragraphs carry `kln90b bug candidate` comments until then.
- **The FAA extract** carries no state and only public airports, so APT 2's state abbreviation and the private and
  military flags cannot be staged. Changing that is an extract change, not a manual change.

## For the final pass

- **The glossary is cleared of single-screen entries** (style guide, section 14, rule of 2026-11-16). The APT
  chapter and the Quickstart were written under the earlier rule, which gave every abbreviation of the unit an
  entry and a tooltip. The package waypoint-pages, which changes the APT chapter anyway, moves the entries that
  only one APT screen uses into that screen's field explanation and removes their `<Term>` tags; the final pass
  does the same for whatever is left.

- The placeholder pages use old terms (key, page group); the packages that replace them remove these.
- The glossary holds the placeholder entry `Turn anticipation`, used by the filler text of Navigation modes. It goes
  when the package navigation replaces that page (style guide, section 14).
- The glossary entries `enr:`, `arm-leg`, `arm:` and `apr-leg` were written before the rule on official terms; the
  reviewer of Navigation modes checks the names of all modes.
- Every planned anchor of the topic ownership table exists; page links that a later package could sharpen to a
  section are sharpened.
- The pages of the packages sta and failures were written before Controls and display, Power-on and the message
  lists existed; they are checked against those pages (terms, names of controls, links).

## Site and generator notes

Not manual text; for the maintainer or a session that works on the site.

- The generator does not fail when cells with text belong to no field, which is how a row of a Quickstart screen
  went unexplained. A check that every non-blank cell of a shown half belongs to a field, with an explicit opt-out
  for free text, would catch this.
- The fallback text of the home page's download buttons (`Downloads.astro`) names the zip `falcon71-kln90b`; the
  file is named `falcon71-kln90b-` and the version, ending in `.zip` (`releases.ts`). A wording mismatch only.
- The FLR pages are not in `kln90b/src/data/pageTree.ts`, so the page links do not know them. The package failures
  settles how FLR 1 to FLR 3 become page names that link (`docs/plan/failures.md`).
