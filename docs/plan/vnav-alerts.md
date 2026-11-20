# Package: vnav-alerts (VNAV; Airspace and altitude alerting)

Two Operation pages around altitude. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research.

## Pages

Settled by the package session (2026-11-20) after its research. Anchors in parentheses.

### VNAV (`operation/vnav.mdx`, `sidebar.order` 10), Opus

1. Summary: VNAV gives an advisory altitude along a straight descent or climb path to a selected altitude at a
   waypoint (or an offset before it); it flies nothing.
2. What VNAV does (`#what-vnav-does`): the path, the offset point where it ends, the advisory altitude, climbs as
   well as descents. Drawing `VnavPath.astro`: the path from where it starts to the selected altitude at the offset
   before the waypoint, the angle, the aircraft at its altitude.
3. Setting up a descent or a climb (`#setting-up-a-descent-or-a-climb`): the procedure on NAV 4 (selected altitude,
   waypoint, offset, angle); with no altitude input, the `FR` altitude entered by hand
   (`#vnav-without-an-altitude-input`).
4. Starting VNAV (`#starting-vnav`): the cursor arriving on the angle starts VNAV at the shown angle, a typed angle
   arms it; armed and active.
5. Flying the vertical path (`#flying-the-vertical-path`): the states on NAV 4 and in field 1 of Super NAV 5, the
   countdown in the last 10 minutes, the advisory altitude; `VNV ALERT` in its own section (`#vnv-alert`).
6. The angle (`#the-angle`): range, how the unit computes it, `0.0` for 10° or more (kln90b#501, comment already in
   the NAV 4 fields), the required vertical speed; CAL 4 as the calculator, one sentence and the link.
7. Which waypoint VNAV can use (`#which-waypoint-vnav-can-use`), with `INVALID VNV` (`#invalid-vnv`).
8. When VNAV ends (`#when-vnav-ends`): at the offset point; a sequence past the waypoint, a direct-to elsewhere, OBS
   mode, a deleted waypoint; a changed entry disarms; a power cycle clears everything.
9. Links on.

### Airspace and altitude alerting (`operation/alerts.mdx`, `sidebar.order` 14), Sonnet

1. Summary.
2. The ALT page (`#the-alt-page`), shown and explained here: the <kbd>ALT</kbd> button opens it with NAV 4 on the
   right, how both close, the cursor (off when nothing can be changed), the page without altitude alerting.
3. The baro setting (`#the-baro-setting`): the units (SET 7), range, kept while off, read-only where the aircraft
   supplies it, not the aircraft's altimeter, what uses it; `PRESS ALT TO SET BARO`: one sentence and the link to
   Non-precision approaches (`#press-alt-to-set-baro`).
4. Altitude alerting (`#altitude-alerting`, Availability box): the selected altitude (NAV 4), ALERT and WARN on the
   ALT page, the stages and their tones (`#the-alert-tones`), the volume (SET 9), tones only and no sign on the screen
   (the one Good to know box, if the writer needs one).
5. The height above airport alert (`#the-height-above-airport-alert`, Availability box; SET 5).
6. The airspace alert (`#the-airspace-alert`): which airspaces, the 10 minutes ahead and the 2 NM, the vertical
   buffer, silent in the approach modes, without an altitude input, turning it off (SET 8). Drawing
   `AirspaceAlert.astro`: the track ahead, the 2 NM, the buffer above and below an area. The messages each in a
   section of their own: `#airspace-alert` and `#inside-spc-use-airspace`.
7. Links on.

## Screens

Planned (ids below `kln90b/screens/`):

- VNAV: `vnav/nav-4-armed` (`VNV ARMED`), `vnav/nav-4-countdown` (`VNV IN` and the time), `vnav/nav-4-active` (the
  advisory altitude); `vnav/super-nav-5-field-1` if field 1 is staged with VNAV (optional); `vnav/vnv-alert` (the
  message on the MSG page) if stageable; `vnav/invalid-vnv` (status line, both halves).
- Alerts: `alerts/alt-page` (with altitude alerting), `alerts/alt-page-no-alerting`; `alerts/airspace-alert` and
  `alerts/inside-spc-use-airspace` (the MSG page, near a Class B or C area of the extract) if stageable.

## Topics this package owns

See the index: VNAV; the ALT page, the barometric setting, the selected altitude, altitude alerting, the height
above airport alert; the airspace alert.

## Where to look

`services/Vnav.ts`, `pages/left/Nav4Page.tsx`, `Cal4Page.tsx`, `services/AltAlert.ts`,
`services/HtAboveAirportAlert.ts`, `services/AudioGenerator.ts`, `pages/left/AltPage.tsx`, `Set5Page.tsx`,
`Set7Page.tsx`, `Set8Page.tsx`, `Set9Page.tsx`, `data/navdata/AirspaceAlert.ts`, `data/MessageHandler.ts`,
`pages/MainPage.tsx` (the ALT button); tests `test/unit/services/Vnav.test.ts`, `VnavObs.test.ts`,
`AltAlert.test.ts`.

## Notes from other packages

From the package power-on: tones need an audio output of the aircraft (maintainer, 2026-11-16, about the beeps of
the self test); the researcher checks whether the same holds for the altitude alert tones, and the page says it
with that condition.

### From the package controls (2026-11-17)

- **The ALT page and NAV 4** open together (ALT on the left, NAV 4 on the right). With the cursors off, a step of a
  left knob closes both; a step of a right knob closes only NAV 4 and moves the right page, and the ALT page stays
  (`pages/MainPage.tsx`, `popRightPage`, `parentRemoved`; `pushLeftPage(altPage, null)`). Controls and display says
  this in general under the pages that no knob reaches; this page owns when the ALT page's cursor stays off.

### From the package nav-pages (2026-11-18)

- NAV 4 (`/kln90b/pages/nav/#nav-4-altitude-and-vnav`) explains its fields only and links VNAV and this page. Its field
  explanations name the VNAV states (`V OFF`, `V ARM`, `VNV ARMED`, `VNV IN`, the advisory altitude) and the
  angle that starts nothing while VNAV is armed or active; once VNAV owns the 10 minutes and the 100 ft steps, the NAV
  chapter (NAV 4 and field 1 of Super NAV 5) keeps only the reference and the link. Stage NAV 4 with `VNV ARMED`,
  `VNV IN` and an advisory altitude here; the NAV chapter could not.
- NAV 4 `ANGLE` shows `0.0` for a computed angle of 10° or more (`services/Vnav.ts`, `getAngle`), and the cursor on
  it then starts nothing; the maintainer was asked whether it is a bug (nav-pages report).
- The <kbd>ALT</kbd> button shows NAV 4 on the right side; the NAV chapter says so in one sentence and links
  `/kln90b/operation/alerts/`.
- NAV 4's labels and editability (`IND`/`SEL` or `FR`/`TO`) are set when the page is selected
  (`pages/left/Nav4Page.tsx:47,49,62`) and do not follow an altitude input that fails or returns while it is shown; a
  low-impact inconsistency, not filed.

## Changes to earlier pages

- The NAV chapter's NAV 4 section, field 1 of Super NAV 5 and the NAV 4 field explanations: the 10 minutes and the
  advisory altitude's details go to VNAV; they keep the reference and the link. The seam check sharpens the links to
  sections.
- Power-on and initialization: the five beeps of the approval sound only where the unit is installed with altitude
  alerting as well as given a sound output (`services/AudioGenerator.ts:46-48`, `pages/right/SelfTestRightPage.tsx:149`;
  researcher of alerts, 2026-11-20). Say it in pilot terms, linking `#altitude-alerting`.
- GPS reception and RAIM links the baro setting to the page; the seam check sharpens it to `#the-baro-setting`.
