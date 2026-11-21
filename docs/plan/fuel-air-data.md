# Package: fuel-air-data (the OTH chapter)

Written 2026-11-21. Paths of code relative to `vendor/kln90b/kln90b/`.

The package was planned with an Operation page Fuel and air data next to the OTH chapter. The maintainer found that
it split the topic in half without adding anything the page reference could not say, and it was folded into the
OTH chapter before the package closed (2026-11-21; style guide, section 10, "Task pages"). There is no page
`operation/fuel-air-data`.

## Pages, as written

### OTH pages (`pages/oth.mdx`, `sidebar.order` 9)

| Section | Anchor | Screens (in `pages/oth/`) | Notes |
| --- | --- | --- | --- |
| The OTH pages: which pages your unit has | `#the-oth-pages-which-pages-your-unit-has` | – | which pages each installation has; owns the numbering |
| OTH 1: flight service stations | `#oth-1-flight-service-stations` | `oth-1` | the simulator has no stations |
| OTH 2: the Center at your position | `#oth-2-the-center-at-your-position` | `oth-2-zse`, `oth-2-outside` | introduces area control center (ACC or ARTCC), then Center |
| OTH 3: user waypoints | `#oth-3-user-waypoints` | `oth-3-user-waypoints`, `oth-3-used-in-fpl`, `oth-3-delete-question` | the task stays on User waypoints; temporary waypoints are listed (correct, reviewer) |
| OTH 4: airports with remarks | `#oth-4-airports-with-remarks` | `oth-4-remarks`, `oth-4-delete-question` | deleting remarks, procedure |
| OTH 5: fuel on board and fuel required | `#oth-5-fuel-on-board-and-fuel-required` | `oth-5` | Availability box of the fuel management pages; the destination waypoint rule; TRI keeps its own fuel entries; kln90b#531 in the `fob` field |
| Entering the fuel on board | `#entering-the-fuel-on-board` | `oth-5-fob-entry` | Good to know box: the entry is lost at every power change and never counted down (kln90b#530) |
| `SET FUEL ON BOARD` | `#set-fuel-on-board` | `msg-set-fuel-on-board` | the message in full |
| Setting the fuel reserve | `#setting-the-fuel-reserve` | `oth-5-reserve-entry` | the procedure on OTH 6, where the cursor starts on `RES`; OTH 5 in a sentence with the screen |
| OTH 6: endurance and range | `#oth-6-endurance-and-range` | `oth-6` | – |
| OTH 7: fuel flow | `#oth-7-fuel-flow` | `oth-7-twin`, `oth-7-single` | – |
| OTH 8: fuel used | `#oth-8-fuel-used` | `oth-8-twin`, `oth-8-single` | follows the aircraft, no reset on the unit |
| OTH 9: true airspeed and wind | `#oth-9-true-airspeed-and-wind` | `oth-9`, `oth-9-no-heading` | Availability box of the air data pages with the heading input |
| OTH 10: temperatures and altitudes | `#oth-10-temperatures-and-altitudes` | `oth-10` | – |
| The air data pages without a fuel management system | `#the-air-data-pages-without-a-fuel-management-system` | `oth-5-air-data` | shown as `OTH 5` and `OTH 6` |
| Where the OTH pages are used | `#where-the-oth-pages-are-used` | – | – |

The screens share `kln90b/screens/pages/oth/common.ts` and `kln90b/screens/shared/fuel-air-data.ts`.

**The names of the air data pages** (maintainer, 2026-11-21): the chapter heads them OTH 9 and OTH 10, the names with
a fuel management system; one section and a screen say that without a fuel management system they appear as OTH 5
and OTH 6. A page link of OTH 5 or OTH 6 goes to the fuel management pages; where the text means the air data
pages, it writes `OTH 5` and `OTH 6` in code formatting. The status line writes `OTH10`; prose writes OTH 10.

## Changes to earlier pages (made, through the reviewer)

- `operation/trip-planning.mdx` and `pages/tri.mdx`: "fuel pages" → "fuel management pages", and the links to the
  folded Operation page now go to the OTH 5 section.
- `operation/gps-receiver.mdx`: "air data computer" → "air data system".
- `unit/power-on.mdx`: "the reserve on the OTH pages" → "the fuel reserve of OTH 5 and OTH 6".

## Notes for later packages

- **messages:** `SET FUEL ON BOARD` / `ON OTH 5 IF NECESSARY` gets an entry in Message page messages that links
  `/kln90b/pages/oth/#set-fuel-on-board`. The refusals `ACTIVE WPT` and `USED IN FPL` of OTH 3 are explained on User
  waypoints.
- **final pass:** CAL 1's "outside air temperature" (an entry of the calculator) was left alone; check the term
  there. A user waypoint deleted on OTH 3 stays in TRI 1, TRI 3 and CAL 7 until the next power-on (from the code; a
  case a pilot hardly meets, not written). OTH 2 merges the frequencies of every Center airspace that contains the
  position and takes the name of the lowest frequency; not filed (maintainer, 2026-11-21).
