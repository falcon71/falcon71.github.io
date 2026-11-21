# Package: set (the SET chapter)

Done 2026-11-21. Paths of code relative to `vendor/kln90b/kln90b/`.

## Pages

### SET pages (`pages/set.mdx`), as written

The summary names the SET pages once as the setup pages of the unit, says that the options are kept while the unit is
off, that most pages set a function another page explains, and that SET 0 loads nothing because the unit takes its
database from the simulator. Each section: what the page sets, its screens, the rules of the page as a whole, and the
link to the owner; the owners' numbers are not repeated in the text (the field explanations give ranges and steps).

| Section | Anchor | Screens | Links to |
| --- | --- | --- | --- |
| The SET pages: settings and entries | `#the-set-pages-settings-and-entries` | – | Controls and display (selecting a page, the two ways of entering data) |
| SET 1: initial position | `#set-1-initial-position` | `pages/set/set-1`, `set-1-latitude-entry` | Power-on `#initializing-the-position-and-the-time` |
| SET 2: date, time and time zone | `#set-2-date-time-and-time-zone` | `pages/set/set-2`, `set-2-date-entry`, `navigation/set-2-magvar` | Power-on; D/T `#the-time-zone`; Modes of operation `#flying-without-a-magnetic-variation`; Waypoints `#recycle-power-to-use`; Simulated failures `#the-battery` |
| SET 3: nearest airport criteria | `#set-3-nearest-airport-criteria` | `pages/set/set-3`, `set-3-cursor` | Nearest `#setting-the-nearest-airport-criteria` |
| SET 4: flight timer | `#set-4-flight-timer` | `pages/set/set-4`, `set-4-cursor` | Trip planning and calculators (page link, not written yet) |
| SET 5: height above airport alert | `#set-5-height-above-airport-alert` | `pages/set/set-5`, `set-5-on`, `set-5-disabled` | Airspace and altitude alerting `#the-height-above-airport-alert` |
| SET 6: turn anticipation | `#set-6-turn-anticipation` | `pages/set/set-6`, `set-6-cursor` | Sequencing `#turning-off-turn-anticipation` |
| SET 7: baro setting units | `#set-7-baro-setting-units` | `pages/set/set-7`, `set-7-cursor` | Airspace and altitude alerting `#the-baro-setting` |
| SET 8: airspace alert | `#set-8-airspace-alert` | `pages/set/set-8`, `set-8-cursor`, `set-8-disabled` | `#the-airspace-alert` |
| SET 9: volume of the aural alarm | `#set-9-volume-of-the-aural-alarm` | `pages/set/set-9`, `set-9-disabled` | `#the-aural-alarm` |
| SET 10: acquisition and failures | `#set-10-acquisition-and-failures` | `pages/set/set-10`, `set-10-real`, `set-10-failures` | GPS reception and RAIM `#real-and-fast-acquisition`; FLR chapter |
| SET 0: database update | `#set-0-database-update` | `pages/set/set-0`, `set-0-cursor`, `set-0-expiry`, `set-0-loader-not-ready` | Waypoints `#the-database`; FAQ `#how-do-i-update-the-database` (planned) |

Decisions: SET 1 says that its values are shown as they were when the page was selected, and that once the unit is
NAV ready the measured position replaces an entry. SET 2 that stays read-only after a fix lost while it is shown is
not described (a failure state, style guide section 8). The spaced letters of SET 0 are quoted as the unit shows
them. Every screen could be staged.

## Topics this package owns

Only the pages and their fields.

## Bugs

- kln90b#521: SET 1 shows the values of the moment the page was selected (`pages/left/Set1Page.tsx:36-43`); marked on
  the SET 1 paragraph.
- kln90b#522: SET 4 runs the timer at 30 kt or more while the label says `GS > 30kt` (`services/Timers.ts:27`);
  marked on the SET 4 paragraph and the field `run` of `set-4` and `set-4-cursor`.
- SET 0 goes from `U P D A T E ?` straight to `LOADER NOT READY`: modeled on the real unit without a loader
  connected, confirmed by the maintainer (2026-11-21); no bug.
