# Package: approaches (Non-precision approaches)

One large and intricate Operation page; it runs on Opus. Pointers come from the planning survey of the code (paths
relative to `vendor/kln90b/kln90b/`); they are not checked facts. Screens and drawings are planned by the session
after its research.

## Pages

### Non-precision approaches (`operation/approaches.mdx`)

Requirements: style guide, section 17 ("SID and STAR procedures and approaches"). The page opens with the
Availability box for an approach-certified installation (APT 8 exists only then). Planned by the package session
(2026-11-20) from the research; anchors are the headings' slugs.

1. Summary: the unit flies the lateral path of an RNAV (GPS) or overlay approach, which you load on APT 8; it arms
   within 30 NM and becomes active just before the FAF.
2. `## Which approaches the unit offers`: the approaches APT 8 lists and those it drops (ILS, LOC, LOC back course,
   LDA, SDF; RNAV without LNAV minima, RNP AR, any RF leg). **A Good to know box (maintainer, 2026-11-20):** ILS
   approaches are deliberately not in the database; that is how the real unit works and is correct, not a missing
   feature, however much a modern navigator leads a pilot to expect them. APT 2 still lists the airport's ILS
   frequencies. An airport with only excluded approaches shows `NO APPROACH FOR THIS AIRPORT IN DATABASE` (APT
   chapter owns the page state; one sentence and the link). Screen: APT 8 of KOLM, where the ILS 17 and LOC 17 are
   missing from the list.
3. `## Loading an approach`: the procedure on APT 8, with screens of the IAF selection and the preview. Then
   `### An approach starts only at an IAF` and the transition rule, both stated plainly (style guide, section 17;
   SID and STAR procedures owns `#a-transition-must-be-selected` and `REDUNDANT WPTS IN FPL`, linked). Replacing a
   loaded approach (the question, staged). Where it goes in FPL 0 and the make-room question: one sentence each and
   the links to SID and STAR procedures.
4. `## The approach in FPL 0`: the approach header, the suffixes of approach waypoints (which letters, which
   waypoints), the fence after the MAP. Screen: FPL 0 with the KOLM approach. `### INVALID ADD and INVALID DEL`
   with an excerpt screen. Editing otherwise: link to SID and STAR procedures.
5. `## Arming the approach`: within 30 NM of the airport, or with the GPS APR switch at any distance (`NO APPROACH`
   without one); the switch in arm mode disarms; `PRESS ALT TO SET BARO` on each arming; the ARM annunciator. The
   arm modes stay armed at any distance once armed (code; open question to the reviewer).
   `### ARM GPS APPROACH` (disarmed, FAF active, within 3 NM), with a screen.
6. `## Activating the approach`: the conditions (Approach Arm-Leg mode, FAF active, within 2 NM, MAP ahead, track
   within 110° of the final course, the RAIM check); Approach Arm-OBS mode never activates; what returns the unit
   to arm mode (a direct-to, the GPS APR switch). Reuse `navigation/apr-leg` or stage it on KOLM.
7. `## The CDI scale along the approach`: the sequence over the approach (ramp to 1 within 30 NM over about 30 s,
   then from the activation point to 0.3 at the FAF, 0.3 to the MAP and after, back to 1 or 5 on leaving) with
   **a drawing** (style guide, section 16). The factors themselves: Modes of operation, `#the-cdi-scale-factor`.
8. `## RAIM in an approach`: what the unit checks at activation (now, and predicted at the FAF and the MAP), the
   retry, the flag in active mode. `### RAIM NOT AVAILABLE APR MODE INHIBITED` and `### PRESS GPS APR FOR NAV`, each
   with a screen of the message. RAIM itself: GPS reception and RAIM, `#raim`, `#predicting-raim`.
9. `## Flying the approach`: the worked example KSEA to KOLM RNAV (GPS) RWY 17 via CARRO, with screens where the
   pilot must recognize the state (armed, active). `### Vectors to final` (direct-to the FAF or the IF in FPL 0).
   `### Course reversals and holds in an approach` (what differs: Approach Arm-OBS mode never activates, back to
   leg mode; link `#if-required-select-obs`, which keeps the 4 NM). `### DME arcs in an approach` (the DME arc
   waypoint carries the IAF mark; nothing changes for arming; link DME arcs).
10. `## The missed approach`: waypoint alerting at the MAP (fly-over MAP: about 15 s, about 36 s without turn
    anticipation), no sequencing past it, the D-bar from the MAP, the direct-to whose default is the first missed
    approach waypoint (screen), arm mode after it, the hold at the MAHP. kln90b#493 with its hidden comment.
11. `## Changing or deleting an approach`: `CHANGE APR?` and `DELETE APR?` on the header (excerpt screens), the mode
    afterwards; what power-off does: one sentence and the link to Power-on.
12. `## Where to go next`.

### Screens

New screens go into `kln90b/screens/approaches/`; the writer names them. Planned: APT 8 of KOLM (list without ILS),
the IAF selection and preview, the replace question, FPL 0 with the approach, `INVALID ADD` or `INVALID DEL`,
`ARM GPS APPROACH`, Approach Arm-Leg and Approach Active-Leg on the KOLM approach (or the `navigation/` screens
reused), `APR MODE INHIBITED`, `PRESS GPS APR FOR NAV`, the unit at the MAP (FROM, fence), the Direct To page with
the first missed approach waypoint as default, `CHANGE APR?` and `DELETE APR?`. One drawing:
`ApproachCdiScale` in `kln90b/src/components/drawings/`.

## Topics this package owns

See the index: arming and activation, the approach modes, DME arcs, the missed approach, what the unit does not
fly; with SID and STAR procedures, the two rules.

## Where to look

`services/ModeController.ts` (arming, activation, the integrity check), `data/navdata/SidStar.ts` (the approach
legs), `data/flightplan/ActiveWaypoint.ts`, `data/navdata/NavCalculator.ts`, `pages/right/Apt8Page.tsx`,
`data/PersistentMessages.ts` (the approach messages); tests `test/render/services/ModeControllerApproach.test.ts`,
`test/flight/flights/dmeArc.test.ts`; the APT chapter's sections on APT 8.

## Notes from other packages

### From the package sta (2026-11-16)

GPS reception and RAIM says only that an approach needs RAIM, quotes the messages and links here. Its review moved
this out, because this page owns what RAIM decides in an approach. Pointers from the code (`services/ModeController.ts`,
`data/PersistentMessages.ts`, `Gps.ts`); check each before it is written:

- The unit makes an approach active only when RAIM is available now, against the limit of the approach, and is
  predicted for the FAF and the MAP at the times the aircraft reaches them. Otherwise it stays in the approach arm
  mode and posts the message whose lines are `RAIM NOT AVAILABLE`, `APR MODE INHIBITED`, `PREDICT RAIM ON STA 5`.
- After a refusal the unit checks again every 10 seconds while the aircraft is within 2 NM of the FAF. The message
  goes when the approach becomes active, when the unit leaves the approach arm mode, or when it stops checking.
- In the approach active mode the unit flags its navigation at once when the position is lost or RAIM finds an
  error, and after 2 minutes without RAIM (the code marks the 2 minutes with low confidence). It then posts
  `PRESS GPS APR FOR NAV`; the GPS APR button returns the unit to the approach arm mode, with navigation for the
  missed approach, and the message goes with the flag.
- `BAD SATELLITE GEOMETRY` `AND RAIM NOT AVAILABLE` is the message of the approach active mode for RAIM lost;
  `RAIM POSITION ERROR` `CROSS CHECK POSITION` also flags the navigation there.
- Official terms from the review: approach arm mode, approach active mode, the GPS APR button (style guide, word
  list).
- The STA chapter has a section "What the result means for an approach" under STA 5, and GPS reception and RAIM
  the anchors `#raim`, `#predicting-raim` and `#messages-of-the-receiver`; link there for RAIM itself.

- From the package apt: the text about the arming distance that the review cut from the APT chapter is in the git
  history (`docs/plan/apt.md`).
- The worked example uses an approach of the FAA extract; Tutorial flight 2 flies the RNAV (GPS) Y approach to
  runway 32L at Boeing Field, so this page takes another one.
- The word list has approach header, DME arc waypoint, suffix.

### From the package waypoints (2026-11-17)

- User waypoints names DME arc waypoints among the waypoints the unit makes (`#waypoints-the-unit-creates-by-itself`)
  and links here for how they are named (`SidStar.ts`; the names were not staged).

### From the package nearest-direct-to (2026-11-18)

- A direct-to sets approach active mode back to approach arm mode; Direct-to says it in one sentence and links here.
- kln90b#493: a direct-to to the default waypoint after the MAP goes
  to the first occurrence of a waypoint FPL 0 holds twice, so where the missed approach holding fix is also an IAF the
  unit goes back into the approach (`pages/left/DirectToPage.tsx:107-111`, `data/flightplan/ActiveWaypoint.ts:173`).
  Describe the current behavior with the `kln90b#493` comment.

### From the package navigation (2026-11-18)

- Modes of operation names the approach modes by their official names (Approach Arm-Leg, Approach Arm-OBS, Approach
  Active-Leg) and gives arming and activation one sentence each with the link to this page; its screens
  `navigation/arm-leg`, `arm-obs` and `apr-leg` (a direct-to JALON on the RNAV 34L of KSEA, 1.5 NM before it; arming
  raises `PRESS ALT TO SET BARO`, answered with ALT) may be reused. The CDI scale factors and their automatic
  changes are owned by Modes of operation, `#the-cdi-scale-factor`; this page links there.
- Research facts (`services/ModeController.ts`): the unit arms within 30 NM of the airport of the approach in FPL 0,
  or at any distance with the GPS APR switch (`NO APPROACH` without one); the GPS APR switch in arm mode disarms until
  the next press or a change of approach; the approach becomes active from Approach Arm-Leg mode only, with the FAF
  active, within 2 NM of it, the track within 110° of the final course and integrity; a direct-to or the GPS APR
  switch in active mode returns to arm mode. Approach Arm-OBS mode never becomes active.
- At the MAP the waypoint alert starts about 20 seconds before where a turn would begin, though no turn follows
  (`data/navdata/NavCalculator.ts:314`, the MAP excluded from turns at :281). Sequencing says the unit does not
  sequence past the MAP and links here; holds and the procedure turn are this page's.
- `pages/apt.mdx` says "within 4 NM of it in leg mode" for `IF REQUIRED SELECT OBS`; that number is this page's:
  say it here and cut APT to the event and the link.
- An approach loaded through the EFB route in an installation without APT 8 is armed within 30 NM (part of the open
  kln90b#479).

### From the package nav-pages (2026-11-18)

- NAV 1 in approach active mode: when the unit loses its integrity, the page goes to `F L A G` and `DIS`, `ETE`,
  `BRG`, `DTK` and `FLY` show dashes; the NAV chapter says so and links `/kln90b/operation/approaches/`.
- NAV 2 shows the VOR of a DME arc in place of the nearby VOR while an arc is active or ahead
  (`pages/left/Nav2Page.tsx`); Super NAV 5 draws the part of an arc before the point where you join it dashed, shows
  `ARC` in its field 3 and overrides field 2 on an arc. The NAV chapter states these; this package owns DME arcs and
  links back (`/kln90b/pages/nav/#nav-2-the-present-position`, `#the-left-side-of-super-nav-5`).
- Stage what the NAV chapter could not: NAV 2 on a DME arc, and the window of Super NAV 5 with `MOVE ?` after CLR on
  a DME arc waypoint (`SuperNav5DirectToSelector.tsx:86-109`); the NAV chapter's `#the-window` describes `MOVE ?` in
  one short paragraph that links here.
- With the `AUTO` range scale, Super NAV 5 draws the runway diagrams only at a range scale of 2 NM or less
  (`SuperNav5Page.tsx:299`, `:344`). The reviewer of nav-pages left open how close to the airport the diagram
  should appear with `AUTO`; the reviewer of this package checks it against the approach behavior.

### From the package flight-plans (2026-11-19)

- `MOVE ?` on a DME arc waypoint is listed among the delete-type questions of the FPL chapter
  (`#the-delete-questions`) with a link here; this page explains it.
- kln90b#479 (open): a route from the EFB loads an approach into a unit not installed for approaches; `CHANGE APR?`
  on its header then brings up an error page, `DELETE APR?` removes it. Flight plans (`#loading-a-route-from-the-efb`)
  describes it with the hidden comment; nothing needed here but the Availability box of approaches.

## Changes to earlier pages

- APT 8 (`pages/apt.mdx`): its 4 NM for `IF REQUIRED SELECT OBS` goes; SID and STAR procedures owns the number
  (`#if-required-select-obs`). APT 8's "Questions before the load and where the approach goes" is compared with this page and cut back where this
page now owns the text. The pages of the package sta get their link to this page sharpened to its RAIM section.

### From the package sid-star (2026-11-20)

- DME arcs have their own Operation page, `operation/dme-arcs` (maintainer, 2026-11-20). It owns every arc,
  approach arcs included: the DME arc waypoint, its name, `MOVE ?` in FPL 0 (approach arcs only) and on Super NAV 5,
  `NO INTRCEPT`, flying the arc. Non-precision approaches says what an arc means in an approach (the IAF on the arc,
  arming) in a sentence or two and links there.
- SID and STAR procedures owns `IF REQUIRED SELECT OBS` (`#if-required-select-obs`) and the holds and procedure
  turns the unit drops; this page says what differs in an approach and links.
- The suffixes of approach waypoints and `INVALID ADD` and `INVALID DEL` are approach topics (the code marks
  approach rows only and protects only them); this page owns them.
