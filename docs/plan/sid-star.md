# Package: sid-star (SID and STAR procedures; DME arcs)

Done 2026-11-20. Two Operation pages. DME arcs got a page of their own (maintainer, 2026-11-20): the unit handles
them unlike other navigators, pilots are surprised by them and search for them, and SID and STAR procedures and
Non-precision approaches both link there.

## Pages as written

### SID and STAR procedures (`operation/departures-arrivals.mdx`, `sidebar.order` 8)

- Summary: the transition rule and the procedure header.
- `#which-procedures-the-unit-offers`; `#what-the-unit-keeps-of-a-procedure` (legs to no waypoint, holds and
  procedure turns, restrictions; DME arcs in one sentence and the link).
- `#loading-a-sid`, `#loading-a-star`: the task and a short procedure; the lists, the skipped steps and the questions
  stay on APT 7 (`/kln90b/pages/apt/#selecting-a-sid-or-a-star`, `#questions-before-the-load`). The approach rules
  (transition, IAF) in one sentence and the link.
- `#a-transition-must-be-selected` with `#redundant-wpts-in-fpl`.
- `#where-the-procedure-goes-in-fpl-0` (round trip: kln90b#480).
- `#the-procedure-in-fpl-0`: the procedure header formats.
- `#the-question-to-make-room-for-a-procedure`.
- `#changing-a-procedure`, `#deleting-a-procedure`, `#editing-the-waypoints-of-a-procedure`.
- `#flying-a-sid-or-a-star` with `#if-required-select-obs`.
- Where to go next.

### DME arcs (`operation/dme-arcs.mdx`, `sidebar.order` 8.5)

- Summary: the unit flies an arc as a curved leg; its first waypoint is computed once, where you were when you
  selected the procedure; you move it to join the arc where you are.
- `#arcs-in-a-procedure`.
- `#the-dme-arc-waypoint` (drawing `DmeArcEntry`; the Good to know box: select the procedure again near the arc)
  with `#the-name-of-a-dme-arc-waypoint`.
- `#moving-the-dme-arc-waypoint` (drawing `DmeArcMove`; Super NAV 5) with `#move--in-fpl-0` (approach arcs only,
  Availability box, kln90b#509) and `#no-intrcept`.
- `#flying-the-arc` (the course messages on an arc; the autopilot in an Availability box) with
  `#distance-time-and-bearing-on-the-arc`, `#nav-2-and-super-nav-5-on-an-arc`, `#leaving-the-arc`.
- `#an-arc-in-obs-mode` (the selected course depends on the installation).
- `#the-dme-arc-waypoint-as-a-waypoint` (the SUP page, the user database, editing: kln90b#510, #511, #512).
- Where to go next.

## Screens

All staged. `sid-star/`: `change-sid`, `change-sid-apt-7`, `delete-sid`, `duplicates`, `make-room`,
`redundant-wpts`, `select-obs`, `star-header` (helper `states.ts`). `dme-arcs/`: `gromo4-waypoints`, `fpl-0-arc`,
`act-arc-waypoint`, `nav-1-arc`, `nav-2-arc`, `nav-2-arc-ahead`, `super-nav-5-arc`, `super-nav-5-move`,
`fpl-0-moved`, `fpl-0-move-approach`, `no-intrcept`, `nav-3-obs` (helper `states.ts`).

Not staged: the make-room question with more than one waypoint to delete (only `WPT   1` with real data); a STAR with
a DME arc (the FAA extract has none; STAR arcs are described from the shared code). `REDUNDANT WPTS IN FPL` is a
one-time message, so its screen shows the plain `MSG` after it is read.
