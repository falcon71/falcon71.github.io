# Package: trip-planning (Trip planning and calculators; the TRI and CAL chapters)

Written 2026-11-21. Paths of code relative to `vendor/kln90b/kln90b/`.

## Pages, as written

### Trip planning and calculators (`operation/trip-planning.mdx`, `sidebar.order` 15)

The task page: the procedures, which page to use and the consequences. The rules of the pages stay in the TRI and CAL
chapters; this page links there. It names "the system time zone" (word list) and owns the zone list.

| Section | Anchor | Screens | Links to |
| --- | --- | --- | --- |
| Planning a trip | `#planning-a-trip` | – | Fuel and air data (planned; TRI's fuel entries are the pilot's own) |
| Setting the true airspeed and the wind | `#setting-the-true-airspeed-and-the-wind` | `pages/tri/tri-0` | TRI `#tri-0-true-airspeed-and-wind` (the true "from" wind, a sentence) |
| Planning from the present position | `#planning-from-the-present-position` | `pages/tri/tri-1` | TRI `#the-tri-pages-planning-a-trip` (figures computed once, a sentence); D/T 4 and D/T 1 for what is left of FPL 0 |
| Planning between two waypoints | `#planning-between-two-waypoints` | `pages/tri/tri-3` | – |
| Planning along a flight plan | `#planning-along-a-flight-plan` | `pages/tri/tri-5` | – |
| The safe altitude and the airspaces along the route | `#the-safe-altitude-and-the-airspaces-along-the-route` | `pages/tri/tri-2` | TRI `#the-airspaces-along-the-route`; NAV `#minimum-safe-altitudes` |
| Times in flight | `#times-in-flight` | – | – |
| The time zone | `#the-time-zone` | `trip-planning/time-zone` | owns the zone list (19 zones, fixed offsets, no daylight saving change) and the sharing |
| The flight timer | `#the-flight-timer` | `pages/dt/dt-4`, `pages/set/set-4-cursor` | owns the 30 kt (kln90b#522 on the paragraph); `POWER IS ON` chosen later keeps the count and `DEP` |
| The calculators | `#the-calculators` | – | a question-to-page table; VNAV `#the-angle` |
| Finding the wind in flight | `#finding-the-wind-in-flight` | `pages/cal/cal-2`, `pages/cal/cal-3` | CAL 2's true airspeed passes to CAL 3 |
| Where to go next | `#where-to-go-next` | – | – |

### TRI pages (`pages/tri.mdx`, `sidebar.order` 1)

| Section | Anchor | Screens |
| --- | --- | --- |
| The TRI pages: planning a trip | `#the-tri-pages-planning-a-trip` | Good to know box: the figures are computed when the page is selected and do not update; a page selected before NAV ready stays dashed |
| TRI 0: true airspeed and wind | `#tri-0-true-airspeed-and-wind` | `tri-0`; Good to know box: the wind direction is true and "from" |
| TRI 1: from the present position (with "TRI 1 without a position or a waypoint", "TRI 1 with no groundspeed from the wind", "The limits of the values") | `#tri-1-from-the-present-position` | `tri-1`, `tri-1-gs`, `tri-1-no-fix`, `tri-1-no-solution` |
| TRI 2: safe altitude and airspaces from the present position | `#tri-2-safe-altitude-and-airspaces-from-the-present-position` | `tri-2` (KTIW), `tri-2-none` (KYKM–KELN) |
| TRI 3: between two waypoints | `#tri-3-between-two-waypoints` | `tri-3` (KPAE–KBFI) |
| TRI 4: safe altitude and airspaces between two waypoints | `#tri-4-safe-altitude-and-airspaces-between-two-waypoints` | `tri-4` (KGEG–KSFF), `tri-4-plus` (KPAE–KBFI, page 2 of 3) |
| TRI 5: along a flight plan | `#tri-5-along-a-flight-plan` | `tri-5`, `tri-5-empty` |
| TRI 6: safe altitude and airspaces along a flight plan | `#tri-6-safe-altitude-and-airspaces-along-a-flight-plan` | `tri-6` |
| The airspaces along the route (which are listed, what counts as along the route, two lines for each, the pages of the list) | `#the-airspaces-along-the-route` | – |
| Where the TRI pages are used | `#where-the-tri-pages-are-used` | – |

The screens share their entries and steps in `screens/pages/tri/states.ts`. The generator's extract has only Class B
and Class C airspace, so no screen shows another type.

### CAL pages (`pages/cal.mdx`, `sidebar.order` 5)

| Section | Anchor | Screens |
| --- | --- | --- |
| The CAL pages: calculators | `#the-cal-pages-calculators` | – |
| CAL 1: pressure and density altitude | `#cal-1-pressure-and-density-altitude` | `cal-1`, `cal-1-default` (an unentered altimeter setting gives `65600ft`, a plain sentence), `cal-1-mb`, `cal-1-cursor` |
| CAL 2: true airspeed | `#cal-2-true-airspeed` | `cal-2` |
| CAL 3: wind | `#cal-3-wind` | `cal-3`, `cal-3-heading`; Availability box for the heading input |
| CAL 4: VNAV angle | `#cal-4-vnav-angle` | `cal-4` |
| CAL 5: temperature and speed | `#cal-5-temperature-and-speed` | `cal-5` |
| CAL 6: time conversion | `#cal-6-time-conversion` | `cal-6`; Good to know box: the time is that of the first look after power-on |
| CAL 7: sunrise and sunset | `#cal-7-sunrise-and-sunset` | `cal-7`, `cal-7-blank`, `cal-7-date-entry` |
| Where the CAL pages are used | `#where-the-cal-pages-are-used` | – |

The screens share their locators in `screens/pages/cal/fields.ts`; `cal-3-heading` uses the harness's
`HEADING_INPUT`, re-exported by `kln90b/generator/api.ts`. No `<Term>` on `BARO` and `GS` in the CAL fields: the
glossary entries describe the unit's own baro setting and the GPS groundspeed. Example values are the writers' own,
not those of the kln90b tests.

Every planned screen could be staged; the polar case of CAL 7 is not shown (the extract has no polar place), its
dashes look like `cal-7-blank`.

## Topics this package owns

Trip planning as a task; the system time zone (the list and the sharing) and the flight timer; which calculator
answers which question (Trip planning and calculators). The rules of the TRI pages and the airspace list of TRI 2, 4
and 6 (TRI chapter). The CAL pages, including that CAL 6 and CAL 7 keep their own zone after starting from the system
time zone (CAL chapter).

## Changes to earlier pages (made)

- `pages/dt.mdx`: the links sharpened to `#the-time-zone` and `#the-flight-timer`; D/T 4 refers to the flight timer
  instead of repeating the 30 kt; "the system time zone" at the first mention.
- `pages/set.mdx`: SET 4 links `#the-flight-timer`; SET 2 says "the system time zone".

## Bugs

See the report of 2026-11-21 to the maintainer; the filed issues are marked on the paragraphs.
