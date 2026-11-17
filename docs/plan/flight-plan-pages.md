# Package: flight-plan-pages (the D/T, REF and CTR chapters)

The right pages that work with a flight plan, written right after Flight plans. Pointers come from the planning
survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by
the session after its research.

## Pages

- **D/T pages** (`pages/dt.mdx`): D/T 1 to D/T 4. Each page in its two variants: with an FPL page on the left, and
  with any other page on the left. When rows show dashes or are left out. D/T 4 and the flight timer (the fields;
  the tasks are Trip planning and calculators', planned).
- **REF page** (`pages/ref.mdx`): the page, its states (no flight plan on the left, the entry, the result), what
  the unit refuses.
- **CTR pages** (`pages/ctr.mdx`): CTR 1 and its states, CTR 2 with one page per waypoint (`CTR+2`), what the unit
  refuses.

## Topics this package owns

Only the pages and their fields. Links instead of explanations: page pairs (Controls and display, `#page-pairs`);
reference and center waypoints as tasks, and the limits of a flight plan (Flight plans); user waypoints and the
waypoints the unit removes by itself (Waypoints and the database); times and the flight timer (Trip planning and
calculators, planned).

## Where to look

`pages/right/Dt1Page.tsx` to `Dt4Page.tsx` with their `Fpl` and `Other` variants, `RefPage.tsx`, `Ctr1Page.tsx`,
`Ctr2Page.tsx`, `CtrState.ts`, `services/Timers.ts`, `pages/left/FplPage.tsx` (`insertRefWpt`).

## Notes from other packages

From the planning survey: a comment in `Ctr2Page.tsx` says the layout of CTR 2 without waypoints is a guess. The
reviewer checks that state against the real manuals; if they show it differently, that is a kln90b bug.

### From the package controls (2026-11-17)

- **D/T 1 with an FPL page on the left** shows, for each waypoint of the flight plan, the cumulative distance and ETE
  from the present position, blank for waypoints already passed; the distance is the distance to the active waypoint
  plus the leg lengths (`pages/right/Dt1FplPage.tsx`, as read by the writer of Controls and display; check it). The
  screen `display/page-pair-fpl-0-dt-1` and its field explanations, shown on Controls and display `#page-pairs`, say this; the
  D/T chapter must agree with them or have them corrected in its review.
- Controls and display `#page-pairs` gives the general rule only; each of D/T, REF and CTR says in one sentence that
  it works with the left page, links there, and then gives its own variants.

- Cut from Controls and display: with a page other than an FPL page on the left, D/T 1 to D/T 3 show the active leg and
  the legs after it; REF and CTR show `DISPLAY DESIRED FPL ON LEFT PAGE` without an FPL page on the left. These are
  the chapters' own variants.

## Changes to earlier pages

None planned.
