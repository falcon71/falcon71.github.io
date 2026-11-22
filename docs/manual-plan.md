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
| | Tutorial flight 2 | `getting-started/tutorial-2` | tutorial-2, tutorial-2-approach |
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
| | DME arcs (new) | `operation/dme-arcs` | sid-star |
| | Non-precision approaches | `operation/approaches` | approaches |
| | VNAV | `operation/vnav` | vnav-alerts |
| | GPS reception and RAIM (new) | `operation/gps-receiver` | sta (done) |
| | Inside the GPS simulation (new, optional reading) | `operation/gps-simulation` | sta (done); the failures part: failures (done) |
| | Messages | `operation/messages` | messages |
| | Airspace and altitude alerting | `operation/alerts` | vnav-alerts |
| | Trip planning and calculators | `operation/trip-planning` | trip-planning |
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

Five pages are new against the style guide's first chapter list; section 17 of the style guide names them now:

- **GPS reception and RAIM** (Operation): what the receiver does and how the pilot reads it. It exists so that the
  STA chapter, Power-on, Non-precision approaches and Simulated failures have one place to link to for the receiver
  states, RAIM and the position error.
- **User waypoints** (Operation), split from Waypoints and the database by the package waypoints (2026-11-17),
  because creating, editing and deleting user waypoints is a subject of its own with its own screens.
- **DME arcs** (Operation), split from SID and STAR procedures by the maintainer (2026-11-20), because the unit
  handles arcs unlike other navigators and pilots search for them; procedures and approaches link there.
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
| The D/T pages: the rows beside an FPL page, the other variants, when values show dashes or are blank | D/T chapter: `#dt-1-beside-an-fpl-page`, `#dt-1-beside-any-other-page`, `#the-time-zone`, `#dt-4-flight-times`, `#dashes-and-blank-rows` | Trip planning: the D/T pages in use, with the links; NAV chapter: its own fields |
| How FPL 0 scrolls with the active leg | FPL chapter, `#the-fpl-pages-waypoints-in-a-list` | D/T chapter: the link |
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
| Updating the database (the simulator's navigation data) | FAQ, `#how-do-i-update-the-database` | Power-on (the Database page) and Waypoints and the database: where the data comes from in one sentence, and the link |
| Airport remarks | APT chapter (APT 5) | OTH chapter: OTH 4 as a page (deleting) |
| The nearest lists: the nearest airport criteria (SET 3), radius, count, renewal, how they are reached, the MSG and ENT shortcut | Nearest: `#the-nearest-lists`, `#showing-a-nearest-list`, `#finding-the-nearest-airport-quickly`, `#no-airport-in-the-nearest-list`, `#setting-the-nearest-airport-criteria`, `#flying-to-a-nearest-waypoint` | waypoint chapters: the nearest variant of their page; SET chapter: SET 3 as a page and the link; a user-defined airport (APT 3): one sentence and the link |
| Direct-to: the Direct To page, every way to start one, the default waypoint, leaving the page, recentering, canceling, direct-to in OBS mode and its course message | Direct-to: `#flying-direct-to-a-waypoint`, `#the-default-waypoint`, `#leaving-the-direct-to-page`, `#flying-direct-to-a-waypoint-of-the-flight-plan`, `#recentering-the-d-bar`, `#canceling-a-direct-to`, `#flying-a-direct-to-in-obs-mode` (`#crs-nnn-in-the-status-line`) | Flight plans: a direct-to to a waypoint of FPL 0, in one paragraph with the link; Controls and display: one sentence on leaving the page and the link |
| The active waypoint and the active leg | Modes of operation, `#the-active-waypoint` (`#no-active-waypoint`) | every page that names it links at its first use |
| Leg and OBS mode (the course modes), selecting them, the GPS CRS switch, the selected course and where it is set, the course messages, changing between the modes, the mode annunciations, the CDI scale factor | Modes of operation: `#leg-mode`, `#obs-mode` (`#selecting-leg-or-obs-mode`, `#the-selected-course`), `#the-course-messages` (`#adj-nav-ind-crs-to-nnn`, `#adj-nav-ind-crs`, `#obs-wpt--200nm`), `#changing-between-the-modes`, `#the-mode-annunciations`, `#the-cdi-scale-factor` | MOD chapter: the pages; NAV chapter: the fields; Non-precision approaches: arming and activation, linking `#the-cdi-scale-factor` for the factors |
| Magnetic variation: where the unit has none, the entered variation, `MAGNETIC VAR INVALID` | Modes of operation, `#magnetic-variation` (`#flying-without-a-magnetic-variation`, `#magnetic-var-invalid`) | SET chapter (SET 2): the field |
| Waypoint alerting, the waypoint alert annunciator | Sequencing and turn anticipation, `#waypoint-alerting` (`#the-waypoint-alert-annunciator`) | every page that names it links at its first use |
| Waypoint sequencing, turn anticipation (SET 6), fly-over waypoints, when the unit does not sequence | Sequencing and turn anticipation: `#waypoint-sequencing` (`#when-the-unit-does-not-sequence`), `#turn-anticipation` (`#where-turn-anticipation-begins`, `#turning-off-turn-anticipation`), `#fly-over-waypoints` | SET chapter: SET 6 as a page; FAQ: the question and the link; Flight plans: the waypoint type identification page |
| Flight plans: FPL 0 and the numbered ones, creating, editing, the limits, a full flight plan and the make-room question for a waypoint, the waypoint type identification page, activating and inverting, storing FPL 0, deleting (`DELETE FPL?`), flying and editing the active flight plan | Flight plans: `#the-flight-plans-of-the-unit`, `#creating-a-flight-plan`, `#adding-a-waypoint` (`#taking-the-waypoint-of-the-right-page-into-a-flight-plan`), `#deleting-a-waypoint`, `#a-full-flight-plan` (`#fpl-full`, `#the-question-to-make-room-in-fpl-0`), `#the-waypoint-type-identification-page`, `#activating-a-flight-plan` (`#activating-a-flight-plan-inverted`), `#storing-fpl-0`, `#deleting-a-flight-plan` (`#delete-fpl`), `#flying-the-active-flight-plan`, `#editing-the-active-flight-plan` | FPL chapter: the page, its variants and fields, one sentence and the link per task |
| The FPL page: the active leg symbol, the arrow in OBS mode and during a direct-to, the fence, the questions of the top line as page states | FPL chapter: `#fpl-0-the-active-flight-plan` (`#the-active-leg-symbol`, `#procedure-headers`, `#fpl-0-during-a-direct-to-and-in-obs-mode`), `#fpl-1-to-fpl-25-numbered-flight-plans` (`#use-invrt`), `#the-delete-questions` | Flight plans and Direct-to: link `#the-active-leg-symbol` instead of describing the marks |
| A route from the EFB and FPL 0 sent to the EFB | Flight plans: `#loading-a-route-from-the-efb`, `#sending-fpl-0-to-the-efb` | Tutorial flight 2: the steps (style guide, section 17); FAQ: the question and the link |
| Reference waypoints and center waypoints as tasks, the computation, the duplicate on a recompute | Flight plans: `#reference-waypoints`, `#center-waypoints` | REF and CTR chapters: the pages, their states (`#invalid-ref`, `#not-enough-room-in-fpl`, `#no-ctr-waypoints`) and fields |
| What a loaded procedure does in FPL 0: where it goes, procedure headers, `CHANGE` and `DELETE` on a header, editing procedure waypoints, the make-room question for a procedure, `REDUNDANT WPTS IN FPL` | SID and STAR procedures: `#which-procedures-the-unit-offers`, `#what-the-unit-keeps-of-a-procedure`, `#loading-a-sid`, `#loading-a-star`, `#a-transition-must-be-selected` (`#redundant-wpts-in-fpl`), `#where-the-procedure-goes-in-fpl-0`, `#the-procedure-in-fpl-0`, `#the-question-to-make-room-for-a-procedure`, `#changing-a-procedure`, `#deleting-a-procedure`, `#editing-the-waypoints-of-a-procedure`, `#flying-a-sid-or-a-star` (Non-precision approaches for what differs for an approach) | Flight plans: one paragraph and the link; APT 7 and APT 8: one sentence and the link |
| The two rules (a transition must be selected; an approach starts only at an IAF) | SID and STAR procedures, Non-precision approaches | stated plainly on APT 7, APT 8 and in the FAQ too (style guide, section 17) |
| Which approaches the unit offers (ILS deliberately absent), loading an approach, approach arming and activation, the CDI scale along an approach, RAIM in an approach, the suffixes of approach waypoints, `INVALID ADD` and `INVALID DEL`, the missed approach, changing and deleting an approach | Non-precision approaches: `#which-approaches-the-unit-offers`, `#loading-an-approach` (`#an-approach-starts-only-at-an-iaf`, `#replacing-an-approach`), `#the-approach-in-fpl-0` (`#invalid-add-and-invalid-del`), `#arming-the-approach` (`#press-alt-to-set-baro`, `#arm-gps-approach`), `#activating-the-approach`, `#the-cdi-scale-along-the-approach`, `#raim-in-an-approach` (`#raim-not-available-apr-mode-inhibited`, `#press-gps-apr-for-nav`), `#flying-the-approach` (`#vectors-to-final`), `#the-missed-approach`, `#changing-or-deleting-an-approach` | APT 8: the page, the two rules plainly, and links; GPS reception and RAIM: the messages and the link; FAQ: the ILS question and the link |
| DME arcs: which legs become arcs, the DME arc waypoint (computation, name), moving it (`MOVE ?`, `NO INTRCEPT`), flying the arc, OBS mode on an arc | DME arcs: `#arcs-in-a-procedure`, `#the-dme-arc-waypoint` (`#the-name-of-a-dme-arc-waypoint`), `#moving-the-dme-arc-waypoint` (`#move--in-fpl-0`, `#no-intrcept`), `#flying-the-arc` (`#distance-time-and-bearing-on-the-arc`, `#nav-2-and-super-nav-5-on-an-arc`, `#leaving-the-arc`), `#the-dme-arc-waypoint-as-a-waypoint`, `#an-arc-in-obs-mode` | SID and STAR procedures, Non-precision approaches, APT 7 and APT 8: one sentence and the link; NAV chapter: its fields; FPL chapter: `MOVE ?` as a row state and the link |
| Holding patterns and procedure turns the unit drops, `IF REQUIRED SELECT OBS` | SID and STAR procedures, `#if-required-select-obs` | Non-precision approaches: what differs, and the link |
| VNAV: setting it up, starting it, the states and the countdown, `VNV ALERT`, the angle, which waypoint, `INVALID VNV`, what ends it (the NAV flag included) | VNAV: `#what-vnav-does`, `#setting-up-a-descent-or-a-climb` (`#vnav-without-an-altitude-input`), `#starting-vnav`, `#flying-the-vertical-path` (`#vnv-alert`), `#the-angle`, `#which-waypoint-vnav-can-use` (`#invalid-vnv`), `#when-vnav-ends` | NAV chapter: the fields of NAV 4 and field 1 of Super NAV 5, with the links; CAL chapter: CAL 4 as a page |
| The ALT page, the baro setting, the selected altitude as the alert's input, altitude alerting and its aural alarm, the height above airport alert | Airspace and altitude alerting: `#the-alt-page`, `#the-baro-setting`, `#altitude-alerting` (`#the-aural-alarm`, `#the-altitude-deviation-alert`), `#the-height-above-airport-alert` | NAV chapter: the altitude fields of NAV 4; SET chapter: SET 5, SET 7, SET 9 as pages and the link; Power-on: the approval beeps need altitude alerting, one sentence and the link |
| The airspace alert (SET 8), its messages | Airspace and altitude alerting: `#the-airspace-alert` (`#airspace-alert`, `#inside-spc-use-airspace`) | APT 1, OTH 2, TRI 2, TRI 4, TRI 6 show airspaces and link; SET chapter: SET 8 as a page |
| Minimum safe altitudes (`MSA`, `ESA`) | NAV chapter, `/kln90b/pages/nav/#minimum-safe-altitudes` | TRI chapter links |
| Trip planning; the calculators; the system time zone (its list and the pages that share it) and the flight timer | Trip planning and calculators: `#planning-a-trip` (`#setting-the-true-airspeed-and-the-wind`, `#planning-from-the-present-position`, `#planning-between-two-waypoints`, `#planning-along-a-flight-plan`, `#the-safe-altitude-and-the-airspaces-along-the-route`), `#the-time-zone`, `#the-flight-timer`, `#the-calculators` (`#finding-the-wind-in-flight`) | TRI, CAL, D/T chapters: the pages; SET chapter: SET 2 and SET 4 as pages and the link; a page that shows the zone names it and links `#the-time-zone`; the 30 kt is said only at `#the-flight-timer` (and in SET 4's field explanations, which carry kln90b#522) |
| The TRI pages' rules (entries shared and kept, figures computed when the page is selected), the airspace list of TRI 2, 4 and 6 | TRI chapter: `#the-tri-pages-planning-a-trip`, `#the-airspaces-along-the-route` | Trip planning: the steps, one sentence and the link |
| CAL 6 and CAL 7 keep their own zone after starting from the system time zone | CAL chapter: `#cal-6-time-conversion`, `#cal-7-sunrise-and-sunset` | Trip planning `#the-time-zone`: one sentence |
| Fuel management and air data: which OTH pages an installation has, entering the fuel on board and `SET FUEL ON BOARD`, the fuel reserve, the destination waypoint of the fuel figures, the wind and the heading input | OTH chapter: `#the-oth-pages-which-pages-your-unit-has`, `#oth-5-fuel-on-board-and-fuel-required` (with the message section), `#oth-9-true-airspeed-and-wind`, `#the-air-data-pages-without-a-fuel-management-system` (no Operation page, maintainer, 2026-11-21) | TRI chapter and Trip planning: TRI's own fuel entries, one sentence and the link |
| The MSG page (with its closing rules), how messages arrive and are read, one-time and lasting messages, messages over a power cycle, status line messages and their duration, the message annunciator and the remote mounted annunciators as a group | Messages: `#the-message-prompt`, `#reading-the-messages` (`#showing-the-nearest-airport-from-the-msg-page`), `#messages-that-stay-while-their-cause-lasts`, `#messages-after-a-power-on`, `#status-line-messages`, `#the-remote-mounted-annunciators` | Controls and display: where the prompts stand, one sentence on the MSG page and the link; others link |
| Message texts: meaning and what to do | Message page messages, Status line messages: one entry per message, its anchor the slug of the message text (`/kln90b/lists/messages/#no-such-wpt`) | a page quotes the text where it is raised and links the entry |
| Hardware events and their setup, the download files | External hardware: `#the-events`, `#spadnext`, `#fsuipc` | Keyboard mode: its two toggles, with the link |

## Example pages

Every writer reads the example of its kind before it writes, and every reviewer compares against it.

| Kind (style guide, section 10) | Example |
| --- | --- |
| Page reference | the APT chapter, `pages/apt.mdx` |
| Getting started | Installation and the Quickstart (approved 2026-11-16) |
| Task page (Operation) | Direct-to, `operation/direct-to.mdx` (approved 2026-11-18) |
| Tutorial flight | Tutorial flight 1, once approved |
| Lists | Message page messages, `lists/messages.mdx`, once approved |
| FAQ, Known limitations | `help/faq.md`, `help/known-limitations.md` (approved 2026-11-21) |

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
| 10 | flight-plans | Flight plans; FPL chapter | done (2026-11-19) |
| 11 | flight-plan-pages | D/T, REF and CTR chapters | done (2026-11-20) |
| 12 | sid-star | SID and STAR procedures; DME arcs | done (2026-11-20) |
| 13 | approaches | Non-precision approaches | done (2026-11-20) |
| 14 | vnav-alerts | VNAV; Airspace and altitude alerting | done (2026-11-20) |
| 15 | set | SET chapter | done (2026-11-21) |
| 16 | trip-planning | Trip planning and calculators; TRI and CAL chapters | done (2026-11-21) |
| 17 | fuel-air-data | OTH chapter (the Operation page Fuel and air data was folded into it, maintainer, 2026-11-21) | done (2026-11-21) |
| 18 | messages | Messages; Message page messages; Status line messages; the Glossary page | done (2026-11-21) |
| 19 | help | External hardware; FAQ and troubleshooting; Known limitations; Contact | done (2026-11-21) |
| 20 | tutorial-1 | Tutorial flight 1 | done (2026-11-22) |
| 21 | tutorial-2 | Tutorial flight 2, up to the top of descent (split, 2026-11-22) | done (2026-11-22; branch `manual-tutorial-2` stays open for tutorial-2-approach) |
| 22 | tutorial-2-approach | Tutorial flight 2, from the top of descent: the arrival, the approach, the visual approach | not started |
| – | final pass | the whole manual (`docs/coordinator-prompt.md`, "The final pass") | not started |

The SET chapter comes late on purpose: nearly every SET page is the setting of a function that another page owns, so
it is written when those owners exist. A package that proves too large in its research is split by its session
(`docs/coordinator-prompt.md`, "A package session"); the likely splits are named in the package files.

## Open questions for the maintainer

- **The FAA extract** carries no state and only public airports, so APT 2's state abbreviation and the private and
  military flags cannot be staged. Changing that is an extract change, not a manual change.

## For the final pass

- **The GPS CRS switch is the common case** (maintainer, 2026-11-22, on Tutorial flight 2): most aircraft that carry
  the unit have an external switch for leg and OBS mode, often labeled LEG/OBS, where <kbd>ENT</kbd> on MOD 1 and
  MOD 2 does nothing. Modes of operation (`#selecting-leg-or-obs-mode`) describes <kbd>ENT</kbd> first and the switch
  under an Availability box that says "some aircraft"; the final pass turns the order around there and on every other
  page that changes the course mode, and reconsiders the term (the word list has "the GPS CRS switch").
- **VNAV, entering the angle** (review of Tutorial flight 2, 2026-11-22): step 7 of `operation/vnav.mdx`, "Setting up
  a descent or a climb", says the angle is entered with the left inner knob, units first, then tenths; moving to the
  tenths takes the left outer knob. Tutorial flight 2 words it precisely; the owner page needs the same.

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
- The package flight-plan-pages (2026-11-20) brought the official terms Distance/Time pages, estimated time en
  route and estimated time of arrival written out, present time, next waypoint, destination waypoint, the NAV flag,
  and "reference waypoint" for the waypoint the REF page creates (the waypoint typed on the REF page is "the waypoint
  you enter"). The final pass searches once more ("the time now", "following waypoint", "new waypoint" for a
  reference waypoint, "loses its position" for the NAV flag).
- **Two rules of 2026-11-20 (maintainer, on the package flight-plan-pages):** an abbreviation every pilot reads at
  once is no glossary term (style guide, section 14; `DIS` is gone), and a computation or a geometry the pilot must
  picture gets a drawing (section 16). The final pass checks the other glossary entries against the first and the
  Operation pages written earlier against the second (for example the reference waypoint and the center waypoints on
  Flight plans, which link the drawings of the REF and CTR chapters).
- The ETE and ETA threshold of 2 kt is stated on the D/T chapter, GPS reception and RAIM, the ETE glossary entry and
  the field explanations of the NAV 1 and Super NAV 1 screens; the final pass decides on one owner and lets the others
  refer to the event (style guide, section 8).
- The FLR chapter ("Leaving the FLR pages") repeats some general rules of pages opened over the page tree that
  Controls and display now owns (`#pages-that-no-knob-reaches`); the final pass cuts them to the FLR specifics and
  the link.

- The package sid-star (2026-11-20) brought the official terms the beginning and the end of the arc, a radial
  within or outside the arc, and the reference VOR of the arc, and split "transition" (of a turn, of a procedure) in
  the word list. The final pass searches once more ("end fix", "published start", "abeam the arc", "the VOR of the
  arc", "header row").
- The reviewer of SID and STAR procedures named "airport reference point" as the official term where the pages say
  "the airport" of a procedure in FPL 0; not adopted (the row of FPL 0 is the airport itself), for the maintainer.
- The screen `navigation/msg-adj-nav-ind-crs` explains a flashing `MSG` as "in inverse video", and the field `sid`
  of `pages/fpl/fpl-0-procedures` lacks the `<Term>` at its first SID (reviewer of SID and STAR procedures).

- The package vnav-alerts (2026-11-20) brought the official terms vertical path, descent point, inactive (VNAV),
  altimeter baro setting, warn altitude, aural alarm, altitude deviation alert, special use airspace alert and offset
  height. The final pass searches once more ("deviation limit", "alert tones", "start of the path", "altimeter
  setting" for the unit's own).
- `operation/alerts.mdx` says the 10 minutes of the airspace alert in more than one place (seam check, 2026-11-20);
  the final pass cuts it to its owner sentence.
- **Rule of 2026-11-20 (maintainer, on the package vnav-alerts):** a page that works with a field of the other side
  shows both halves (style guide, section 13; the ALT page with NAV 4). The final pass looks for other half screens
  of such pages.

- The package set (2026-11-21) brought the official terms the setup pages (named once on the SET chapter) and the
  initial heading (SET 1), and wrote "NAV ready" where SET 2 depends on a fix. Power-on and initialization says "has a
  position" for the same condition; the final pass makes it "NAV ready" there too.

- The package trip-planning (2026-11-21) brought the official terms system time zone, reserve fuel, the "from" and
  "to" waypoint, areas of special use airspace, military operation area, the Calculator pages, altimeter setting (the
  CAL entry) and the descent or ascent angle with the rate of descent or ascent (CAL 4). Its seam check put "the system
  time zone" on D/T and SET 2; the final pass looks for "time zone" elsewhere (STA 5, Power-on, the Self Test screen).
- The time zone list is repeated in the field explanations of `pages/set/set-2`, `set-2-date-entry` and
  `power-on/self-test`; the final pass cuts them to a sentence and the link to `operation/trip-planning/#the-time-zone`
  (seam check, 2026-11-21).
- The glossary entries `BARO` and `GS` describe the unit's own baro setting and the GPS groundspeed; the CAL pages
  therefore use no `<Term>` for them. The final pass decides whether the entries should cover the CAL fields too.

- The package fuel-air-data (2026-11-21) brought the official terms the fuel management pages, fuel units, landing
  fuel on board, fuel reserve (OTH 5 and OTH 6; TRI keeps reserve fuel), fuel efficiency and static air temperature,
  and the rule that a topic done on one page type gets no Operation page (style guide, section 10). The final pass
  searches once more ("fuel pages", "fuel left on board", "air data computer", "fuel computer", "outside air
  temperature") and checks the other Operation pages against the rule.

- The package messages (2026-11-21) brought the official terms message annunciator, super flag, airport remarks,
  waypoint alert annunciator and remote mounted annunciators (the last two applied across the manual on the
  maintainer's decision), and the manual's own names one-time and lasting message. The final pass searches once
  more ("MSG annunciator", "MSG light", "nav super flag", "WPT annunciator", "remote annunciator").
- `display/screen-layout` shows the same state as `messages/msg-prompt` and still has filler field explanations;
  the final pass removes it if no page shows it.

- The package help (2026-11-21) brought the exception of section 3 for External hardware (tools and sim hardware
  named, the RealSimGear GNS430 included) and the download files of External hardware (section 19). Its reviewers
  noted for other pages: Controls and display could say that a fully dimmed screen looks like a unit that is off;
  GPS reception and RAIM could say that a never-used unit acquires as with an old almanac (`REAL` on SET 10); Keyboard
  mode could say that its two hardware toggles also close the MSG page, and link External hardware `#the-events`.

- The package tutorial-1 (2026-11-22): `unit/power-on.mdx` ("What the unit keeps while it is off") and
  `operation/direct-to.mdx` disagree on what is left after a power-off of more than five minutes. Power-on says the
  active waypoint is kept, Direct-to says the direct-to is dropped and the closest leg of FPL 0 becomes active; with an
  empty FPL 0 there is no active waypoint, yet the first pages still show APT 4 of the waypoint that was active
  (`VolatileMemory.ts`, the start-page waypoint). The final pass makes the two owners agree (reviewer of Tutorial
  flight 1).

- The package tutorial-2 (2026-11-22): in leg mode the desired track uses the variation at the aircraft, not a VOR's
  published variation, so a leg along a charted VOR radial reads a few degrees off it (YKM to TITON on the radial 284
  of YKM reads 290°). Modes of operation (`#leg-mode`) or the `DTK` field explanation could say so in a sentence
  (writer of Tutorial flight 2).

## Site and generator notes

Not manual text; for the maintainer or a session that works on the site.

- **The order of the page reference in the sidebar** is each chapter's `sidebar.order`, in page tree order: TRI 1,
  MOD 2, FPL 3, NAV 4, CAL 5, STA 6, SET 7, FLR 8, OTH 9, CTR 10, REF 11, ACT 12, D/T 13, APT 14, VOR 15, NDB 16,
  INT 17, SUP 18. The Operation pages take their number from the order of the style guide's chapter list (section
  17); Waypoints and the database has 1, User waypoints 2, DME arcs 8.5 (added after the numbering, 2026-11-20), GPS reception and RAIM 11, Inside the GPS simulation 12 and Simulated
  failures 17, so Nearest to VNAV take 3 to 10 and Messages to Trip planning and calculators 13 to 15 (Fuel and air data, 16, was folded into the OTH chapter, 2026-11-21; renumbered when User
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
- A screen folder name must match `[a-z0-9-]+`; throwaway screens of a researcher or a reviewer use `review-*`,
  not `_review-*` (2026-11-22).
- The generator cannot boot the unit cold: it settles every boot until the first fix, so a state before NAV ready
  is staged by a receiver reset (`pages/fpl/fpl-0-no-fix`).
- The generator names a Center airspace with `K`, its ARTCC identifier and its FAA name (`KZSE SEATTLE`), because
  the unit looks up the Center abbreviation of CTR 2 by the first four characters (`kln90b/generator/lib/navdata.ts`,
  `boundaryOf`; package flight-plan-pages, 2026-11-20).
- The FLR pages are in `kln90b/src/data/pageTree.ts` as `offKnobTree`: the page links read it, the knob demo does
  not, so FLR is no stop of the outer knob there (`docs/plan/failures.md`).
