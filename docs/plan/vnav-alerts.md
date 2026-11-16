# Package: vnav-alerts (VNAV; Airspace and altitude alerting)

Two Operation pages around altitude. Pointers come from the planning survey of the code (paths relative to
`vendor/kln90b/kln90b/`); they are not checked facts. Screens are planned by the session after its research.

## Pages

### VNAV (`operation/vnav.mdx`), Opus

1. Summary: advisory only.
2. Setting up a descent or a climb to a waypoint on NAV 4.
3. What the unit shows before and during the vertical path; the message that announces it.
4. VNAV along the flight plan and after a direct-to; what ends it or resets its values.
5. The angle and the vertical speed: CAL 4 as the calculator (link).
6. Links on.

### Airspace and altitude alerting (`operation/alerts.mdx`)

1. Summary.
2. The ALT page (shown and explained here): the barometric setting, where it comes from, the units (SET 7).
3. Altitude alerting (Availability box): the selected altitude, the stages of the alert and their tones, the volume
   (SET 9).
4. The height above airport alert (Availability box; SET 5).
5. The airspace alert: when the unit warns, the vertical buffer, turning it off (SET 8), the messages, when it is
   silent.
6. Links on.

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

## Changes to earlier pages

The NAV chapter's NAV 4 section links to these pages; the seam check sharpens those links.
