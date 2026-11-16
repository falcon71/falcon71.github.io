# Package: power-on (Power-on and initialization)

Pointers come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not
checked facts. Screens are planned by the session after its research.

## Pages

### Power-on and initialization (`unit/power-on.mdx`)

Requirements: style guide, section 17. Planned sections:

1. Summary.
2. Turning the unit on: the power/brightness knob, the warm-up of the screen (Good to know box, as in the
   Quickstart), an aircraft loaded with the engine running.
3. The Turn-On page, with its lines that the pilot can write.
4. The Self Test page: what each side shows and why, what the pilot checks and enters, approving; `TEST FAIL` in one
   sentence with the link to Simulated failures.
5. The pages that may follow: the take-home warning, the VFR-only page (Availability boxes), the OBS warning page,
   the database page.
6. The first pages after power-on.
7. Initializing the position and the time: the task on SET 1 and SET 2, when it is needed, what to do when the unit
   does not become NAV ready. The receiver's side of it links to GPS reception and RAIM.
8. What the unit keeps while it is off, and what it forgets after a longer time off.
9. Links on.

This page shows and explains the power-on pages, which are in no page type (index, "Pages of the unit that are in
no page type"). It reuses or replaces the screen `self-test` of the Quickstart: one screen, one id.

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

### From the package sta (2026-11-16)

Pointers from the code (`Gps.ts`, `GpsSearch.ts`, `pages/WelcomePage.tsx`); check each before it is written:

- Correcting the position, the date or the time while the receiver has no position restarts the search, and the
  position follows within about 150 seconds. While the unit has a position, the correction changes nothing for the
  receiver.
- The unit's clock follows the simulator's time while the unit is off.
- With the acquisition set to `REAL`, loading the aircraft at another airport than the one it was last turned off
  at posts `POSITION DIFFERS FROM` `LAST POSITION BY >2NM` at the first position.
- **Take-home mode** stays with this package: a pilot meets it only as the warning page before the self test, in
  aircraft whose installation enables it (Availability box). In the pinned code a take-home unit turned on cold and
  dark never gets a position, and one started with the engine running loses it for good after a power cycle
  (`Gps.ts:562-574, 746, 948-955`). kln90b#455 (closed) is about this; check whether the pin contains its fix
  before the page describes the behavior, and add the `kln90b#455` comment if it does not.
- GPS reception and RAIM owns acquisition (`#acquiring-satellites`, `#the-gps-states`,
  `#real-and-fast-acquisition`); this page says what the pilot does while waiting and links.

From the package getting-started (facts from the code and the staged unit, to be checked again):

- The display warms up for up to about 6 seconds after a long time off, less after a short one
  (`BrightnessManager.ts`, `TIME_TO_WARM`, `TIME_UNTIL_COLD` 10 minutes). A turned-down power/brightness knob also
  keeps the screen dark (maintainer, 2026-11-16).
- The Turn-On page shows `SELF TEST IN PROGRESS` for 17 seconds (`WelcomePage.tsx`, `TEST_TIME`). While the left
  cursor is on there (editing the four lines of the Turn-On page), the unit stays on it.
- In take-home mode a Take-Home warning page comes before the Self Test page (`WelcomePage.showSelfTestPage`).
- The Self Test page opens with the cursor on the barometric setting; each ENT moves the cursor on, also where the
  field had nothing to accept, until `APPROVE?` (`SelfTestRightPage.tsx`, `enterAlwaysMoves`). Three presses of ENT
  move the cursor from the barometric setting to `APPROVE?`, a fourth approves. With an air data input the setting
  is read only and not a cursor field. ENT on `APPROVE?` gives five short beeps.
- The beeps need an audio output of the aircraft, which none of the aircraft that carry the unit has so far
  (maintainer, 2026-11-16); the Quickstart leaves the beep out and this page says it with that condition.
- After approval: the VFR-only page with `ACKNOWLEDGE?` in a VFR-only installation; then the OBS warning page if
  the unit is in OBS mode, which has no acknowledgement and stays until the aircraft's GPS CRS switch selects leg
  mode; then the database page (expires or expired, with `ACKNOWLEDGE?`).
- The normal pages then show NAV 2 on the left and, on the right, the page of the last active waypoint (APT 4 for
  an airport), or the SUP page when there was none (`PageManager.startMainPage`).
- An aircraft loaded with its engine running skips the Turn-On page, the self test and the database page, and the
  GPS acquires at once; every later power-on runs the full sequence (`KLN90BCore.isForceReadyToUse`). A failed self
  test shows `TEST FAIL` and the message `DATA BASE CHECKSUM ERR` (`WelcomePage.leaveFailed`).
- Power losses of up to 1.5 seconds are carried without a restart (`PowerSupply.ts`, `RIDE_THROUGH_TIME`).

From the planning survey: after more than a few minutes off the unit also drops the procedures in FPL 0, the
direct-to and an entered magnetic variation (`data/VolatileMemory.ts`, `reset` and `RESET_TIME`); the owners of
those items (index) say their own item and link here.

## Changes to earlier pages

The seam check compares the Quickstart's "Turning the unit on" with this page (terms, the screen `self-test`). The
pages of the packages sta and failures get their links to this page sharpened to its sections.
