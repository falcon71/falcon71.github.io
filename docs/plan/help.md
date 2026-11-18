# Package: help (External hardware; FAQ and troubleshooting; Known limitations; Contact)

Requirements: style guide, section 17, for each page. The pages come after the pages they point into. Screens: none
planned, except where an FAQ answer needs one that exists.

## Pages

- **External hardware** (`help/external-hardware.md`): based on the wiki page `External-Hardware.md` and
  `vendor/kln90b/kln90b/HEvents.ts`. The only page that may show copyable configuration.
- **FAQ and troubleshooting** (`help/faq.md`): based on the wiki's `FAQ.md` (its part about version 1.x does not
  apply) and on the Good to know boxes and gotchas of the pages written. Each answer in its first sentence, then
  the link to the full treatment. Required entries (style guide, section 17): the two rules of procedure selection;
  loading an airway by hand.
- **Known limitations** (`help/known-limitations.md`): based on the wiki page `Known-Limitations.md` and on what
  the packages noted.
- **Contact** (`help/contact.md`).

## Notes from other packages

Candidates for the FAQ and Known limitations, collected by earlier packages; every later package adds its own here.

- From the package getting-started: the package cannot be installed on Xbox, so only aircraft that bundle their own
  copy offer the unit there (wiki, "Bundling the KLN with your aircraft").
- From the package getting-started: keyboard mode has two H events for hardware
  (`KLN90B_LeftKeyboard_Toggle`, `KLN90B_RightKeyboard_Toggle`; kln90b README) for External hardware.
- From the package apt: the simulation has no search of an airport by name or city (Known limitations); the enhancement is kln90b#482, which the entry can link.
- From the planning survey, as candidates to verify: the screen stays dark after power-on (FAQ, linked to the
  Quickstart's box); slow acquisition and the setting on SET 10 (FAQ, linked to GPS reception and RAIM); the unit
  does not sequence (FAQ, linked to Sequencing); OTH 1 lists no flight service stations; course reversals and holds
  are not flown as legs.

### From the package power-on (2026-11-17)

- **The FAQ entry "How do I update the database?"** with the planned anchor `#how-do-i-update-the-database`, which
  Power-on and initialization (the Database page) links to already: the unit uses the navigation data of the
  simulator, so its database is as current as the simulator's; how to update the simulator's navigation data, and
  the workaround of an earlier date in the simulator (wiki, FAQ, "The AIRAC is out of date"). Name no company
  (style guide, section 3) beyond what a pilot needs to find the update.

### From the package navigation (2026-11-18)

- The FAQ entry "Why does the unit not sequence to the next waypoint?" answers in its first sentence: most often the
  unit is in OBS mode (the mode annunciation shows a colon and a course, such as `ENR:351`), where it never
  sequences. Otherwise the waypoint is the last of FPL 0, a direct-to waypoint outside FPL 0 or the missed approach
  point, or the navigation is flagged. Link `/kln90b/operation/sequencing/#when-the-unit-does-not-sequence`.

### From the package nav-pages (2026-11-18)

- Known limitations: the minimum safe altitudes (`MSA`, `ESA` on NAV 3) come from terrain alone; obstacles are not
  in the simulator's data. The NAV chapter says so (`/kln90b/pages/nav/#minimum-safe-altitudes`).
- FAQ candidate: "Why is my map blank?" Track up below 2 kt blanks NAV 5 and Super NAV 5
  (`/kln90b/pages/nav/#the-map-is-blank-in-actual-track-up`).

## Changes to earlier pages

None planned.
