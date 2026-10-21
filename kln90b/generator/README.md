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

- `vitest.config.mts`: the three projects, the `.scss` stub, and `resolveFromVendor`, which makes bare imports from files
  of this repository resolve inside the submodule so that there is one copy of Vitest and the SDK.
- `vendorCheck.mjs`: the submodule checks, and `vendorCommit()` for the commit recorded in a generated screen.
- `lib/paths.ts`: `VENDOR`, `SITE` and `SCREENS`.
- `lib/navdata.ts`: loads the newest extract of `navdata/` and turns it into the facilities a screen boots with (`place()`
  gives the position of an ident for a screen's `boot.position`). `lib/wmm.ts` is the magnetic model.
- `harness-lgpl/`: the copied builders of the harness with the changes made to them, under the LGPL (see its README).
- `tsconfig.json`: type check with `node ../vendor/kln90b/node_modules/typescript/bin/tsc -p generator --noEmit`.
- `test/`: tests of the generator; `*.capture.test.ts` boots the unit and needs happy-dom.

## Moving the pin

1. Check out the new commit inside `vendor/kln90b` (it must exist on GitHub).
2. Commit the changed pointer in this repository.
3. Run `npm ci --prefix vendor/kln90b`.
   Copy `harness-lgpl/builders.ts` again from the new commit if it changed, as `harness-lgpl/README.md` says.
4. Regenerate all screens and review the diff: it shows which screens and which field explanations need a look.
