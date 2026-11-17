# Package: power-on (Power-on and initialization)

Pointers come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not
checked facts. Screens are planned by the session after its research.

## Pages

### Power-on and initialization (`unit/power-on.mdx`)

Written and reviewed 2026-11-17. The sections as written, with their anchors:

1. Summary.
2. Turning the unit on (`#turning-the-unit-on`): the power/brightness knob, the warm-up of the screen (Good to know
   box), short power losses that the unit rides through, turning it off. Subsection
   `#an-aircraft-loaded-with-the-engine-running` (Simulator only box): what is skipped, and that the next power-on
   runs the whole sequence.
3. The Turn-On page (`#the-turn-on-page`): what it shows and how long, writing its four lines (procedure), emptying
   a line, and that the left cursor holds the page.
4. The Self Test page (`#the-self-test-page`): what the pilot checks (the test values of the outputs, the D-bar half
   scale to the right, the annunciators, the clock, the altitude) and corrects (the clock, the time zone, the baro
   setting), approving and the beep with its condition, the air data variant, `TEST FAIL` with the link to
   Simulated failures, the 1988 date after a memory loss with the link to `#the-battery`.
5. The pages after the self test (`#the-pages-after-the-self-test`): `#the-vfr-only-warning-page` (Availability
   box), `#the-obs-warning-page` (Availability box: aircraft with a GPS CRS button), `#the-database-page` (current
   and expired).
6. The first pages (`#the-first-pages`): NAV 2 on the left, the page of the last active waypoint on the right, or
   the SUP page; `WAYPOINT xxxxx DELETED`.
7. Initializing the position and the time (`#initializing-the-position-and-the-time`): when it is needed, what to
   do while the unit searches, the procedures on SET 1 and SET 2, `RECYCLE POWER TO USE`, the receiver's messages by
   link, what to do when the unit does not become NAV ready.
8. What the unit keeps while it is off (`#what-the-unit-keeps-while-it-is-off`): kept for any time off, kept for
   up to five minutes, forgotten at every power-on.
9. Where to go next.

The power-on pages are in no page type; this page shows them and owns the field explanations of their screens,
`self-test` included (the Quickstart shows it too).

**Left out:** the take-home warning page. The setting that enables it is not officially supported, so no aircraft
offers it (maintainer, 2026-11-17). Neither the page nor take-home mode is mentioned; kln90b#455 therefore needs no
comment.

## Screens

All planned states were staged: `turn-on-page`, `turn-on-page-cursor`, `self-test`, `vfr-only-page`,
`obs-warning-page`, `database-page`, `database-page-expired`, `set-2-date-entry`, and the existing
`set-1-latitude-entry`.

## Topics this package owns

The power-on sequence and its pages, the task of initializing position and time, what the unit keeps while off.
Links instead of explanations: the receiver states and acquisition (GPS reception and RAIM), the database
(Waypoints and the database), OBS mode (Navigation modes), SET 1 and SET 2 as pages (SET chapter).

## Where to look

`PowerSupply.ts`, `BrightnessManager.ts`, `pages/WelcomePage.tsx`, `pages/left/SelfTestLeftPage.tsx`,
`pages/right/SelfTestRightPage.tsx`, `pages/TakehomePage.tsx`, `pages/VFROnlyPage.tsx`, `pages/ObsWarningPage.tsx`,
`pages/AiracPage.tsx`, `pages/PageManager.ts` (`startMainPage`), `pages/left/Set1Page.tsx`, `Set2Page.tsx`,
`data/VolatileMemory.ts` (`reset`), `settings/KLN90BUserSettings.ts`, `KLN90BCore.ts` (the engine running at load).

## Notes from other packages

All used by this package (2026-11-17).

## Changes to earlier pages

Made in this package and reviewed: the Quickstart's "Turning the unit on" no longer says a page can appear before
the Self Test page; the links to this page in GPS reception and RAIM, Simulated failures and the STA chapter point to
its sections. The field titles "Cursor indication" of every screen became "CRSR annunciation" (word list).
