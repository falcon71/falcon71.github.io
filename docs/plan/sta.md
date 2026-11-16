# Package: sta (the STA chapter; GPS reception and RAIM)

First package of the full run, at the maintainer's request: the STA pages are new and pilots need guidance for them.
The pages this package links to for the basics (Controls and display, Power-on, the message lists, Non-precision
approaches) are not written yet; it links to them by the planned anchors and page links of the index.

The pointers below come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`). They tell
the researcher where to look; they are not checked facts.

## Pages

### GPS reception and RAIM (`operation/gps-receiver.mdx`), Operation, new

Planned sections (the session settles them after the research):

1. Summary: the unit navigates only while its receiver has a position good enough, and it says on the STA pages and
   with messages how good the position is.
2. How the receiver finds its position: acquisition after power-on, what makes it fast or slow (the stored
   position, the clock, the time off), the states it goes through, NAV ready. The task of correcting the position or
   the time is Power-on's; link.
3. Real and fast acquisition: the setting on SET 10 (Simulator only box).
4. Reading the receiver's state in flight: which STA page answers which question.
5. RAIM: what it is, what it needs, what the unit does when it is not available or finds an error, the messages
   (quote the text, link to the list), altitude as an extra measurement.
6. Predicting RAIM for an arrival: the task on STA 5.
7. Take-home mode, if the research shows a pilot can meet it (Availability box); otherwise it stays with Power-on.
8. Links on: Power-on and initialization, Non-precision approaches, Simulated failures, the STA pages.

### STA pages (`pages/sta.mdx`), page reference

Sections in page order, headings as "STA 1: …" (style guide, section 9):

1. The STA pages as a type: one opening section only if something is common to them.
2. STA 1: the receiver state and the satellites. Variants: acquiring, navigating, more satellites than fit on one
   page (`STA+1`), a failed receiver.
3. STA 2: the estimated position error. Variant: no position.
4. STA 3: the software versions and the OBS calibration.
5. STA 4: the operating time and the count of power-ons.
6. STA 5: the RAIM prediction. Variants: before the calculation, calculating, the result.
7. Links to GPS reception and RAIM and to Non-precision approaches.

## Topics this package owns

GPS reception and RAIM owns the receiver states, the satellites, acquisition, NAV ready as a state, the position
error, RAIM and RAIM prediction, real and fast acquisition. The STA chapter owns the pages and their fields. The
session records the anchors in the index when the pages are written.

What the pages link to instead of explaining: page selection and the cursor (Controls and display, planned
anchors); initializing position and time (Power-on); what RAIM decides in an approach (Non-precision approaches); a
failed receiver, jamming, spoofing and a faulty satellite (Simulated failures, written in the next package: one
sentence and the link, and the session notes in `docs/plan/failures.md` what it said); message texts (the lists).

## Where to look

- The pages: `pages/left/Sta1Page.tsx` to `Sta5Page.tsx`. The `+` rule: `pages/MainPage.tsx` (`leftPageName`).
- The receiver: `Gps.ts`, `GpsSearch.ts`, `GpsSolution.ts`, `GpsSignal.ts`; SET 10 in `pages/left/Set10Page.tsx`;
  the wiki page `SET-10-Page.md`; the wiki FAQ on slow acquisition.
- RAIM messages: `data/PersistentMessages.ts` (the RAIM, geometry and position classes); one-time messages about
  time and position in `Gps.ts`.
- The approach gate that uses RAIM: `services/ModeController.ts` (for the link, not for this package's text).
- Tests: `test/render/GpsAcquisition.test.ts`, `GpsSolution.test.ts`, `SatelliteReachability.test.ts`,
  `test/unit/GpsSearch.test.ts`, `GpsSignal.test.ts`.
- Code comments point to `docs/failures.md` and `docs/superpowers/specs/`; these are not a writer's source (style
  guide, section 4).

## Screens

Planned by this package's session after its research. The session checks first that the generator can stage the
receiver states (an acquisition in progress, more than four satellites, a RAIM prediction and its calculating
state); what it cannot stage is listed here afterwards.

## Notes for the session

- Models: Sonnet for the STA chapter; Opus for GPS reception and RAIM (RAIM is intricate and a mistake there is
  costly) and for the reviews.
- The code marks several timings and limits of the receiver as its own choice or a guess. The pages describe what
  the pilot observes; the reviewer says where the real manuals know better.
- Official terms: the reviewer checks the names of the receiver states and of the STA pages against the real
  manuals.
- The Operation page of this package is the first of its kind (`docs/manual-plan.md`, "Example pages").

## Notes from other packages

None.

## Changes to earlier pages

None planned. The Quickstart links to Power-on for the time after the self test and needs no change.
