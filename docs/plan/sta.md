# Package: sta (the STA chapter; GPS reception and RAIM; Inside the GPS simulation)

Written on 2026-11-16, the first package of the full run, at the maintainer's request. In review with the
maintainer. The pages this package links to for the basics (Controls and display, Power-on, Waypoints and the
database, the message lists, Non-precision approaches, Simulated failures) are not written yet; it links to them by
the planned anchors and page links of the index.

## Pages

### STA pages (`pages/sta.mdx`), page reference

As written, with the anchors. The headings of the numbered pages start with the page name; the page links go to
them.

1. Summary.
2. `#the-sta-pages-status-of-the-receiver-and-the-unit`: what is common to the type.
3. `STA 1: GPS state and satellites`, with `#the-second-page-of-the-list`, `#while-the-unit-has-no-position`,
   `#a-failed-receiver`.
4. `STA 2: estimated position error`.
5. `STA 3: software revision status`.
6. `STA 4: total operational time and power-ons`.
7. `STA 5: RAIM prediction`, with `#calculating`, `#without-a-destination-or-an-eta`,
   `#the-eta-in-another-time-zone`, `#what-the-result-means-for-an-approach`. This section owns how the page
   behaves: the default destination and ETA, the time of the calculation, that the entries are forgotten, the
   unit-wide time zone.
8. `#where-the-sta-pages-are-used`: the links on.

### GPS reception and RAIM (`operation/gps-receiver.mdx`), Operation

As written, with the anchors:

1. Summary.
2. `#acquiring-satellites`: the time to first fix and what decides it.
3. `#the-gps-states`, with `#losing-the-position-in-flight`.
4. `#real-and-fast-acquisition` (Simulator only box): the setting of SET 10.
5. `#the-altitude-input`.
6. `#the-estimated-position-error`.
7. `#raim`.
8. `#predicting-raim`: the two procedures on STA 5.
9. `#messages-of-the-receiver`: every message of the receiver, quoted, with the condition and what follows.
10. `#checking-the-receiver-in-flight`: which STA page answers which question, and the links on, with the one link
    to Inside the GPS simulation.

Take-home mode is not on this page: a pilot meets it only as the warning page of the power-on sequence
(`docs/plan/power-on.md`).

### Inside the GPS simulation (`operation/gps-simulation.mdx`), Operation, optional reading

Added at the maintainer's request (2026-11-16): an excursion into the model of the receiver, in prose with
explanatory drawings, opened by the Optional reading box (style guide, sections 11 and 17). The outline is the
coordinator's and the facts come from the code. The maintainer's infographic in kln90b's `docs/` showed the wish
for the level of detail; it is not a writer's source, because that folder is behind the wall and the infographic
cites an installation manual.

As written, with the anchors:

1. Summary and the Optional reading box.
2. `#the-true-and-the-measured-position`.
3. `#the-simulated-sky`.
4. `#signal-strength`, with `#the-antenna-in-a-bank`.
5. `#from-ranges-to-a-position`, with `#the-geometry-of-the-satellites`, `#the-altitude-as-a-measurement`.
6. `#groundspeed-track-and-the-filter`.
7. `#finding-the-satellites`.
8. `#raim-inside-the-receiver`, with `#when-raim-is-available`, `#detecting-an-error`,
   `#the-prediction-on-sta-5`.
9. `#time`.
10. `#where-the-model-simplifies`.

The drawings are the components `Gps*.astro` in `kln90b/src/components/drawings/`; `GpsFigure.astro` is their
shared frame. Each one's comment holds the numbers it was computed from: the two skies of the geometry drawing
(which the filter drawing and the protection-level drawing reuse), the signal strength curve, the bank, the search
diagram, RAIM with and without a spare measurement.

The package failures adds a section on how the faulty satellite, jamming and spoofing act on this model
(`docs/plan/failures.md`).

## Topics this package owns

GPS reception and RAIM owns the GPS states, the satellites, acquisition, NAV ready as a state, the altitude input,
the position error, RAIM, the receiver's messages as the pilot meets them, RAIM prediction as a task, and real and
fast acquisition. The STA chapter owns the pages, their fields and how STA 5 behaves. Inside the GPS simulation
owns the model underneath and repeats no operating knowledge. The index has the anchors.

## Screens

The screens are in `kln90b/screens/`: `sta-1-nav`, `sta-1-nav-2`, `sta-1-acq`, `sta-1-failed`, `sta-2-epe`,
`sta-2-no-position`, `sta-3`, `sta-4`, `sta-5-entry`, `sta-5-computing`, `sta-5-result` (the STA chapter) and
`gps-msg-raim-not-available` (GPS reception and RAIM). Inside the GPS simulation shows rows of `sta-1-nav` and has
no screen of its own.

How the states before a position were staged: the generator settles to a position before the steps of a screen
run, so `sta-1-acq` and `sta-2-no-position` set the acquisition to `REAL`, erase the ephemeris data and cycle the
power inside their steps. `sta-1-failed` fails the receiver after the settle and sets `keepMessages: true`, because
the receiver's message stays pending; the left half that is shown has no `msg`.

Variants without a screen, because they cannot be staged honestly:

- The GPS states `INIT`, `TRAN`, `NAV D` and `DEGRD` on STA 1. `TRAN` lasts one second; `NAV D` shows only while
  the receiver collects the ephemeris data of a newly acquired satellite; `DEGRD` and `INIT` depend on a sky or a
  search the generator cannot guarantee.
- A STA 5 result with bars on both sides of the line: it needs a sky that gives it, and none was found. The text
  says what a bar below the line means.

`sta-3` reads the software revision from kln90b's `package.json` through a mock in its `screen.ts`, because the
source tree holds a template that only the kln90b build fills in. The value on the screen therefore changes with
the pin (`docs/manual-plan.md`, "Site and generator notes").

## Bugs

Filed on 2026-11-16; the paragraphs carry the `kln90b#NN` comments.

- kln90b#472: STA 5 takes an ETA entered in a time zone other than UTC as UTC (the STA chapter, "The ETA in
  another time zone"; GPS reception and RAIM, the note under "Predicting RAIM").
- kln90b#473: STA 5 computes the default ETA once, when the page is selected (the STA chapter, STA 5).
- kln90b#477: satellites below the 5° mask are tracked and used (Inside the GPS simulation, "The simulated sky"
  and "Signal strength").
- kln90b#478: without a position the unit's clock runs in real time (Inside the GPS simulation, "Time").

Not filed, by the maintainer's decision (2026-11-16): these are non-issues or not important, and no later
session files them.

- In `ACQ` after power-on STA 1 lists the predicted satellites without cutting the list to eight, so a ninth is
  never shown.
- The format of the error on STA 2. The reviewer took it for a difference from the real unit; the maintainer has
  photos that show the simulation is right and the real manual's rendition wrong.
- The simulated sky jumps once a week, because the simulator's SDK wraps the time of the orbits by a whole week.
  The page says only that the sky repeats every week.
- The RAIM test reacts only to wrong satellite data, never to a wrong altitude; the page says so.
- Take-home mode after a cold-and-dark start never gets a position in the pinned code (kln90b#455, closed, is
  about this); the note for the page that describes take-home mode is in `docs/plan/power-on.md`.

## Notes from other packages

None.

## Changes to earlier pages

- `pages/apt.mdx` and `pages/oth.mdx`: only `sidebar.order`, so that the chapters stand in page tree order
  (`docs/manual-plan.md`, "Site and generator notes").
- `pages/apt.mdx`: the three bug-candidate comments became `kln90b#474`, `#475` and `#476`, after the triage
  session of the same day (`docs/plan/apt.md`).
