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
| | Power-on and initialization | `unit/power-on` | power-on (done) |
| Operation | Waypoints and the database | `operation/waypoints` | waypoints |
| | User waypoints (new) | `operation/user-waypoints` | waypoints |
| | Nearest | `operation/nearest` | nearest-direct-to (done) |
| | Direct-to | `operation/direct-to` | nearest-direct-to (done) |
| | Flight plans | `operation/flight-plans` | flight-plans |
| | Modes of operation | `operation/modes-of-operation` | navigation |
| | Sequencing and turn anticipation | `operation/sequencing` | navigation |
| | SID and STAR procedures | `operation/departures-arrivals` | sid-star |
| | Non-precision approaches | `operation/approaches` | approaches |
| | VNAV | `operation/vnav` | vnav-alerts |
| | GPS reception and RAIM (new) | `operation/gps-receiver` | sta (done) |
| | Inside the GPS simulation (new, optional reading) | `operation/gps-simulation` | sta (done); the failures part: failures (done) |
| | Messages | `operation/messages` | messages |
| | Airspace and altitude alerting | `operation/alerts` | vnav-alerts |
| | Trip planning and calculators | `operation/trip-planning` | trip-planning |
| | Fuel and air data | `operation/fuel-air-data` | fuel-air-data |
| | Simulated failures (new) | `operation/failures` | failures (done) |
| Page reference, left | TRI | `pages/tri` | trip-planning |
| | MOD | `pages/mod` | navigation |
| | FPL | `pages/fpl` | flight-plans |
| | NAV (both sides, with Super NAV 1 and Super NAV 5) | `pages/nav` | nav-pages |
| | CAL | `pages/cal` | trip-planning |
| | STA | `pages/sta` | sta (done) |
| | SET (with SET 0 and SET 10) | `pages/set` | set |
| | FLR (new; opened from SET 10) | `pages/flr` | failures (done) |
| | OTH | `pages/oth` | fuel-air-data |
| Page reference, right | CTR | `pages/ctr` | flight-plan-pages |
| | REF | `pages/ref` | flight-plan-pages |
| | ACT | `pages/act` | waypoint-pages (done) |
| | D/T | `pages/dt` | flight-plan-pages |
| | APT | `pages/apt` | apt (done) |
| | VOR, NDB, INT, SUP | `pages/vor`, `pages/ndb`, `pages/int`, `pages/sup` | waypoint-pages (done) |
| Reference lists | Message page messages | `lists/messages` | messages |
| | Status line messages | `lists/status-line-messages` | messages |
| | Glossary | `lists/glossary` | every package adds entries; messages checks the page |
| Help | External hardware | `help/external-hardware` | help |
| | FAQ and troubleshooting | `help/faq` | help |
| | Known limitations | `help/known-limitations` | help |
| | Contact | `help/contact` | help |

Four pages are new against the style guide's first chapter list; section 17 of the style guide names them now:

- **GPS reception and RAIM** (Operation): what the receiver does and how the pilot reads it. It exists so that the
  STA chapter, Power-on, Non-precision approaches and Simulated failures have one place to link to for the receiver
  states, RAIM and the position error.
- **User waypoints** (Operation), split from Waypoints and the database by the package waypoints (2026-11-17),
  because creating, editing and deleting user waypoints is a subject of its own with its own screens.
- **Simulated failures** (Operation) and the **FLR chapter** (page reference), both Simulator only. The FLR pages
  are not on the left outer knob; they open from SET 10. The chapter stands after SET.

**Pages of the unit that are in no page type** have no chapter in the page reference. Their screens and field
explanations stand on the page that owns their task:

| Page of the unit | Shown and explained on |
| --- | --- |
| The Turn-On page, the Self Test page, the VFR-only warning page, the OBS warning page, the Database page | Power-on and initialization |
| The Direct To page | Direct-to |
| The Duplicate Waypoint page; the waypoint page shown for approval | Waypoints and the database |
| The waypoint type page, the make-room pages | Flight plans (the make-room question for a procedure: SID and STAR procedures, linked from Non-precision approaches) |
| The ALT page | Airspace and altitude alerting |
| The MSG page | Messages |

Placeholder pages with filler text exist for some slugs (`operation/direct-to`, `operation/modes-of-operation`,
`pages/nav`, `pages/oth`, `pages/set`, the pages of The unit, Help, `lists/messages`, the tutorials). A package
replaces its placeholders completely; nothing in them is a source.

## Topic ownership

The page and section that explains a topic; every other page gives at most what the last column allows, and links.
An anchor is given where pages link to a section. **(planned)** marks an anchor that pages already link to before its
section exists: the writer of the owning page must create it. Where no anchor is given, link to the page; the session
that writes the owner records the anchors in this table, and the final pass sharpens page links to section links.

| Topic | Owner | What other pages may say |
| --- | --- | --- |
| The front panel: every control and its name | Controls and display, `#the-front-panel` | use exactly its names |
| The two sides of the screen, the status line and its three parts, what flashes | Controls and display, `#the-screen` (`#the-status-line`, `#what-flashes`) | Quickstart: a few sentences; others: nothing |
| Selecting a page type and a page, several pages with one name (`+`), the page tree, the full-screen pages and what brings them up | Controls and display, `#selecting-a-page` (`#the-page-tree`, `#pages-with-a-plus-sign`, `#pages-that-no-knob-reaches`, `#pages-that-use-the-whole-screen`) | Quickstart: a few sentences; the NAV chapter says which page pair gives Super NAV 1 and Super NAV 5 |
| The cursor; the two ways of entering data; ENT and CLR; which side an ENT or CLR acts on | Controls and display, `#entering-data-with-the-cursor` (`#fields-the-knob-changes-directly`, `#entries-that-take-effect-with-ent`, `#questions-in-lists`) | one sentence and the link |
| The scan with the right inner knob pulled out, as a control | Controls and display, `#scanning` | Waypoints and the database owns what the scan goes through |
| Right pages that depend on the left page (D/T, REF, CTR with an FPL page on the left) | Controls and display, `#page-pairs` | each of those chapters: one sentence, the link, then its own variants |
| The controls in the simulator (mouse special cases) | Controls and display, `#using-the-controls-in-the-simulator` | Quickstart: the two special cases |
| Keyboard mode: entering and leaving it, the keys and their gotchas, the hardware toggles | Keyboard mode (`#entering-keyboard-mode`, `#the-keys`, `#leaving-keyboard-mode`) | Quickstart and Controls and display: one sentence and the link |
| Download, versions, the Community folder, the aircraft that carries the unit | Installation | the home page has the buttons; others link |
| The power-on sequence and its pages; the screen warm-up; an aircraft loaded with the engine running | Power-on and initialization: `#turning-the-unit-on` (`#an-aircraft-loaded-with-the-engine-running`), `#the-turn-on-page`, `#the-self-test-page` (`#test-fail-on-the-self-test-page`), `#the-pages-after-the-self-test` (`#the-vfr-only-warning-page`, `#the-obs-warning-page`, `#the-database-page`), `#the-first-pages` | Quickstart: what to press; Tutorial flight 1 walks through it and links |
| Initializing position, date and time (the task; SET 1 and SET 2 are its pages) | Power-on and initialization, `#initializing-the-position-and-the-time` | SET chapter: the pages and fields; GPS reception and RAIM links |
| What the unit keeps while it is off, and what it forgets after more than five minutes off | Power-on and initialization, `#what-the-unit-keeps-while-it-is-off` | owners of the single items (procedures in FPL 0, the direct-to, the entered magnetic variation) say their own item in one sentence and link |
| Features that depend on the installation, each in its Availability box | the page that owns the feature | no list of installation options anywhere (style guide, section 3) |
| The GPS states, the satellites, acquisition and what slows it, NAV ready as a state, the altitude input, the position error, RAIM (what it is, when it is needed, its messages), RAIM prediction as a task, real and fast acquisition | GPS reception and RAIM: `#acquiring-satellites`, `#the-gps-states`, `#real-and-fast-acquisition`, `#the-altitude-input`, `#the-estimated-position-error`, `#raim`, `#predicting-raim`, `#messages-of-the-receiver` | STA chapter: the pages and fields; Power-on: what the pilot does while waiting, and the link; Non-precision approaches: what RAIM decides in an approach; SET chapter (SET 10): the setting and the link |
| How STA 5 behaves: the default destination and ETA, the time of the calculation, the forgotten entries | STA chapter, `STA 5: RAIM prediction` | GPS reception and RAIM: the procedures and the link |
| The model of the receiver in the simulation: the satellites and their signals, the errors of the position, the filter, the kinds of search, the RAIM mathematics | Inside the GPS simulation (optional reading) | GPS reception and RAIM: one link; every other page: nothing (style guide, section 8). How the failures of the reception act on the model: `#the-simulated-failures-in-the-model`; Simulated failures links there once |
| The failures: what can fail, what each failure does, telling the failures of the reception apart on the unit, when the unit notices, random failures, the battery and the loss of user data (with the wrong date afterwards), service | Simulated failures: `#random-failures`, `#failing-a-part-and-repairing-it`, `#service`, `#when-the-unit-notices-a-failure`, `#what-can-fail` (with `#the-receiver-and-the-antenna`, `#interference-and-a-faulty-satellite`, `#the-inputs-from-the-aircraft`, `#the-outputs-to-the-aircraft`, `#the-annunciators`, `#the-memory-of-the-unit`), `#the-battery` | FLR chapter: the pages and fields; a page whose values a failure blanks says nothing about failures; the message lists give the text, the meaning and the link |
| Opening the FLR pages from SET 10 and leaving them | FLR chapter, `#the-flr-pages-failing-and-repairing-parts-of-the-unit` | SET chapter (SET 10): one sentence and the link |
| Waypoint pages in general: the waypoint types, entering an identifier, the scan through the database, duplicate identifiers, the waypoint page shown for approval, the ACT pages as a concept | Waypoints and the database: `#entering-an-identifier`, `#scanning-through-the-database`, `#duplicate-identifiers`, `#approving-the-waypoint-page`, `#the-act-pages` | waypoint chapters (APT, VOR, NDB, INT, SUP, ACT): one sentence, the link, then what is specific |
| The ACT pages in detail: the top line (number in FPL 0, type letter), which pages exist per waypoint type, the scan through FPL 0, `NO ACTIVE WAYPOINT` | ACT chapter: `#which-pages-the-active-waypoint-has`, `#scanning-through-fpl-0`, `#no-active-waypoint` | Waypoints and the database: the concept in a few sentences; APT chapter: one sentence and the link |
| The reference waypoint of the INT and SUP pages: the nearest VOR, the search and its duration, another reference, not stored | INT chapter, `#the-reference-waypoint` | SUP chapter and the field explanations: one sentence and the link; User waypoints: the order of entry when creating |
| User waypoints: creating (`CREATE NEW WPT AT`, `USER POS?`, present position), the limit, `USR DB FULL`, editing, deleting, temporary waypoints | User waypoints: `#creating-a-user-waypoint`, `#usr-db-full`, `#editing-a-user-waypoint`, `#deleting-a-user-waypoint`, `#waypoints-the-unit-creates-by-itself` | waypoint chapters: the fields of a user waypoint of their type; OTH chapter: OTH 3 as a page |
| The database: cycle, expiry, the messages about it | Waypoints and the database, `#the-database` (with a section per message, `#data-base-out-of-date`) | Power-on: the Database page; SET chapter: SET 0 |
| Updating the database (the simulator's navigation data) | FAQ, `#how-do-i-update-the-database` (planned) | Power-on (the Database page) and Waypoints and the database: where the data comes from in one sentence, and the link |
| Airport remarks | APT chapter (APT 5) | OTH chapter: OTH 4 as a page (deleting) |
| The nearest lists: the nearest airport criteria (SET 3), radius, count, renewal, how they are reached, the MSG and ENT shortcut | Nearest: `#the-nearest-lists`, `#showing-a-nearest-list`, `#finding-the-nearest-airport-quickly`, `#no-airport-in-the-nearest-list`, `#setting-the-nearest-airport-criteria`, `#flying-to-a-nearest-waypoint` | waypoint chapters: the nearest variant of their page; SET chapter: SET 3 as a page and the link; a user-defined airport (APT 3): one sentence and the link |
| Direct-to: the Direct To page, every way to start one, the default waypoint, leaving the page, recentering, canceling, direct-to in OBS mode and its course message | Direct-to: `#flying-direct-to-a-waypoint`, `#the-default-waypoint`, `#leaving-the-direct-to-page`, `#flying-direct-to-a-waypoint-of-the-flight-plan`, `#recentering-the-d-bar`, `#canceling-a-direct-to`, `#flying-a-direct-to-in-obs-mode` (`#crs-nnn-in-the-status-line`) | Flight plans: a direct-to to a waypoint of FPL 0, in one paragraph with the link; Controls and display: one sentence on leaving the page and the link |
| The active waypoint and the active leg | Modes of operation, `#the-active-waypoint` (`#no-active-waypoint`) | every page that names it links at its first use |
| Leg and OBS mode (the course modes), selecting them, the GPS CRS switch, the selected course and where it is set, the course messages, changing between the modes, the mode annunciations, the CDI scale factor | Modes of operation: `#leg-mode`, `#obs-mode` (`#selecting-leg-or-obs-mode`, `#the-selected-course`), `#the-course-messages` (`#adj-nav-ind-crs-to-nnn`, `#adj-nav-ind-crs`, `#obs-wpt--200nm`), `#changing-between-the-modes`, `#the-mode-annunciations`, `#the-cdi-scale-factor` | MOD chapter: the pages; NAV chapter: the fields; Non-precision approaches: arming and activation, linking `#the-cdi-scale-factor` for the factors |
| Magnetic variation: where the unit has none, the entered variation, `MAGNETIC VAR INVALID` | Modes of operation, `#magnetic-variation` (`#flying-without-a-magnetic-variation`, `#magnetic-var-invalid`) | SET chapter (SET 2): the field |
| Waypoint alerting, the WPT annunciator | Sequencing and turn anticipation, `#waypoint-alerting` (`#the-wpt-annunciator`) | every page that names it links at its first use |
| Waypoint sequencing, turn anticipation (SET 6), fly-over waypoints, when the unit does not sequence | Sequencing and turn anticipation: `#waypoint-sequencing` (`#when-the-unit-does-not-sequence`), `#turn-anticipation` (`#where-turn-anticipation-begins`, `#turning-off-turn-anticipation`), `#fly-over-waypoints` | SET chapter: SET 6 as a page; FAQ: the question and the link; Flight plans: the waypoint type identification page |
| Flight plans: FPL 0 and the numbered ones, creating, editing, the limits, a full flight plan and the make-room question for a waypoint, the waypoint type identification page, activating and inverting, storing FPL 0, deleting (`DELETE FPL?`), flying and editing the active flight plan | Flight plans: `#the-flight-plans-of-the-unit`, `#creating-a-flight-plan`, `#adding-a-waypoint` (`#taking-the-waypoint-of-the-right-page-into-a-flight-plan`), `#deleting-a-waypoint`, `#a-full-flight-plan` (`#fpl-full`, `#the-question-to-make-room-in-fpl-0`), `#the-waypoint-type-identification-page`, `#activating-a-flight-plan` (`#activating-a-flight-plan-inverted`), `#storing-fpl-0`, `#deleting-a-flight-plan` (`#delete-fpl`), `#flying-the-active-flight-plan`, `#editing-the-active-flight-plan` | FPL chapter: the page, its variants and fields, one sentence and the link per task |
| The FPL page: the active leg symbol, the arrow in OBS mode and during a direct-to, the fence, the questions of the top line as page states | FPL chapter: `#fpl-0-the-active-flight-plan` (`#the-active-leg-symbol`, `#procedure-headers`, `#fpl-0-during-a-direct-to-and-in-obs-mode`), `#fpl-1-to-fpl-25-numbered-flight-plans` (`#use-invrt`), `#the-delete-questions` | Flight plans and Direct-to: link `#the-active-leg-symbol` instead of describing the marks |
| A route from the EFB and FPL 0 sent to the EFB | Flight plans: `#loading-a-route-from-the-efb`, `#sending-fpl-0-to-the-efb` | Tutorial flight 2: the steps (style guide, section 17); FAQ: the question and the link |
| Reference waypoints and center waypoints as tasks | Flight plans: `#reference-waypoints`, `#center-waypoints` | REF and CTR chapters: the pages, their states and fields |
| What a loaded procedure does in FPL 0: where it goes, headers and suffixes, `CHANGE` and `DELETE` on a header, editing procedure waypoints, the make-room question | SID and STAR procedures (Non-precision approaches for what differs for an approach) | Flight plans: one paragraph and the link; APT 7 and APT 8: one sentence and the link |
| The two rules (a transition must be selected; an approach starts only at an IAF) | SID and STAR procedures, Non-precision approaches | stated plainly on APT 7, APT 8 and in the FAQ too (style guide, section 17) |
| Approach arming and activation, the approach modes, DME arcs, the missed approach, what the unit does not fly | Non-precision approaches | APT 8 links |
| VNAV | VNAV | NAV chapter: the fields of NAV 4; CAL chapter: CAL 4 as a page |
| The ALT page, the barometric setting, the selected altitude, altitude alerting, the height above airport alert | Airspace and altitude alerting | NAV chapter: the altitude fields of NAV 4; SET chapter: SET 5, SET 7, SET 9 as pages |
| The airspace alert (SET 8), its messages | Airspace and altitude alerting | APT 1, OTH 2, TRI 2, TRI 4, TRI 6 show airspaces and link |
| Minimum safe altitudes (`MSA`, `ESA`) | NAV chapter, `/kln90b/pages/nav/#minimum-safe-altitudes` | TRI chapter links |
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
| Task page (Operation) | Direct-to, `operation/direct-to.mdx` (approved 2026-11-18) |
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
| 1 | sta | STA chapter; GPS reception and RAIM; Inside the GPS simulation | done (2026-11-16) |
| 2 | failures | FLR chapter; Simulated failures; the failures part of Inside the GPS simulation | done (2026-11-16) |
| 3 | controls | Controls and display; Keyboard mode | done (2026-11-17) |
| 4 | power-on | Power-on and initialization | done (2026-11-17) |
| 5 | waypoints | Waypoints and the database; User waypoints | done (2026-11-17) |
| 6 | waypoint-pages | VOR, NDB, INT, SUP and ACT chapters; the APT chapter cut back to its owner | done (2026-11-17) |
| 7 | nearest-direct-to | Nearest; Direct-to | done (2026-11-18) |
| 8 | navigation | Modes of operation; Sequencing and turn anticipation; MOD chapter | done (2026-11-18) |
| 9 | nav-pages | NAV chapter with Super NAV 1 and Super NAV 5 | done (2026-11-18) |
| 10 | flight-plans | Flight plans; FPL chapter | in review (2026-11-19) |
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

- **The FAA extract** carries no state and only public airports, so APT 2's state abbreviation and the private and
  military flags cannot be staged. Changing that is an extract change, not a manual change.

## For the final pass

- **The glossary is cleared of single-screen entries** (style guide, section 14, rule of 2026-11-16). The package
  waypoint-pages did this for the APT chapter (2026-11-17); the Quickstart and other pages written under the earlier
  rule are left for the final pass.
- **Two rules of 2026-11-17 (maintainer, on the package waypoint-pages):** a code that a few pages show is no
  glossary term, and a display form such as `RW` is no abbreviation of the manual (style guide, section 14); the
  time a calculation takes is "a few seconds", never the code's number (section 8). `HRD`, `SFT` and `RW` are gone;
  the final pass checks the other glossary entries (`NR` and `RMKS` are gone, 2026-11-17) and the durations stated on the
  pages written earlier (GPS reception and RAIM, Power-on, STA) against both rules.

- The placeholder pages use old terms (key, page group); the packages that replace them remove these.
- `unit/power-on.mdx`, "What the unit keeps while it is off", says "a direct-to to the active waypoint" is kept; a
  direct-to is always to the active waypoint, so "the direct-to" says it (writer of Direct-to, 2026-11-18).
- The package navigation (2026-11-18) brought the official terms course mode, selected course, external indicator,
  GPS CRS switch, GPS APR switch, CDI scale factor and the TO/FROM indicator, and corrected the earlier pages the
  seam check found. The final pass searches for the old forms once more ("navigation mode", "OBS course", "course
  indicator", "GPS APR button").
- The package nav-pages (2026-11-18) brought the official terms cross-track error, actual track, minimum en route
  safe altitude, range scale, map orientation, pop-up menu and the VOR, NDB and APT selections; its seam check
  replaced the old forms on the earlier pages and screens. The final pass searches once more ("cross-track
  distance", "track up" without "actual", "en route safe altitude" without "minimum").
- Every planned anchor of the topic ownership table exists; page links that a later package could sharpen to a
  section are sharpened.
- The first Operation pages (sta, failures) have `sidebar.order` numbers that later Operation pages must fit
  around ("Site and generator notes").
- The pages of the packages sta and failures were written before Controls and display, Power-on and the message
  lists existed; they are checked against those pages (terms, names of controls, links).

- **Placeholder field explanations.** `display/screen-layout`, `display/cursor-example`, `pages/set/set-10`,
  `pages/oth/oth-2-zse` and the tutorial screens still have filler text in their field explanations (found by
  the writer of Controls and display, 2026-11-17). The packages that show them fill them in; the final pass removes
  the screens no page shows.
- **Left over from the package power-on (2026-11-17):** the glossary entries `OBS IN` and `OUT` are used only by the Self Test screens
  and go into their field explanations (section 14); `OUT`'s expansion "OBS output" should match the field name
  `OBS OUT`. Simulated failures, `#the-battery`, says the Self Test page shows `TEST FAIL` after a memory loss:
  check which receiver code causes it.
- The package flight-plans (2026-11-19) brought the official terms numbered flight plan, active leg symbol, blank
  waypoint position and fence, and the rule that a symbol of the unit's font is named in words (style guide,
  section 12). The final pass searches once more ("stored flight plan", "stored plan", "leg mark", code points such
  as `Á` or `›` in prose).
- The FLR chapter ("Leaving the FLR pages") repeats some general rules of pages opened over the page tree that
  Controls and display now owns (`#pages-that-no-knob-reaches`); the final pass cuts them to the FLR specifics and
  the link.

## Site and generator notes

Not manual text; for the maintainer or a session that works on the site.

- **The order of the page reference in the sidebar** is each chapter's `sidebar.order`, in page tree order: TRI 1,
  MOD 2, FPL 3, NAV 4, CAL 5, STA 6, SET 7, FLR 8, OTH 9, CTR 10, REF 11, ACT 12, D/T 13, APT 14, VOR 15, NDB 16,
  INT 17, SUP 18. The Operation pages take their number from the order of the style guide's chapter list (section
  17); Waypoints and the database has 1, User waypoints 2, GPS reception and RAIM 11, Inside the GPS simulation 12 and Simulated
  failures 17, so Nearest to VNAV take 3 to 10 and Messages to Fuel and air data 13 to 16 (renumbered when User
  waypoints was added, 2026-11-17; the placeholders Direct-to and Modes of operation have 4 and 6).
- The source tree of kln90b holds the software revision as a template that only its build fills in, and the
  generator fails on it. `kln90b/screens/sta-3/screen.ts` works around this with a mock that reads the version
  from kln90b's `package.json`. A substitution in the generator for every screen would be the cleaner place.
- The generator cannot show the middle part of the status line on a half screen (`show: 'left'` or `'right'`
  allows fields only on the page identification); the style guide (section 13) lets a screen about a status line
  message show both halves.
- `kln90b/generator/api.ts` re-exports the harness's `savedUserWaypoints` next to `savedFlightplan`, for screens
  that need stored user waypoints (`pages/sup/sup-usr-db-full`).
- The build does not check the anchors of links, only the pages. A dead anchor is found by the seam check and the
  final pass.

- The generator does not fail when cells with text belong to no field, which is how a row of a Quickstart screen
  went unexplained. A check that every non-blank cell of a shown half belongs to a field, with an explicit opt-out
  for free text, would catch this.
- The fallback text of the home page's download buttons (`Downloads.astro`) names the zip `falcon71-kln90b`; the
  file is named `falcon71-kln90b-` and the version, ending in `.zip` (`releases.ts`). A wording mismatch only.
- The generator (`kln90b/generator/lib/navdata.ts`, `icaoOf`) resolves every terminal fix that NASR also files to
  the NASR fix and drops the airport, so no terminal waypoint on the screens is one: the waypoint type
  identification page never comes up by itself, and the ACT pages may show `I` where the simulator shows `T`.
  `flight-plans/type-page` works around it in its steps; making a CIFP terminal reference a terminal waypoint with
  its airport would be the clean fix (reviewer of Flight plans, 2026-11-19).
- The generator cannot boot the unit cold: it settles every boot until the first fix, so a state before NAV ready
  is staged by a receiver reset (`pages/fpl/fpl-0-no-fix`).
- The FLR pages are in `kln90b/src/data/pageTree.ts` as `offKnobTree`: the page links read it, the knob demo does
  not, so FLR is no stop of the outer knob there (`docs/plan/failures.md`).
