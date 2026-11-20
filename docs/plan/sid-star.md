# Package: sid-star (SID and STAR procedures; DME arcs)

Two Operation pages. APT 7 of the page reference is written. DME arcs got a page of their own (maintainer,
2026-11-20): the unit handles them unlike other navigators, pilots are surprised by them and search for them, and
SID and STAR procedures and Non-precision approaches both link there.

## Pages

### SID and STAR procedures (`operation/departures-arrivals.mdx`, `sidebar.order` 8)

The slug stays, because pages link to it; the title is "SID and STAR procedures". Requirements: style guide,
section 17 ("SID and STAR procedures and approaches").

1. Summary.
2. `#which-procedures-the-unit-offers`: what the lists leave out and what to do then.
3. `#what-the-unit-keeps-of-a-procedure`: legs that end at no waypoint, holds and procedure turns, restrictions;
   DME arcs in one sentence and the link to DME arcs.
4. `#loading-a-sid`, `#loading-a-star`: the task, when you do it, the short procedure; the lists, the skipped
   steps and the questions stay on APT 7 (`/kln90b/pages/apt/#selecting-a-sid-or-a-star`,
   `#questions-before-the-load`), linked. One SID and one STAR in FPL 0 at a time; the replace question for any
   airport.
5. `#a-transition-must-be-selected`: the rule, stated plainly; the duplicates and how to delete them;
   `#redundant-wpts-in-fpl` (the message, its section of its own).
6. `#where-the-procedure-goes-in-fpl-0`: SID after its airport, STAR before it and before an approach, an added
   airport; the round trip (kln90b#480, the comment on the paragraph).
7. `#the-procedure-in-fpl-0`: the header formats; the waypoints count against the legs of FPL 0; procedures live
   in FPL 0 only (one sentence and the link to Flight plans `#procedures-in-the-flight-plan`). Suffixes appear on
   approach rows only and belong to Non-precision approaches.
8. `#the-question-to-make-room-for-a-procedure`: when it appears, what it shows, the choices, `FPL FULL` when no room
   can be made.
9. `#changing-a-procedure` (`CHANGE SID?`), `#deleting-a-procedure` (`DELETE SID?`),
   `#editing-the-waypoints-of-a-procedure` (SID and STAR rows can be inserted and deleted; an approach refuses, one
   sentence and the link).
10. `#flying-a-sid-or-a-star`: what you fly by hand, sequencing; `#if-required-select-obs` (section of its own);
    what the unit forgets while off (one sentence and the link to Power-on).
11. Where to go next.

### DME arcs (`operation/dme-arcs.mdx`, `sidebar.order` 8.5)

1. Summary: the unit flies an arc as a curved leg, but its start is a DME arc waypoint that the unit computes once,
   from where the aircraft is when you select the procedure; to join the arc where you are, you move that waypoint.
2. `#arcs-in-a-procedure`: which legs become arcs (SID, STAR, approach), the published start fix replaced by the
   DME arc waypoint, arcs merged around one VOR.
3. `#the-dme-arc-waypoint`: when and where the unit computes it (abeam: nearest point; otherwise the published
   start), `#the-name-of-a-dme-arc-waypoint`. A drawing of the computation. The Good to know box: a procedure
   selected on the ground or far away keeps its waypoint where the aircraft was then.
4. `#moving-the-dme-arc-waypoint`: `MOVE ?` on Super NAV 5 (every arc) and in FPL 0 (approach arcs only, in the
   Availability box), what the move does with the present track; a drawing; `#no-intrcept`.
5. `#flying-the-arc`: the leg to the waypoint is straight; on the arc DTK is the tangent and XTK the distance from
   the arc; DIS, ETE and BRG are direct to the end fix (a gotcha); NAV 2 shows the arc's VOR, Super NAV 5 the
   radial; leaving the arc.
6. `#an-arc-in-obs-mode`.
7. `#the-dme-arc-waypoint-as-a-waypoint`: the SUP page as its ACT page, the user database, deleted at a power-on
   when unused; editing arc rows of a SID or STAR (current behavior).
8. Where to go next.

## Screens

Planned; the writers settle the ids. Real places only (KYKM, GROMO4 with the arc around YKM; an approach at KYKM for
the approach arc).

- SID and STAR procedures: `sid-star/change-sid` (cursor on a header), `sid-star/delete-sid`, `sid-star/make-room`
  (the question for a procedure), `sid-star/redundant-wpts` (the message), and FPL 0 after a load (reuse
  `pages/fpl/fpl-0-procedures` where it fits). APT 7 screens are reused, not duplicated.
- DME arcs: the APT 7 waypoints with the DME arc waypoint (`dme-arcs/gromo4-waypoints`), FPL 0 with the arc,
  the DME arc waypoint on its ACT page, NAV 2 on the arc, Super NAV 5 on the arc, `MOVE ?` on Super NAV 5, `MOVE ?`
  in FPL 0 on an approach arc, `NO INTRCEPT` (both halves), FPL 0 after a move.
- Drawings: `DmeArcEntry.astro` (where the waypoint is computed, abeam and not abeam), `DmeArcMove.astro` (the
  present track meeting the arc).

## Changes to earlier pages

- APT chapter (writer of SID and STAR procedures): "Where the procedure goes in FPL 0" and "What the unit keeps of a
  procedure" cut to a sentence and the link; the DME arc bullet to a sentence and the link to DME arcs; the claim
  that `IF REQUIRED SELECT OBS` comes in leg mode only, and that an arc start is moved "from FPL 0", corrected by the
  cut; APT 8's sentence that refers to APT 7 for what the unit keeps points to the new owners.
- FPL chapter, NAV chapter, User waypoints (writer of DME arcs): the links about DME arcs go to DME arcs instead of
  Non-precision approaches; `MOVE ?` in FPL 0 is for approach arcs only.

## Notes from other packages

- From the package apt, filed as kln90b#480: a STAR or an approach is inserted before the first occurrence of the
  airport, which puts it at the start of a round trip. The page describes the current behavior.
- The maintainer's findings on the route of Tutorial flight 2 (style guide, section 17) show the rules at work.
- Staging: after an approach is loaded in an approach-installed unit, a pending `PRESS ALT TO SET BARO` blocks
  every later step. It clears after pressing ALT, waiting about 2 seconds with the ALT page shown, and pressing ALT
  again (FPL writer, 2026-11-19).
- The FPL chapter (`#procedure-headers`) shows the headers in one sentence; the screens `pages/fpl/fpl-0-procedures`,
  `fpl-0-approach`, `fpl-0-approach-end` and the helper `loadProcedures` in `screens/pages/fpl/states.ts` stage
  procedures in FPL 0.
