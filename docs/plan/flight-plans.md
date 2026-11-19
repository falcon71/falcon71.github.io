# Package: flight-plans (Flight plans; the FPL chapter)

Done 2026-11-19. The research found the package large; it stayed one session with two writers in parallel, one per
page, owning different files and screens. The sections below are as written.

## Pages

### Flight plans (`operation/flight-plans.mdx`, `sidebar.order` 5)

The Operation page owns every task with flight plans. Screens under `flight-plans/`; the questions of the numbered
flight plans are shown with the FPL chapter's screens (`pages/fpl/fpl-1-use-question`, `-invert-question`,
`-load-question`, `-delete-question`).

- `#the-flight-plans-of-the-unit`: FPL 0 and FPL 1 to FPL 25, the limits, what is kept while the unit is off.
- `#creating-a-flight-plan`.
- `#adding-a-waypoint`, with `#adding-at-the-end`, `#inserting-in-front-of-a-waypoint`,
  `#taking-the-waypoint-of-the-right-page-into-a-flight-plan`.
- `#deleting-a-waypoint`.
- `#a-full-flight-plan`, with `#fpl-full` and `#the-question-to-make-room-in-fpl-0`.
- `#the-waypoint-type-identification-page` (screen `flight-plans/type-page`).
- `#activating-a-flight-plan`, with `#activating-a-flight-plan-inverted`.
- `#storing-fpl-0`.
- `#deleting-a-flight-plan`, with `#delete-fpl` (the Good to know box on the trap of CLR with the cursor off).
- `#flying-the-active-flight-plan`; `#editing-the-active-flight-plan`.
- `#procedures-in-the-flight-plan`: one paragraph and the link to SID and STAR procedures.
- `#reference-waypoints`, `#center-waypoints`: the tasks.
- `#loading-a-route-from-the-efb` and `#sending-fpl-0-to-the-efb`, each with a Simulator only box.
- `#where-to-go-next`.

### FPL pages (`pages/fpl.mdx`, `sidebar.order` 3)

- `#the-fpl-pages-waypoints-in-a-list`.
- `#fpl-0-the-active-flight-plan`, with `#the-active-leg-symbol`, `#procedure-headers`,
  `#fpl-0-during-a-direct-to-and-in-obs-mode`, `#an-empty-fpl-0`.
- `#fpl-1-to-fpl-25-numbered-flight-plans`, with `#use-invrt`, `#an-empty-numbered-flight-plan`.
- `#the-cursor-on-an-fpl-page`, `#the-delete-questions`.

## Screens that could not be staged as planned

- `pages/fpl/fpl-0-no-fix` (FPL 0 while the unit is not NAV ready) is staged by a receiver reset, because the
  generator settles every boot until the first fix; the screen looks the same as before the first fix after
  power-on.
- `flight-plans/type-page` builds its terminal waypoint (NNUTT of KPDX) in its steps through `u.navdata`, because
  the generator resolves every terminal fix that NASR also files to the NASR fix without its airport (site notes in
  the index).
- No screen for the EFB route load, the `WAYPOINT … DELETED` MSG page or sending FPL 0 to the EFB: the generator has
  no EFB.
- `USE?` during a direct-to: not staged; the page describes it from the code.

## Changes to earlier pages

From the seam check (2026-11-19): links to `/kln90b/operation/flight-plans/` and `/kln90b/pages/fpl/` on earlier
pages sharpened to the anchors above; old word forms replaced (see the index, "For the final pass").
