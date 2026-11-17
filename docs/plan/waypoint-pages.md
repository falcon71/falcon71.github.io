# Package: waypoint-pages (the VOR, NDB, INT, SUP and ACT chapters)

Five small chapters of the page reference, written right after their owner, Waypoints and the database, and the APT
chapter cut back to what is specific to airports. Done 2026-11-17. Each chapter follows the APT 1 form: the page,
then its variants as `###` subsections, with one sentence and the link for everything that works as on every
waypoint page. `sidebar.order`: ACT 12, VOR 15, NDB 16, INT 17, SUP 18.

## Sections as written

- **ACT** (`pages/act.mdx`): `#act-pages-the-waypoint-pages-of-the-active-waypoint` (the top line: the number in
  FPL 0, the type letter, `D` for a VOR with DME, `T` for a terminal waypoint filed under an airport; the identifier
  cannot be changed; what the cursor reaches on each page type), `#which-pages-the-active-waypoint-has` (ACT 8 in an
  Availability box), `#scanning-through-fpl-0` (with the `kln90b#491` paragraph: the page keeps the passed waypoint
  after a sequence or a direct-to within FPL 0), `#a-direct-to-waypoint-outside-the-flight-plan`,
  `#no-active-waypoint` (no direct-to and fewer than two waypoints in FPL 0; CRSR there, `kln90b#492`),
  `#where-the-act-pages-are-used`.
- **VOR** (`pages/vor.mdx`): `#vor-page-frequency-class-and-position-of-a-station` (with the `kln90b#489`
  paragraph: the scan reaches localizers, VOTs and TACAN-only stations that typing skips), `#a-nearest-vor`,
  `#a-user-defined-vor`, `#where-the-vor-page-is-used`.
- **NDB** (`pages/ndb.mdx`): `#ndb-page-frequency-and-position-of-a-station`, `#a-nearest-ndb`,
  `#a-user-defined-ndb`, `#where-the-ndb-page-is-used`.
- **INT** (`pages/int.mdx`): `#int-page-intersection-position-and-reference` (terminal waypoints in the list, in one
  sentence), `#the-reference-waypoint` (owns the reference search: the nearest VOR to the waypoint after a few
  seconds, in a Good to know box; another reference; not stored; 1,000 NM), `#a-user-defined-intersection` (`kln90b#488`),
  `#where-the-int-page-is-used`.
- **SUP** (`pages/sup.mdx`): `#sup-page-supplemental-waypoints` (the list holds only supplemental waypoints, those
  the unit makes included; REF as on the INT page, linked), `#no-supplemental-waypoints-stored`,
  `#defining-a-new-waypoint` (`kln90b#488`), `#where-the-sup-page-is-used`.
- **APT** (`pages/apt.mdx`): the opening is cut back (below); "The ACT page and approving the waypoint page of an
  airport" is now `#the-act-pages-of-an-airport`.

## Screens

All staged. The extract holds only VOR/DME and VORTAC stations and whole-kHz NDBs, so a VOR without DME, the VOR
classes other than `H` and a half-kHz NDB frequency are described in the field explanations only; there are no
localizers, VOTs or TACAN stations to show.

New: `act-vor-olm`, `act-terminal-fix`, `act-direct-to`, `act-no-active`, `vor-pae`, `vor-nearest`, `vor-user`,
`vor-user-empty`, `ndb-fhr`, `ndb-nearest`, `ndb-user`, `ndb-user-empty`, `int-lofal`, `int-user`. Reused:
`apt-act-1`, `sup-user-waypoint`, `waypoint-no-sup-wpts`, `sup-create-by-radial`, `direct-to-create-waypoint`.

## Notes from other packages

None left; the notes of the packages controls and waypoints are used. kln90b#486 (APT 7 after a scan) needed no
comment: the APT 7 section does not describe the scan.

## Changes to earlier pages (made by this package, 2026-11-17)

- **APT chapter, the opening section:** the `+` paragraph is one sentence and the link to Controls and display;
  "User-defined airports" keeps only what is specific to an airport and links User waypoints for creating; the
  section on the ACT page and approval is one sentence each with the links; the screens `apt-create-new-wpt`,
  `apt-act-1`, `apt-confirm` and `apt-1-user-pos` left the chapter (User waypoints, Waypoints and the database and
  the ACT chapter show them).
- **Glossary:** the entries of codes that a single APT page shows (APT 1 airspace types, APT 2 codes, APT 3 surface
  and lighting codes, APT 4 frequency types, APT 8 approach types) are gone; the field explanations explain them in
  plain words. `HRD`, `SFT` and `RW` went too, on the maintainer's review; `NR`, `RMKS` and the approach terms used across
  chapters stay.
- **Waypoints and the database:** every APT page offers to create a user waypoint; the complete list of the SUP page
  holds only the supplemental waypoints.
- **User waypoints:** a user-defined airport's position is set on APT 1, the elevation on APT 2, the runway on APT 3;
  `ENT LAT/LON` appears after every entry while the position is incomplete; the class `U` is "undefined"; the screen
  `vor-user-empty` shows a user VOR being created.
