# Package: flight-plan-pages (the D/T, REF and CTR chapters)

Written 2026-11-20 by two writers in parallel (D/T; REF and CTR), each reviewed in two rounds. The sections below
are as written.

## Topics this package owns

Only the pages and their fields. Links instead of explanations: page pairs (Controls and display, `#page-pairs`);
reference and center waypoints as tasks, the computation and the duplicate on a recompute (Flight plans,
`#reference-waypoints`, `#center-waypoints`); the waypoints the unit makes and deletes by itself and `USR DB FULL`
(User waypoints); times, time zones and the flight timer as tasks (Trip planning and calculators, planned, page link
only); how FPL 0 scrolls (FPL chapter, `#the-fpl-pages-waypoints-in-a-list`).

## Pages

### D/T pages (`pages/dt.mdx`, `sidebar.order` 13)

- `#the-dt-pages-beside-the-left-page`: the page pair in one paragraph and the link.
- `#dt-1-distance-and-estimated-time-en-route`, with `#dt-1-beside-an-fpl-page` (FPL 0, a numbered flight plan)
  and `#dt-1-beside-any-other-page` (the active waypoint and the destination waypoint).
- `#dt-2-estimated-time-of-arrival`, with `#dt-2-beside-an-fpl-page`, `#dt-2-beside-any-other-page`,
  `#the-time-zone` (the field; the list and the task are Trip planning's).
- `#dt-3-desired-track`, with `#dt-3-beside-an-fpl-page`, `#dt-3-beside-any-other-page` (active and next waypoint).
- `#dt-4-flight-times`: the fields; the flight timer in one sentence with the links.
- `#dashes-and-blank-rows`: groundspeed, no active waypoint, a direct-to outside the plan, before NAV ready, and the
  NAV flag (the `kln90b#TBD` paragraph).
- `#where-the-dt-pages-are-used`.

Screens `pages/dt/`: `dt-1-fpl-0`, `-fpl-0-stopped`, `-fpl-0-direct-to`, `-fpl-0-long`, `-fpl-0-no-active`,
`dt-1-fpl-1`, `dt-1-other`, `dt-2-fpl-0`, `dt-2-other`, `dt-2-cursor`, `dt-3-fpl-0`, `dt-3-other`, `dt-4`; the
shared route is in `pages/dt/states.ts`.

### REF page (`pages/ref.mdx`, `sidebar.order` 11)

- `#ref-page-a-waypoint-on-the-plan-abeam-another`, with `#display-desired-fpl-on-left-page` and `#invalid-ref`.
- `#where-the-ref-page-is-used`.

Screens `pages/ref/`: `ref-entry`, `ref-no-fpl`, `ref-invalid`; the approval is `flight-plans/ref-approve`.

### CTR pages (`pages/ctr.mdx`, `sidebar.order` 10)

- `#ctr-1-computing-center-waypoints`, with `#display-desired-fpl-on-left-page`, `#not-enough-room-in-fpl`,
  `#a-crossing-without-a-waypoint`.
- `#ctr-2-the-center-waypoints-one-by-one`, with `#no-ctr-waypoints`.
- `#where-the-ctr-pages-are-used`.

Screens `pages/ctr/`: `ctr-1-prompt`, `ctr-1-no-fpl`, `ctr-1-not-enough-room`, `ctr-2`, `ctr-2-none`; the count
and the complete state are `flight-plans/ctr-computed` and `flight-plans/ctr-complete`.

## Screens that could not be staged as planned

- D/T before NAV ready: the generator cannot boot the unit cold; the text describes it without a screen.
- CTR 2 with a center waypoint that the plan already holds: a recompute never lists one (the duplicate bug), so
  the state the code would draw cannot be reached.
- CTR 2 without waypoints (`NO CTR WAYPOINTS`) is drawn as the code draws it; the code calls its layout a guess, and
  the reviewer found no evidence of how the real unit shows it.

## Changes to earlier pages

Made in this package and reviewed: the field explanations of `display/page-pair-fpl-0-dt-1` (D/T 1 beside another
page; numbered plans), `flight-plans/ctr-computed` and `flight-plans/ref-approve`; Flight plans
`#reference-waypoints` and `#center-waypoints` (the term reference waypoint, deletion at power-off and power-on, the
void rule, the duplicate on a recompute); FPL chapter, the scrolling of FPL 0; Controls and display `#page-pairs`
(CTR 2 follows the left page too). The generator names the Centers so that CTR 2 shows their abbreviations
(`kln90b/generator/lib/navdata.ts`, `boundaryOf`).

## Issues

- kln90b#506: D/T 1 to D/T 3 under the NAV flag (`#dashes-and-blank-rows`); the issue also carries the question
  whether the first waypoint's row before NAV ready is blank or dashed.
- kln90b#508: the duplicate center waypoint on a recompute (Flight plans, `#center-waypoints`).
- kln90b#507: a reference waypoint approved into a full FPL 0 skips the question to make room. Not confirmed on a
  screen, so no page describes it; when it is confirmed or fixed, Flight plans (`#the-question-to-make-room-in-fpl-0`)
  says it in one sentence.
