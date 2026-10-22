# Procedures, airspaces and Super NAV 5 in the screen generator: design

Date: 2026-10-22. Status: approved by the maintainer on 2026-10-22.

Builds on `2026-10-21-screen-generator-design.md`, whose rules (generated screens only, FAA data only, kln90b never
changed, the site builds without the submodule) all still hold.

## Intent

Tutorial flight 2 (`KYKM/27 YKM7 TITON V4 CHINS CHINS5 KBFI/R32LY`, style guide section 17) cannot be written yet,
because the screen generator lacks three things the flight shows: SIDs, STARs and approaches (APT 7, APT 8), airspaces,
and the Super NAV 5 page. This work adds them and then proves the flight is unblocked by putting generated screens of
every procedure selection step and of the assembled route on the tutorial-2 page. The screens are the proof; the
page's text stays as it is. Writing the tutorial is later work, for writers.

## Goals

- **Procedures.** The SIDs, STARs and approaches of the airports in the navigation data extract come from the FAA CIFP
  and reach the unit as the simulator would deliver them, so that APT 7 and APT 8 offer what the unit offers in the
  simulator.
- **Airspaces.** Class B and class C airspace and the ARTCC (Center) boundaries of the extract's region come from the
  FAA's airspace data and reach the unit through the boundary search.
- **Super NAV 5** can be generated: its map as SVG with map fields, and its text, like NAV 5 today.
- **Proof on the site:**
  - On `kln90b/src/content/docs/getting-started/tutorial-2.mdx`, one generated screen for every APT 7 step of selecting
    YKM7 at KYKM and of selecting CHINS5 at KBFI, one for every APT 8 step of selecting the RNAV (GPS) Y 32L with the
    HUMPP transition, a Super NAV 5 screen that shows the whole assembled route, and an OTH 2 screen with a Center
    frequency.
  - In each selection screen, the cursor is on the value the pilot chooses in that step.
  - The existing APT 1 example (`apt-1-ksea`) shows the airspace class `CL B` of Seattle-Tacoma, with a field for it.
- **Download links documented.** The navdata README gets a section that names the four FAA downloads and where to get
  them (below).

## Non-goals

- No new prose on the tutorial-2 page, and none in the field explanations beyond the placeholders the other screens
  have (a title and lorem ipsum). The real text comes from writers later.
- No airspace alert screens, no special use airspace (MOA, restricted and so on), no class D or E. The extract can grow
  to them later; nothing in this design should prevent it.
- No airways. V4 is entered waypoint by waypoint in the tutorial (CADED is already in the NASR fixes).
- No regions beyond the existing Seattle region (`regions.json`).
- No check in GitHub Actions; no generation at site build time.

## Anti-goals

- Any record taken from Navigraph or the simulator's database.
- Procedures or airspaces written by hand into a `screen.ts` instead of coming from the FAA files through the extract.
- Any change in `vendor/kln90b`.
- A screen whose fields were matched loosely enough to survive a layout change under them.
- An extract that silently drops a procedure or an airspace: everything skipped is counted and named in the script's
  summary, as `extract-nasr.mjs` does today.

## Constraints

- The FAA files live outside the repository; only the extracts and the scripts are committed (as for NASR).
- `Class_Airspace.geojson` is about 560 MB, more than Node can hold as one string. It has one feature per line, so the
  script reads it line by line. `Airspace_Boundary.geojson` (about 18 MB) can be read whole or the same way.
- The CIFP (`FAACIFP18`) is ARINC 424 fixed-width records, 132 columns, about 400,000 lines; the airport procedure records
  are subsection `PD` (SID), `PE` (STAR) and `PF` (approach), with continuation records.
- The harness already builds procedures (`vendor/kln90b/test/harness/navdata/procedures.ts`: `Leg`, `sid`, `star`,
  `approach`, `withProcedures`, `runwayFix`) and airspaces (`airspaces.ts`: `airspace`). The generator uses them as they
  are, or copies and adapts them into `generator/harness-lgpl/` under the LGPL like `builders.ts`, if they need a change.
- `generate.ts` today keeps `airspaces` out of the boot options; it must pass the extract's airspaces.
- `capture.ts` refuses Super NAV 5 on purpose, and the screen file format and `KlnScreen` know only map sides `L` and
  `R`.

## Approaches

Discussed with the maintainer on 2026-10-22.

**Procedures.**
1. *Every airport of the extract (chosen).* The CIFP reader takes the procedures of the airports the NASR extract
   already has, into a JSON extract; `navdata.ts` turns them into the harness's procedure objects. Consistent with the
   rest of the data, and APT 7 and APT 8 of any airport a screen shows are right.
2. *Only airports named in a list.* Smaller, but APT 7 and APT 8 of any other airport would quietly show nothing.

**Airspace shapes for APT 1.** The NASR CSV only flags per airport whether it has class B or C (`CLS_ARSP.csv`).
1. *The FAA's "Class Airspace" GeoJSON (chosen).* Real shelves, usable for the airspace alerts later. One more download.
2. *A made-up polygon around each flagged airport.* APT 1 would be right, every other use of the shape wrong.

**Center frequencies for OTH 2.** The FAA publishes no sector shapes, only the ARTCC boundary and the RCAG transmitter
sites with their frequencies.
1. *One Center area per ARTCC with the first suitable frequency (chosen by the maintainer).* OTH 2 needs only to be
   plausible: the ARTCC's low-altitude boundary carries one frequency, the first one found.
2. *A circular area per RCAG site* (proposed, not chosen): closer to sectors, but the radius would be invented.
3. *The ARTCC boundary with all its frequencies:* OTH 2 would show the lowest frequencies of the whole ARTCC, possibly
   from far away.

**Super NAV 5.** One sensible way: a third map kind, the full page, next to the left and right maps.

## Decided

### Downloads

A new section of `kln90b/generator/navdata/README.md` lists the downloads, what each is used for and which file of it
the scripts read:

- NASR 28-day subscription (CSV): https://www.faa.gov/air_traffic/flight_info/aeronav/aero_data/NASR_Subscription/
- CIFP: https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/cifp/download/ (`FAACIFP18`)
- Airspace Boundary (ADDS): https://adds-faa.opendata.arcgis.com/datasets/faa::airspace-boundary-1/about
  (`Airspace_Boundary.geojson`, for the ARTCC boundaries)
- Class Airspace (ADDS): https://adds-faa.opendata.arcgis.com/datasets/faa::class-airspace/about
  (`Class_Airspace.geojson`, for class B and C)

The files used for this work are cycle 2026-10-01: `E:\msfs\01_Oct_2026_CSV`, `E:\msfs\CIFP_261001`,
`E:\msfs\Airspace_Boundary.geojson`, `E:\msfs\Class_Airspace.geojson`. The README names no local paths.

### Procedures

- Airports: those of the NASR extract that have procedures in the CIFP, matched by the identifier the unit shows (the
  CIFP's airport identifier is the ICAO one, `KYKM`).
- All three kinds: SIDs, STARs and approaches, with their runway transitions, common parts and en route or approach
  transitions, as the CIFP route types divide them.
- Every leg keeps its path terminator, even the ones the unit drops (CA, VA, VM, VI and the like, RF), because the unit
  filters procedures itself (`data/navdata/SidStar.ts`) and the screens must show its filtering, not ours.
- Each leg keeps what the unit reads: the fix, the path terminator, course, turn direction, the fix type flags that mark
  the IAF, FAF and MAP (APT 8 offers only an IAF as the start of an approach), fly-over, and for arcs and procedure
  turns their navaid, radius and radials. Altitudes and speeds are kept if the unit reads them; the builder checks the
  code.
- **Runway transitions for both parallels are split, as the simulator does.** A runway transition coded for both
  parallel runways (`RW32B`) becomes one transition per runway of that number the airport has (RW32L and RW32R), each
  with the same legs. The maintainer saw exactly this on APT 7 in the simulator for CHINS5 (RW14L, RW14R, RW32L,
  RW32R). The real unit shows one entry `RW32B`; that is kln90b#409. Once the fix lands and the pin moves, the
  regenerated screens show `RW32B` without any change here. *My call:* a transition coded `ALL` becomes one
  transition per runway end of the airport, by the same logic.
- **A leg whose fix is the airport itself has no fix.** Every CHINS5 runway transition ends with a VM leg that names
  KBFI. In the simulator the unit ignores it and the arrival ends at AUBRN, which the maintainer saw on APT 7, so the
  simulator delivers such a leg without a fix. The extract does the same for every leg whose fix is the airport
  (section `PA`).
- The approach type, runway and suffix (`R32LY` is RNAV, runway 32L, suffix Y), the RNAV flags and the RNP AR flags
  come from the CIFP so that the unit lists, filters and names the approaches as it does in the simulator.
- *My call:* a procedure fix resolves to the facility of that ident and region in the NASR extract (an airport, fix,
  VOR or NDB) where one exists; a terminal waypoint that NASR lacks comes from the CIFP's terminal waypoint records
  (subsection `PC`) of that airport and is added to the facilities; a runway fix (`RW32L`) is built with `runwayFix`.
  A fix outside the region (the builder check found 23 procedures at KSEA, KPDX, KHIO and others that reach LKV, LMT,
  OED and the like) is taken from the CIFP's own en route waypoint and navaid records and added to the facilities, so
  that no procedure is lost to the region's edge. A fix that still resolves to nothing is reported, and its procedure is
  skipped and counted.
- The extract is a JSON file next to the NASR one, recording the CIFP cycle, sorted and indented so that a diff is
  readable. `navdata.ts` loads it with the newest NASR extract and attaches the procedures to their airports
  (`withProcedures`).

### Airspaces

- From `Class_Airspace.geojson`: every feature of class B or class C (`CLASS` `B` or `C`, `LOCAL_TYPE` `CLASS_B` or
  `CLASS_C`) within the extract's regions. Each shelf is its own airspace, with its lower and upper limit; `SFC` is a lower
  limit of 0 above ground. The name is the feature's `NAME` (`SEATTLE CLASS B`).
- From `Airspace_Boundary.geojson`: the low-altitude ARTCC boundaries (`LOCAL_TYPE` `ARTCC_L`) that reach into the
  regions, as Center airspaces (`BoundaryType.Center`).
- The Center frequency: the first row of `FRQ.csv` with facility type `RCAG` for that ARTCC (`ARTCC_OR_FSS_ID`), use
  `LOW` or `LOW/HIGH`, in the VHF communication band 118.000 to 136.975 MHz and not 121.5, in the file's order. For ZSE
  that is 124.85 (Antelope Mountain). One frequency per Center, so OTH 2 shows one. *My call:* the NASR extract keeps
  the candidate frequencies of each ARTCC in file order and `navdata.ts` takes the first, so that the extract stays
  neutral data and the choice sits in one line of code.
- The airspace extract is its own JSON file with the source and date of each GeoJSON, sorted and indented; polygons
  are rings of `[lat, lon]`. The builder decides whether coordinates are rounded (the Seattle class B is drawn with
  dense arcs) and how holes and multipolygons are handled, as long as `BoundaryUtils.isInside` gives the right answer
  for the screens.
- `generate.ts` passes the airspaces to `bootUnit`; a screen still cannot set its own.
- **The airspace alert is off on every screen by default** (the user setting `airspaceAlertEnabled`), so that no
  screen shows an alert it is not about (style guide, section 13, "No message prompt"). A screen about the alert turns
  it on in its own `boot.storage`, which wins over the default. The generator README says so under "Defaults of a
  screen".

### Super NAV 5

- `capture.ts` captures the full page with its canvas instead of refusing it. The map side is a third value, `F`, in the
  capture, in the screen file (`map F`, `mapfield <id> F`, `map-F.svg`) and in the map field locators
  (`{map: 'F', draw: ...}`). Coverage checks and the SVG work as for `L` and `R`.
- The text Super NAV 5 shows over its map (the left and right columns and the status line) is text of the screen and
  carries fields like any other text.
- `KlnScreen` and `screenHtml` draw the full-page map under the text with the same help windows, keyboard reach and
  direct links as the half-page maps.
- The builder first checks that the harness reads the text of Super NAV 5 (`Screen.read`) and that the map recorder sees
  the full-page canvas (`CanvasSize.FULLPAGE`), and adapts whatever does not.

### The screens

All tutorial screens are new folders under `kln90b/screens/` with ids starting `tut2-`. Each has `screen.ts`,
`fields.mdx` with a title and a lorem ipsum body per field (like the existing screens), and its generated files.

- **APT 7, departure.** Every screen the pilot passes through on APT 7 of KYKM to load the YAKIMA SEVEN with runway 27
  into FPL 0, from choosing the procedure to the prompt that loads it. The steps come from `Apt7Page.tsx`. In each, the
  cursor is on what the pilot chooses.
- **APT 7, arrival.** The same for CHINS5 at KBFI with the YKM transition, including the runway transition step if the
  unit asks for one.
- **APT 8, approach.** The same for the RNAV (GPS) Y 32L at KBFI with the HUMPP transition (an IAF).
- **Super NAV 5.** FPL 0 with the whole route: the departure, TITON, CADED, CHINS, the arrival and the approach, after
  the duplicate waypoints have been deleted as the tutorial will tell the pilot to. The range is set so that the whole
  route from KYKM to KBFI fits on the map, and every element the map draws is a map field.
- **OTH 2.** Not a tutorial screen, because OTH 2 plays no part in the flight: `oth-2-zse`, at a plausible place
  inside ZSE, showing the ZSE frequency. It goes on a new page reference page for the OTH pages (below).
- **APT 1.** `apt-1-ksea` gains a field for `CL B` and an explanation placeholder; the screen is regenerated.

Screens are staged, not flown. Each screen starts from the state the pilot has at that step, in the order the
maintainer built the plan in the simulator:

1. FPL 0 holds the en route waypoints `KYKM TITON CADED CHINS KBFI` (stored with `savedFlightplan`).
2. The SID is loaded on APT 7 of KYKM: the departure screens start from step 1.
3. The STAR is loaded on APT 7 of KBFI: the arrival screens start with the SID loaded.
4. The approach is loaded on APT 8 of KBFI: the approach screens start with the SID and the STAR loaded.
5. The pilot deletes the duplicate waypoints: the Super NAV 5 screen starts from the cleaned-up plan.

Any message a load raises (`REDUNDANT WPTS IN FPL`) is answered in the steps. *My call:* which copy of each duplicate
goes follows the unit's own message (edit the en route waypoints) and the style guide (the approach's duplicates are
deleted from the end of the arrival). The implementation plan lists the final FPL 0 so that the maintainer can check it
against the flight in the simulator before the Super NAV 5 screen is generated.

The aircraft is at a plausible position and time for each step. Steps that several screens share live in
`screens/shared/`.

### The page

`tutorial-2.mdx` gets the screens as `<KlnScreen screen="tut2-..." />`, the APT 7 and APT 8 ones in selection order.
*My call:* the departure and arrival screens go under "Building the flight plan", the approach screens under "The
approach", and the Super NAV 5 screen after the arrival screens; the existing placeholder text and the placeholder route
table stay untouched.

A new page reference page `kln90b/src/content/docs/pages/oth.mdx` ("OTH pages", after SET in the sidebar order), built
like `set.mdx`: placeholder text, a section per page or group of pages, and `<KlnScreen screen="oth-2-zse" />` under
OTH 2. The installation-dependent OTH pages get the Availability box with placeholder text. Placeholder text is fine
throughout (maintainer, 2026-10-22).

### Checks

- Generator tests for the CIFP reader (records copied from `FAACIFP18` as a fixture, the way `test/fixtures/nasr/`
  holds NASR rows), for the airspace reader (a few GeoJSON lines), for the Center frequency choice and for a Super NAV 5
  capture.
- `npm run screens:test`, `npm run screens` and `npm run build` in `kln90b/` pass, the build without new `[page links]`
  warnings.
- All existing screens regenerate. Any change to them is explained: the airspaces and procedures now in the data can
  change what other pages show. With the airspace alert off by default, only `apt-1-ksea` is expected to change.

## Left to the builder

- Whether CIFP and airspaces get one script each or one script for both, and the names of the extract files.
- The JSON format of the procedure and airspace extracts, within the rules above.
- How the CIFP's route types, path terminators, waypoint description codes and approach route types map onto the SDK's
  fields, checked against what `SidStar.ts`, `Apt7Page.tsx` and `Apt8Page.tsx` read.
- How the screen file, `screenHtml` and `KlnScreen` represent map side `F`.
- The exact screens of each selection (how many the unit's steps produce), their ids, positions and times.
- The map range and orientation of the Super NAV 5 screen.
- Field ids and locators of the new screens.
