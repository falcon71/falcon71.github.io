# Package: help (External hardware; FAQ and troubleshooting; Known limitations; Contact)

Done (2026-11-21). Requirements: style guide, section 17, for each page. No screens: every answer links to the page
that shows the screen.

## Pages as written

### External hardware (`help/external-hardware.mdx`)

Based on the wiki page `External-Hardware.md` and `vendor/kln90b/kln90b/HEvents.ts`. It names every tool, hardware
and community project the wiki names, with their links and videos (maintainer, 2026-11-21; style guide, section 3).
The SPAD.neXt XML and the FSUIPC `myevents.txt` are downloads (`kln90b/public/downloads/`), written by
`npm run hardware-files` (`kln90b/generator/hardware-files.mjs`), which fails when an event of `HEvents.ts` is neither
written nor one of the internal events it leaves out; rerun when the pin moves (style guide, section 19).

- Summary: H events for every control, the brightness variable.
- `#the-events`: where the list is, how the names are formed, the internal events left out, the scan and approach
  arming events with their links, the keyboard toggles named with the link to Keyboard mode, the brightness variable
  (the events preferred; 0 looks like a unit that is off), hot-swapping (the unit ignores every event while another
  GPS unit is selected).
- `#spadnext`, `#fsuipc`: numbered procedures with the download links; FSUIPC: add the lines to an existing
  `myevents.txt`.
- `#stream-deck`, `#realsimgear-gns430`, `#a-3d-printed-unit`: a sentence or two and the links. The wiki's
  "Popped out window" is obsolete and left out.

### FAQ and troubleshooting (`help/faq.md`)

Questions as `###` under `##` topics; each answers in its first sentence and links its owner:

- `#turning-the-unit-on`: `#why-does-the-unit-not-turn-on`, `#why-does-the-self-test-page-show-test-fail`,
  `#why-does-it-take-so-long-to-get-a-gps-position`.
- `#the-database`: `#how-do-i-update-the-database` (names Navigraph and links its instructions, as the wiki does;
  start the simulator again after installing navigation data).
- `#flight-plans-and-procedures`: `#how-do-i-load-a-flight-plan-from-the-simulator`, `#how-do-i-enter-an-airway`,
  `#why-did-my-flight-plan-disappear`, `#why-are-my-sid-star-and-approach-gone-after-the-flight`,
  `#why-must-i-select-a-transition-and-why-are-waypoints-in-my-flight-plan-twice-afterward`,
  `#why-can-i-not-start-an-approach-at-an-intermediate-fix`, `#why-can-i-not-select-an-ils-approach`,
  `#why-does-the-unit-not-fly-the-holding-pattern-or-the-procedure-turn`.
- `#navigation`: `#why-does-the-unit-not-sequence-to-the-next-waypoint`, `#why-is-my-map-blank`.

### Known limitations (`help/known-limitations.md`)

One `##` entry each: no search of an airport by name or city (kln90b#482), no flight service stations on OTH 1, no
fuel, oxygen, customs or fee data on APT 6, minimum safe altitudes from terrain alone, no dark outline around map
text, the screen refreshes as a whole, no installation on Xbox.

### Contact (`help/contact.md`)

The kln90b issues (search first; the aircraft and the package version in a report), Discord, and this repository's
issues for errors in the manual.

## Changes to earlier pages

None.
