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
`SET-10-Page.md`. The screen `set-3-cursor` of the Quickstart exists; reuse or replace.

## Notes from other packages

- From the package getting-started: SET 0 follows SET 10 in the knob order; while it is shown, the status line
  shows no mode and no right page name.
- From the planning survey: SET 5 and SET 9 show a text instead of their fields where the installation has no
  altitude alerting; SET 0 has no loader behind it in the simulation, and the chapter says what the pilot sees and
  no more (style guide, section 3).

## Changes to earlier pages

The pages that named a SET page before this chapter existed link to it by the page links; the seam check verifies
that every SET heading the page links need exists.
