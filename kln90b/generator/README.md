# Screen generator

Generates the example screens of the manual from the simulated unit. The kln90b source is the git submodule
`vendor/kln90b`, pinned to a commit. Its test harness (`vendor/kln90b/test/harness/`, see `test/README.md` there) boots
the unit headless under Vitest. The design is `docs/superpowers/specs/2026-10-21-screen-generator-design.md`.

## Setup

From the repository root:

```bash
git submodule update --init
npm ci --prefix vendor/kln90b
```

The generator uses the Vitest, happy-dom, `@napi-rs/canvas` and MSFS SDK that the submodule's lockfile installs. Nothing
of that is a dependency of `kln90b/package.json`, and the site builds without the submodule.

## Commands

Run them from `kln90b/`:

- `npm run screens` generates the screens (Vitest project `screens`). Extra arguments are Vitest filters, for example
  `npm run screens -- screens/nav-1`.
- `npm run screens:test` runs the generator's own tests (projects `unit` and `capture`).

`generator/run.mjs` first checks that the submodule is checked out, has its dependencies, sits at the pinned commit and
has no local changes. It then starts the submodule's Vitest with `generator/vitest.config.mts`, with the submodule as
working directory, because the harness resolves `resources/` from `process.cwd()`.

## Layout

- `vitest.config.mts`: the projects it declares, the `.scss` stub, and `resolveFromVendor`, which makes bare imports from files
  of this repository resolve inside the submodule so that there is one copy of Vitest and the SDK.
- `vendorCheck.mjs`: the submodule checks, and `vendorCommit()` for the commit recorded in a generated screen.
- `lib/paths.ts`: `VENDOR`, `SITE` and `SCREENS`.
- `lib/navdata.ts`: loads the newest extract of `navdata/` and turns it into the facilities a screen boots with (`place()`
  gives the position of an ident for a screen's `boot.position`). `lib/wmm.ts` is the magnetic model.
- `lib/mapElements.ts`: records what the maps draw while a screen is captured, one element per drawing call;
  `lib/mapSvg.ts` writes a map as SVG, one group per element.
- `harness-lgpl/`: the copied builders of the harness with the changes made to them, under the LGPL (see its README).
- `tsconfig.json`: type check with `node ../vendor/kln90b/node_modules/typescript/bin/tsc -p generator --noEmit`.
- `test/`: tests of the generator; `*.capture.test.ts` boots the unit and needs happy-dom.

## Describing a screen

`screens/<id>/screen.ts` calls `defineScreen(import.meta.url, {...})` from `generator/api.ts`, which also re-exports what a
description needs from the harness. See `screens/apt-1-ksea/`, `screens/nav-5-ksea/` and `screens/home-nav-1/`.

- `boot.position`: `place('KSEA')` is an airport, VOR, NDB or fix of the FAA extract by the ident the unit shows;
  `pointFrom(place, bearingTrue, nm)` and `courseDeg(from, to)` place the aircraft relative to it.
- `boot.storage`: `savedFlightplan(0, [facility('KPDX'), facility('KSEA')])` stores flight plans, which is how the unit
  starts on a route (`facility(ident)` is the extract's facility of an ident).
- `steps`: the front panel of the harness (`u.panel.selectPage`, `cursor`, `enterIdent`, `directTo`, ...), `moveAircraft`
  to give the GPS a track and ground speed, `settle` and `wait` for simulated time. Screens are staged, not flown.
- Steps that several screens share live in `screens/shared/`.
- `fields`: say where each field is with the cells' content, not with their place. A field with a label or fixed text
  gets a regex scoped to its area (`{re: /GS +\S+/, area: 'L'}`); the generator fails when the regex matches nothing or
  more than once, so a layout change in kln90b cannot silently leave the tooltip over the wrong cells. Use a place
  (`{area: 'L', row: 1}`) only for contents that are free: an airport name, the CDI bar, a field that covers a whole
  half.

### Map fields

Every element the unit draws on a map (NAV 5, APT 3) is a field too. From the steps of a screen to its capture, the
generator records each drawing call of the map (an icon, a label, a flight plan line or arrow, a plain line, an arc) and
the map pixels it lit; the last frame the map finished before the capture's last read counts. NAV 5 redraws on every
display tick, APT 3 only when its page opens. Each element is described in one line: the kind and its
arguments, with each point named after the place of the extract it equals (an airport ident first, then a VOR, an NDB,
a fix) and written as `lat,lon` otherwise, for example `icon % KSEA`, `arrow 47.1172,-122.3118 KSEA` and
`icon $ 47.1172,-122.3118`. A description that repeats on a map gets ` #2`, ` #3`.

- A map field names the map side and a regex over the descriptions:
  `{id: 'aircraft', find: {map: 'L', draw: /^icon \$ /}}`. It must match exactly one element; `many: true` lets it
  claim several (all legs of a flight plan, say). A field's locators are all text locators or all map locators of one
  side, and the side must be one the screen shows.
- Every element of a map the screen shows must belong to exactly one field. Generation fails on an element no field
  claims and names it (`the element "icon % KSEA" of map L belongs to no field`), so the error of a new screen lists
  the descriptions to write the fields from. An element two fields claim fails naming both.
- The descriptions are also in the map's SVG: `map-<side>.svg` has a
  `<g data-field="..." data-draw="..." data-box="x y w h">` per element, in drawing order.
- The map fields need explanations in `fields.mdx` like the text fields.

### Defaults of a screen

A screen gets these without saying anything; it changes the ones that `boot` offers:

- The start date and time are `DEFAULT_START` of the harness (`vendor/kln90b/test/harness/sim/clock.ts`); `boot.start`
  sets another one.
- The database cycle the unit shows is `DEFAULT_NAVDATA_RANGE` in the same file. A screen cannot change it, and a
  `boot.start` outside that cycle makes the unit boot with an expired database.
- The seed of `Math.random` is 1; `boot.seed` sets another one.
- The last position the unit saved is the boot position (see Messages below); a `storage` of the screen's own wins.
- The unit knows the class B and C airspace and the Centers of the airspace extract (`navdata/README.md`), and its
  airspace alert is off, so that no airspace message covers a screen. `boot.storage` sets `airspaceAlertEnabled: true`
  for a screen that shows the alert; a screen cannot pass `boot.airspaces`.
- The magnetic variation is NOAA's WMMHR2025 evaluated to degree 12 at the start date, at every position. A screen
  cannot change the model, only the start date.

### Messages

The unit warns with POSITION DIFFERS FROM LAST POSITION BY >2NM when its first fix is more than 2 NM from the last
position it saved (the user settings `lastLatitude` and `lastLongitude`, which default to 0). A pilot who last flew from
where the unit starts never sees it, so `generateScreen` seeds both settings from `boot.position` (a `storage` of the
screen's own wins). A step that raises a message (a Direct To or an active flight plan raises ADJ NAV IND CRS) answers it
in the step: `adjustCourseIndicator(u)` turns the course of the external indicator the way a pilot does,
`u.panel.readMessages()` reads any other. Generation fails when the captured screen still flashes `msg`, and the error
names both. A screen that is meant to show `msg` sets `keepMessages: true`, which only turns that check off; it stages a
real pending message, such as an active flight plan that was not answered with `adjustCourseIndicator`.

## Moving the pin

1. Check out the new commit inside `vendor/kln90b` (it must exist on GitHub).
2. Commit the changed pointer in this repository.
3. Run `npm ci --prefix vendor/kln90b`.
   Copy `harness-lgpl/builders.ts` again from the new commit if it changed, as `harness-lgpl/README.md` says.
4. Regenerate all screens and review the diff: it shows which screens and which field explanations need a look.
