# Package: vnav-alerts (VNAV; Airspace and altitude alerting)

Two Operation pages around altitude. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research.

## Pages

As written (2026-11-20).

### VNAV (`operation/vnav.mdx`, `sidebar.order` 10)

Summary; `#what-vnav-does` (the drawing `VnavPath.astro`, the baro setting's effect); `#setting-up-a-descent-or-a-climb`
(the procedure on NAV 4, the Good to know box on the offset of at least 1 NM) with `#vnav-without-an-altitude-input`;
`#starting-vnav`; `#flying-the-vertical-path` (the states as NAV 4 and field 1 of Super NAV 5 show them, the only
place of the 10 minutes) with `#vnv-alert` (the only place of the 90 seconds); `#the-angle` (the 9.9°, `0.0` with
kln90b#501, CAL 4); `#which-waypoint-vnav-can-use` (procedure waypoints included; a direct-to to a waypoint of FPL 0
keeps VNAV to a later one) with `#invalid-vnv`; `#when-vnav-ends` (the offset point, sequencing, direct-to, OBS mode,
a deleted waypoint, a changed entry, the offset `00` at a waypoint the unit does not sequence past, the NAV flag,
power-on); `#where-to-go-next`.

### Airspace and altitude alerting (`operation/alerts.mdx`, `sidebar.order` 14)

Summary; `#the-alt-page` (shown and explained here, the cursor, opening and closing with NAV 4); `#the-baro-setting`
(`PRESS ALT TO SET BARO` as a link); `#altitude-alerting` (Availability box, the warn altitude) with `#the-aural-alarm`
(the tones and the one Good to know box) and `#the-altitude-deviation-alert`; `#the-height-above-airport-alert`
(Availability box, the offset height); `#the-airspace-alert` (the drawing `AirspaceAlert.astro`, which airspaces,
the vertical buffer, silent in the approach modes, SET 8) with `#airspace-alert` and `#inside-spc-use-airspace`;
`#where-to-go-next`. SET 5, SET 8 and SET 9 are named and their settings explained; the SET chapter shows the pages.

## Screens

`vnav/nav-4-armed`, `vnav/nav-4-countdown`, `vnav/nav-4-active`, `vnav/super-nav-5-field-1`, `vnav/vnv-alert`,
`vnav/invalid-vnv` (shared state in `vnav/vnav-state.ts`); `alerts/alt-page` (both halves, the arrow pointing to the selected altitude on NAV 4; maintainer, 2026-11-20), `alerts/alt-page-off`,
`alerts/alt-page-millibars`, `alerts/airspace-alert`, `alerts/inside-spc-use-airspace` (shared state in
`alerts/states.ts`).

Not staged: the ALT page of an installation without altitude alerting (it looks like `alerts/alt-page-off`; only the
cursor differs); the tones (no sound on the site). Near KSEA the extract's Class B shelves overlap and give one message
per shelf; the message screens are staged where one shelf applies.

## Where to look

`services/Vnav.ts`, `pages/left/Nav4Page.tsx`, `Cal4Page.tsx`, `services/AltAlert.ts`,
`services/HtAboveAirportAlert.ts`, `services/AudioGenerator.ts`, `pages/left/AltPage.tsx`, `Set5Page.tsx`,
`Set7Page.tsx`, `Set8Page.tsx`, `Set9Page.tsx`, `data/navdata/AirspaceAlert.ts`, `data/MessageHandler.ts`,
`pages/MainPage.tsx` (the ALT button); tests `test/unit/services/Vnav.test.ts`, `VnavObs.test.ts`,
`AltAlert.test.ts`.

## Notes from other packages

All used by this package (2026-11-20).

## Issues filed

kln90b#514 to kln90b#520 (2026-11-20), each with its comment on the paragraph that describes it.

## Changes to earlier pages

Made by the seam check (2026-11-20) and reviewed: the NAV chapter's NAV 4 section, field 1 of Super NAV 5 and the NAV 4
field explanations cut to the reference and the link; Power-on (the approval beeps need altitude alerting as well as a
sound output; the baro item and the Self Test screen's baro field linked); Controls and display (the ALT button and
the ALT page cursor linked); GPS reception and RAIM and Non-precision approaches linked to `#the-baro-setting`.
