# Package: messages (Messages; the two message lists; the Glossary page)

The lists come after the pages they summarize, so that every entry can link to the page that explains its cause.
Pointers come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not
checked facts.

## Pages

### Messages (`operation/messages.mdx`)

1. Summary.
2. How the unit announces a message; the MSG page (shown and explained here); reading, and what stays until its
   cause is gone.
3. Messages of the status line: where they appear and for how long.
4. The annunciators of the aircraft (Availability box).
5. Links to the two lists.

### Message page messages (`lists/messages.md`) and Status line messages (`lists/status-line-messages.md`)

Form: style guide, section 10 ("Lists"): alphabetical by the text as the unit shows it; each entry the text, the
meaning, what to do, and the link to the owning section. The researcher builds the complete list of texts from the
code; a text that takes a value (an identifier, a course, a code) is listed once with the place of the value
marked.

### Glossary (`lists/glossary.mdx`)

The page is generated from `kln90b/src/data/glossary.ts`. The session checks it against the rule of the style
guide, section 14: the common terms have an entry, no entry belongs to a single screen, and no entry is a
placeholder.

## Topics this package owns

The MSG page, how messages arrive and are read, the annunciators; the texts with meaning and action.

## Where to look

`data/PersistentMessages.ts`, `data/MessageHandler.ts`, `controls/MessagePage.tsx`, `controls/StatusLine.tsx` (the
status line texts), `failures/FailureCatalog.ts` (the failure messages), and the places that raise one-time
messages: `Gps.ts`, `KLN90BCore.ts`, `pages/WelcomePage.tsx`, `pages/left/Set2Page.tsx`, `pages/PageManager.ts`,
`pages/right/Apt7Page.tsx`, `Apt8Page.tsx`, `services/Flightplanloader.ts`, `services/KlnEfbLoader.ts`; the wiki
page `External-Annunciators.md` as background.

## Notes from other packages

- A message of several lines is quoted with its lines, in a code block (style guide, section 12, "Text the unit
  shows"; maintainer, 2026-11-16).
- Earlier packages quote message texts where they are raised and link to these lists by page; the seam check
  sharpens those links to the entries.

### From the package failures (2026-11-16)

- **The failure messages for the list.** Simulated failures quotes each where its failure raises it, with the line
  breaks of the MSG page; the list gives the text, a short meaning and the link to the entry under
  `/kln90b/operation/failures/#what-can-fail` (the anchors of its groups are in `docs/plan/failures.md`). Take the
  texts from the code (`failures/FailureCatalog.ts`, `data/PersistentMessages.ts`), not from this note:
  `ARINC 429 AIR DATA FAIL`, `ARINC 429 OUTPUT FAIL`, for each of ACTV, ARM, MSG and WPT an `… ANNUNCIATOR FAIL`
  and a `CHECK … ANNUNCIATOR`, `BATTERY LOW: SERVICE` (three lines), `EEPROM FAILURE: IC1045` (two lines),
  `NAV SUPER FLAG FAILURE`, `NO RCVR DATA`, `NO RS-232 DATA`, `RCVR HARDWARE ERROR:` (two lines, with a code),
  `RS-232 DATA ERROR`, `RS-232 OUTPUT ERROR`, `USER DATA LOST`. `ALTITUDE FAIL` links to GPS reception and RAIM
  and to the inputs on Simulated failures.
- **Failure messages are persistent** and come back unread at every power-on, while an ordinary message that was
  read stays read over a power cycle (`data/MessageHandler.ts`, `VolatileMemory.ts`). Messages owns the general
  rule; Simulated failures says only the failures' part.
- **Status line messages in general** (found in the review of the FLR chapter, which shows `SERVICED`): a status
  line message takes the whole middle segment of the status line, inverse, for about 5 seconds
  (`controls/StatusLine.tsx`). While it is shown it is also an entry on the MSG page, and that entry never counts
  as read, so it does not stop a flashing `msg` (`data/MessageHandler.ts`). The FLR chapter says only that
  `SERVICED` shows for 5 seconds; the owner says the rest once.

### From the package controls (2026-11-17)

- **ENT on the MSG page** closes it and, if the nearest list is not empty, shows APT 1 with the nearest airport on the
  right (as read by the writer of Controls and display; check in `pages/MainPage.tsx`). Controls and display leaves
  this to Messages.
- The MSG page shows no page identification on either side of the status line.

- <kbd>MSG</kbd> on the MSG page pages through the messages and then closes the page (`MainPage.tsx`, `EVT_MSG`); a turn
  of the right inner knob while it is pulled out does not close the MSG page (`MainPage.tsx:164-168`).
- A status line message is in the message list only while it shows, about 5 seconds (`controls/StatusLine.tsx:211-249`),
  so the MSG page lists it only during that time. This is intended (maintainer, 2026-11-17); describe it as it is.

### From the package power-on (2026-11-17)

- Power-on and initialization says of the messages only that they are forgotten at a power-on and links
  `/kln90b/operation/messages/` for how they come back; the read and unread rule over a power cycle is this
  package's (see the failures note above).
- Messages that Power-on and initialization quotes where they are raised, for the lists (texts from the code):
  `DATA BASE CHECKSUM ERR` (the navigation data cannot be loaded; the Self Test page shows `TEST FAIL`),
  `WAYPOINT xxxxx DELETED` with the identifier (the last active waypoint left the database), the two-line
  `RECYCLE POWER TO USE` `CORRECT DATA BASE DATA` (a date entered on SET 2 moves the database from current to
  expired or back), `DATA BASE OUT OF DATE` (the harness posts it when it boots outside the cycle; check where the
  unit raises it), and the receiver's `POSITION DIFFERS FROM` `LAST POSITION BY >2NM` and `SYSTEM TIME UPDATED`
  `TO GPS TIME`, which GPS reception and RAIM owns.

### From the package waypoints (2026-11-17)

Waypoints and the database has a section per message to link to: `#data-base-out-of-date`, `#recycle-power-to-use`,
`#outdated-db`, `#no-such-wpt`, `#dup-ident`, and `#no-sup-wpts-and-the-other-empty-lists` (`NO APT WPTS` and its
kind). User waypoints owns `#usr-db-full`; `ACTIVE WPT` and `USED IN FPL` are in its `#deleting-a-user-waypoint`.

- `WAYPOINT <ident> DELETED` and `OTHER WAYPOINTS DELETED`: when the cycle lacks a stored waypoint, the first is
  posted at power-on for each waypoint of the flight plans and the active waypoint, up to ten; more than ten gives the
  first ten, then `OTHER WAYPOINTS DELETED` (`services/Flightplanloader.ts:19-60`, `KLN90BCore.ts:360-376`). A user
  waypoint never causes it at power-on; a route from the EFB with the user database full does (User waypoints,
  `#usr-db-full`). Waypoints and the database names the message once and links to Messages.

## Changes to earlier pages

To be listed by the session: links from earlier pages to single entries.
