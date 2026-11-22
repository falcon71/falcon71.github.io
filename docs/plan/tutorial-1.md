# Package: tutorial-1 (Tutorial flight 1)

Requirements: style guide, section 10 ("Tutorial flights") and section 17 ("Tutorial flights"): the route `KFHR DCT
KTIW`, the aircraft requirement, the navigation data and cycle the flight was checked with, the FAA chart search
instead of charts, no flight plan file. The page runs on Opus.

## Pages

### Tutorial flight 1 (`getting-started/tutorial-1.mdx`)

The tutorial owns no topic. Every step links the section that owns it; a difference between the tutorial and its
owner is a finding for the owner. It teaches the knobs, the cursor and data entry by using them, and says what the
pilot sees after each important step.

Sections as written (2026-11-22), with their anchors under `/kln90b/getting-started/tutorial-1/`:

1. **Summary and the table of the flight** (before the first heading): what the flight teaches; departure,
   destination, distance, aircraft, navigation data checked with.
2. **What you need** (`#what-you-need`): an aircraft in which the KLN 90B drives the CDI or HSI; the VFR charts and
   the KTIW airport diagram through the FAA's pages.
3. **Turning the unit on at Friday Harbor** (`#turning-the-unit-on-at-friday-harbor`): the power-on pages, approving
   the self test, the Database page, the first pages, NAV ready by itself.
4. **Looking up Friday Harbor** (`#looking-up-friday-harbor`): the right cursor and entering `KFHR` on APT 1, APT 4.
5. **Flying direct to Tacoma Narrows** (`#flying-direct-to-tacoma-narrows`): the default waypoint KFHR, entering
   `KTIW`, approving it, NAV 1 on the ground, the course message of the external indicator.
6. **En route** (`#en-route`): NAV 1 and NAV 2, NAV 5; **The airspace alert for the Seattle Class B**
   (`#the-airspace-alert-for-the-seattle-class-b`); **The nearest airport** (`#the-nearest-airport`).
7. **Arriving at Tacoma Narrows** (`#arriving-at-tacoma-narrows`): the ACT pages of KTIW, waypoint alerting, passing
   KTIW, the next power-on.
8. **Where to go next** (`#where-to-go-next`).

## Screens

All staged; ids under `kln90b/screens/tutorial-1/`, with the shared steps in `kln90b/screens/shared/tut1.ts`. The page
also shows `power-on/self-test` and `power-on/database-page`. The en route screens run with the airspace alert off
(style guide, section 13), so their status lines show no `MSG`, although the pilot's will at that point.

## Notes for the session

- The maintainer flies the tutorial in the simulator before it is published; the session's report says so and
  hands over a list of what to check in the cockpit.
- The screens use the FAA extract of AIRAC 2610 (NASR 2026-10-01, CIFP 2610). The "checked with" cell of the table
  names what the maintainer flew; until then it names the cycle of the screens and the maintainer confirms it.

## For the maintainer's flight in the simulator

To check in the cockpit before the tutorial is published (writer and reviewer, 2026-11-22):

1. Cold and dark at KFHR: the Turn-On page, the Self Test page and the Database page come; the CDI or HSI shows the
   self-test deflection with FROM. Pressing ENT until the cursor is on `APPROVE?`, then ENT once more, approves it.
2. After the Database page, NAV 2 shows the position near KFHR and CVV without dashes; nothing is entered on SET 1 or
   SET 2.
3. With KFHR on the right APT 1, D→ offers `KFHR`; one step of the left inner knob starts a new entry. The first ENT
   shows APT 1 of KTIW with `CL B`.
4. After the second ENT, NAV 1 shows about 77 NM and 151°, and `ADJ NAV IND CRS TO 151°` appears; turning the course
   to 151° clears it, and it does not come back when the desired track becomes 152°.
5. The CDI needle follows the D-bar after takeoff; NAV 2 changes from CVV to PAE to SEA.
6. The airspace alert flashes `MSG` about halfway with two `AIRSPACE ALERT:` messages for the Seattle Class B;
   `INSIDE SPC USE AIRSPACE` comes later. Check at the altitude actually flown.
7. MSG then ENT shows the nearest airport near Bremerton; the way back to NAV 1 works as the page says.
8. From NAV 1, the right outer knob reaches the ACT pages of KTIW; ACT 4 shows the frequencies.
9. The arrow before `KTIW` flashes shortly before the airport; after passing it KTIW stays active, NAV 1 shows FROM
   and the bearing turns to about 332°.
10. After a power-off and power-on, the right side shows APT 4 of KTIW.
11. The "checked with" cell of the table names the navigation data and the cycle actually flown (now: the
    simulator's default navigation data, AIRAC 2610, the cycle of the screens).

## Notes from other packages

None.

## Changes to earlier pages

None planned.
