# Generated example screens: design

Date: 2026-10-21. Status: draft for the maintainer's approval.

The site specification (kept outside the repository, section "Example screens", with the subsections "Generating the
screens" and "Navdata on the example screens") states the rules this design implements. This document is the how.

## Intent

The manual shows example screens of the KLN 90B next to every text that describes a page of the unit. They were typed
by hand into the MDX pages (`KlnScreen` markup), and the first ones already contain mistakes. Hand-typed screens are
the largest accuracy risk of the manual.

The screens are therefore generated from the simulated unit itself: the kln90b code boots headless, the generator walks
it to the screen and reads back what the pilot would see. The result is committed. When the kln90b code changes (a
layout fix, say), all screens are regenerated, and the changes show up in git. That is deliberate: the diff tells the
writers which screens and which field explanations need a look.

## Goals

- Every example screen of the manual is generated, never typed. Exceptions are listed under Non-goals.
- Regenerating is one command and gives the same result every time (same pin, same input, same files), with the
  dependency versions of the submodule's lockfile. The maps have few pixels and are drawn pixelated (map labels with
  `fillText` in the kln90b `controls/Canvas.tsx` in the pixel map font), so the maintainer expects no differences
  between platforms; the spike checks two runs for identical output.
- Everything about a screen lives in one place: how to reach it, where its fields are, and what each field means. A
  documentation page only names the screen by its id. A fix to a screen reaches every page that shows it.
- A layout change can never silently leave a field's tooltip over the wrong cells: generation fails instead.
- The map pages (NAV 5, Super NAV 5, APT 3) are generated too, as inline SVG.
- The screens show real, well-known US places from public FAA data, so they look like what a pilot sees in the sim.
- Several agents can work in parallel: one writer per screen or per chapter, without touching each other's files.

## Non-goals

- The Quickstart knob demo, its status line and the page tree data (`src/data/pageTree.ts`) stay hand-built. The
  maintainer ruled that little can go wrong there. A few other pages may build a status line by hand the same way.
- No generation at site build time. The GitHub Pages workflow never runs the generator.
- No changes to the kln90b repository, ever, for the sake of the documentation.
- No check in GitHub Actions that the committed screens are up to date. It may come later; it would need the submodule
  and its dependencies in CI.
- No screen images (PNG or similar). Screens are HTML text in the KLN font; maps are inline SVG.

## Anti-goals

These would make the work a failure even if it ran:

- A generated file edited by hand, or a screen whose text was typed into an MDX page.
- A generator that writes into MDX pages or into any file a writer edits.
- A generator that depends on the maintainer's local kln90b checkout (`E:\msfs\kln90b`) or any other path outside the
  repository.
- Navdata taken from Navigraph, from the simulator's database, or from any other commercial source, even one record.
- A field matched so loosely that it still "works" after the layout changed under it.

## Constraints

- The kln90b source is not on npm. It is included as a **git submodule**, pinned to a commit. The pin moves only by a
  deliberate commit in this repository. The submodule URL is the public GitHub repository, so the pin must be a commit
  that exists on GitHub (the maintainer pushes; agents never push).
- The kln90b project must carry no risk from the documentation. It does not know this repository exists.
- The generator boots the unit the way the kln90b tests do (`test/harness/` in the kln90b repository). It may import
  the harness from the pinned checkout as it is. Helpers that need changes are copied into this repository and adapted
  here; the copies keep the kln90b license (see "Licensing").
- The harness depends on Vitest (fake timers, `vi`, `onTestFinished`), happy-dom, `@napi-rs/canvas` and the MSFS SDK.
  The generator therefore runs under Vitest, with the same environment the kln90b render stage uses (happy-dom, the
  FSComponent JSX pragma, `.scss` imports resolved to nothing; see the kln90b `vitest.config.mts`).
- The harness resolves `resources/` from `process.cwd()` (`test/harness/sim/FakeXhr.ts`,
  `test/harness/render/canvas.ts`), so it expects to run from the kln90b root. The builder either runs with that working
  directory or copies and adapts those two helpers.
- The site build (Astro, `kln90b/`) only reads committed files. It must keep building with a plain `npm ci` in
  `kln90b/`, without the submodule checked out (`actions/checkout` does not fetch submodules by default, and the
  workflow `.github/workflows/pages.yml` stays as it is).
- Display rules from the site specification apply unchanged: fields cover label and value, fields are not marked at
  rest, flashing text gets a static dashed box and a legend, half screens keep the middle line, every field has a
  direct link `#screen-<id>--<field>`, every screen has a collapsed list of its field explanations, which the search
  indexes.

## Decided

These were decided with the maintainer.

### The pieces of a screen

A screen has an id that is unique across the site, for example `nav-1`, `vor-user`, or `tutorial-1-nav-1-climb`. Its
anchor on a page is `#screen-<id>`, a field's is `#screen-<id>--<field>`.

Each screen consists of:

1. **The description** (TypeScript, read only by the generator): how to set the unit up (navdata, position,
   altitude, panel.xml options, saved user data, start time), the knob turns and key presses that reach the screen,
   which half or halves to show, and the field definitions.
2. **The field explanations** (Markdown or MDX, read only by the site): one entry per field id, with a short title and
   the explanation. They explain the field in detail and independently of where the screen is shown. Glossary
   tooltips and the automatic page-name links work in them as in any page.
3. **The generated screen** (written only by the generator, committed): the text, the attributes of every cell, the
   positions of the fields, and the kln90b commit it came from. For a map page, also the map as SVG.

The description and the explanations are next to each other, so whoever works on a screen finds everything about it in
one place.

### Fields are matched by the generator

The generator, not the MDX page, ties each field to its cells. A field definition names a field id and one of:

- a **regular expression** over the text, optionally limited to a half and a row: `DIS +\S+nm` finds "DIS  45.2nm"
  wherever the exact distance ends up, so a change in the last digit (a switch to WGS 84, say) does not break it;
- a **place**, when the contents do not matter: the whole of row 2 of the left half, or a range of cells in a row.

Generation fails, naming the screen and the field, when a field matches nothing, matches more than once, or overlaps
another field. A field that legitimately consists of separate pieces is defined as such.

### Explanations belong to the screen

The explanations live with the screen, not with the page that shows it. Anything that depends on the context (why the
reader sees this screen at this point, what to do next) goes into the text around the screen on the documentation page.

The same page of the unit with other values, or in another state, is another screen with its own id and its own
explanations. Examples: the VOR page showing a database VOR and showing a user waypoint; a screen of a tutorial flight
showing the values the pilot actually sees at that step of the flight. Shared wording between such variants may be
written once and reused (how is left to the builder), but each screen still has a complete set.

Both the generator and the site build fail when a field has no explanation or an explanation has no field.

### Screens are staged, not flown

A screen is reached by setting the unit up in the state it shows and then pressing keys: the position, the flight plan
and user data, the time, and where needed a short move of the aircraft so that the GPS has a ground speed and a track
(`moveAircraft` in the kln90b `test/harness/boot.ts`). This holds for the tutorial screens too: a screen of a tutorial
step is staged at that point of the route, not reached by flying the route. Flying with the harness's flight simulation
(`test/harness/flight/`) remains possible for the rare screen that only a sequence of events produces, such as a
message after a leg change.

### Using a screen on a page

An MDX page shows a screen by its id only, for example `<KlnScreen screen="nav-1" />`. It does not repeat any field,
text or explanation. The existing hand markup of `KlnScreen` stays available for the hand-built exceptions (Non-goals).

### Map pages

The maps draw in blocks of 4 by 4 canvas pixels (`ZOOM_FACTOR` in the kln90b `controls/Canvas.tsx`), and the harness
can already read the canvas back (`canvasToAscii` and `downsampled` in `test/harness/render/canvas.ts`). The generator
turns the lit blocks into an inline SVG of rectangles in the screen's phosphor color, which reproduces exactly what the
unit draws, map labels included. The text rows over a map (orientation and range on NAV 5) stay text and can carry
fields as on any screen.

### Navdata

The screens use real US places (KSEA, Seattle-Tacoma), from the FAA's public data only:

- NASR (the 28-day subscription): airports, runways, frequencies, VORs, NDBs, fixes, airways;
- CIFP: SIDs, STARs and approaches;
- the FAA's airspace data: class B, C and D airspace and special use airspace, for the airspace alert examples.

A script in this repository extracts what the screens need from a named FAA cycle and writes it to a committed file in a
neutral format, recording the cycle. The generator turns that file into the facilities the unit loads, with the
harness's facility builders (`test/harness/navdata/builders.ts`, `procedures.ts`, `airspaces.ts`) or adapted copies of
them. The builders do not fill in airport frequencies yet, so that is one of the helpers to copy and extend.

The extract covers the surroundings of the places the screens show, wide enough that the nearest pages (NAV 2 and the
nearest lists of the waypoint pages) look as they would in the sim.

*Calls made in writing this design (not discussed with the maintainer):*

- The waypoint pages scan the whole database in ident order (`data/navdata/Scanlist.ts`), so no regional extract gives
  the same scan neighbors as the sim. Screens therefore always reach a waypoint by entering its ident and never show
  what the scan order puts next to it. The extract stays regional.
- A VOR's own station declination comes from its NASR record, as the sim's VOR records carry their own.

Magnetic variation at any point (`Facilities.getMagVar`, the harness's `magvar` boot option, which accepts a function of
latitude and longitude) comes from NOAA's World Magnetic Model, which is public domain, for the date the screen is set
at. The maintainer has the coefficient file of the high-resolution model WMMHR2025 (`WMMHR.COF`) with NOAA's test
values (`WMMHR2025_TEST_VALUES.txt`); both are copied into the repository and the generator evaluates the model itself.
The implementation is tested against NOAA's test values. *Call made in writing this design:* for the screens the model
is evaluated only up to degree and order 12, the resolution of the standard WMM. The higher degrees add local crustal
detail that the sim's magnetic variation does not have, so they would move bearings away from what the pilot sees.

## Left to the builder

The builder decides these, and should say what was chosen:

- The folder layout: where the submodule sits (`vendor/kln90b` at the repository root is a suggestion), where the
  generator and its Vitest config live, and where each screen's three parts go. Keeping each screen's parts in one
  folder per screen is suggested.
- How the generator is run from the site package (`npm run screens` in `kln90b/` is a suggestion) and how dependencies
  are installed for it (running `npm ci` inside the submodule reuses kln90b's exact dependency versions). One Vitest
  instance must serve both the harness and the screen descriptions.
- The format of the generated screen file, with one requirement: a git diff of it must be readable by a person, so a
  writer sees at a glance what changed on the screen and which field moved. A plain text file with the rows, the mask
  under them and one line per field (in the spirit of the harness's `Screen.dump()`) is a suggestion.
- How the site loads the generated files and the explanations (a content collection, or a loader in `KlnScreen`), and
  how the explanations' file is structured.
- The format of the field definitions in the description, within the rules under "Fields are matched by the
  generator".
- Whether to regenerate one screen or all of them by default. Both must be possible.
- The default start date and time, the database cycle the unit shows, and the seed, as long as they are fixed per
  screen and set in its description or in one shared default.
- How a blinking cell (the harness's `B`) and a flashing inverse cell (`F`) are each drawn with the static dashed box.
- The neutral format of the navdata extract, and which NASR, CIFP and airspace files it reads.
- Migrating the existing hand-typed screens in `src/content/docs/` to generated ones, and updating the "Writing a
  screen" section of the repository README.

## Licensing

The site and the documentation are CC0. The kln90b code is licensed by the kln90b project; the submodule brings it in
unchanged. Harness helpers copied into this repository keep the kln90b license and its notice, in a folder of their
own with the license text next to them, the same way the KLN font is handled. The generated screens are output of the
unit, not copies of its code. The FAA data is a work of the US government and in the public domain; the extract records
where it came from.

## Risks to check first

The plan should start with a short spike that proves the chain end to end on one screen before anything else is built:

- the harness runs from the submodule under a Vitest config that lives in this repository (module resolution of
  `vitest`, the MSFS SDK and the JSX pragma, and the `process.cwd()` assumption);
- the screen comes out identical on two runs;
- a map page's canvas can be read back into an SVG.
