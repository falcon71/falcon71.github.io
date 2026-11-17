# Package: set (the SET chapter)

Written late on purpose: nearly every SET page is the setting of a function that an Operation page owns, and those
owners exist by now. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research.

## Pages

### SET pages (`pages/set.mdx`)

Sections in knob order: SET 1 to SET 10, then SET 0. Each section: what the page sets, the screen, the variants,
and the link to the page that owns the function.

| Page | What it is for | Owner of the function |
| --- | --- | --- |
| SET 1 | the initial position | Power-on and initialization |
| SET 2 | date, time and time zone; the magnetic variation field | Power-on and initialization; Navigation modes |
| SET 3 | the criteria for nearest airports | Nearest |
| SET 4 | when the flight timer runs | Trip planning and calculators (planned) |
| SET 5 | the height above airport alert (Availability box) | Airspace and altitude alerting |
| SET 6 | turn anticipation | Sequencing and turn anticipation |
| SET 7 | the barometer units | Airspace and altitude alerting |
| SET 8 | the airspace alert | Airspace and altitude alerting |
| SET 9 | the altitude alert volume (Availability box) | Airspace and altitude alerting |
| SET 10 | real or fast acquisition; the way to the FLR pages (Simulator only box; style guide, section 17) | GPS reception and RAIM; the FLR chapter |
| SET 0 | the database update page, full screen | Waypoints and the database |

## Topics this package owns

Only the pages and their fields.

## Where to look

`pages/left/Set0Page.tsx` to `Set10Page.tsx`, `pages/PageTreeController.ts` (the order), the wiki page
`SET-10-Page.md`. The screen `pages/set/set-3-cursor` of the Quickstart exists; reuse or replace.

## Notes from other packages

- From the package getting-started: SET 0 follows SET 10 in the knob order; while it is shown, the status line
  shows no mode and no right page name.
- From the planning survey: SET 5 and SET 9 show a text instead of their fields where the installation has no
  altitude alerting; SET 0 has no loader behind it in the simulation, and the chapter says what the pilot sees and
  no more (style guide, section 3).

### From the package failures (2026-11-16)

- SET 10 opens the FLR pages. The FLR chapter owns the way in and out (`/kln90b/pages/flr/`, its opening section)
  and has the screen `pages/set/set-10-failures` (SET 10 with the cursor on `FAILURES?`), which the SET chapter may show.
  The SET chapter says one sentence and links. The existing screen `pages/set/set-10` still has placeholder field
  explanations.
- After a loss of the unit's memory SET 2 takes a date only until the unit has a position (Simulated failures,
  `#the-battery`).

### From the package power-on (2026-11-17)

- Power-on and initialization, `#initializing-the-position-and-the-time`, owns the task of correcting the position
  on SET 1 and the date and time on SET 2, with procedures and the screens `pages/set/set-1-latitude-entry` and
  `pages/set/set-2-date-entry`. The SET chapter explains the pages and fields and links there for the task.
- SET 2 takes no date and no time once the unit has a position; the cursor skips them. The Self Test page still takes
  them until it is approved.
- Suspected and not verified: `CONFIRM?` on SET 1 still sets the position while the unit has one
  (`pages/left/Set1Page.tsx:104-114`), and the next calculation replaces it with the measured one. Check before the
  chapter says anything about it.
- A date on SET 2 that moves the database from current to expired or back posts `RECYCLE POWER TO USE`
  `CORRECT DATA BASE DATA`.

### From the package waypoints (2026-11-17)

- SET 0 shows the database cycle status again, behind `UPDATE PUBLISHED DB`, and loads nothing (check in
  `pages/left/Set0Page.tsx`). Link `/kln90b/operation/waypoints/#the-database` for the cycle and its expiry.
- `RECYCLE POWER TO USE` (with the database out of date) comes from a date entered on SET 2, not from the Self Test
  page; Waypoints and the database owns it (`#recycle-power-to-use`). SET 2 links there.

## Changes to earlier pages

The pages that named a SET page before this chapter existed link to it by the page links; the seam check verifies
that every SET heading the page links need exists.
