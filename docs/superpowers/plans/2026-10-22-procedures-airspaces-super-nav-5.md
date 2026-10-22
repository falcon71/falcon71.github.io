# Procedures, airspaces and Super NAV 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The screen generator loads SIDs, STARs and approaches from the FAA CIFP, class B/C and Center airspace from the
FAA's ADDS GeoJSON, and captures Super NAV 5. The tutorial-2 page shows every APT 7 and APT 8 selection step of the
flight and the assembled route, and a new OTH page reference shows OTH 2.

**Architecture:** Two new extract scripts next to `extract-nasr.mjs` write committed JSON (`cifp-<cycle>.json`,
`airspaces-<date>.json`). `generator/lib/navdata.ts` turns them into the SDK facilities and boundaries that
`bootUnit` takes, transcoding where the simulator delivers data differently from the CIFP. `capture.ts`, the screen file
format, `fields.ts` and `screenHtml.ts` gain a third layout, `super-nav-5`, with a full-page map side `F`.

**Tech Stack:** Node ESM scripts (`.mjs`, no dependencies), TypeScript, Vitest (projects `unit`, `capture`, `screens`
in `kln90b/generator/vitest.config.mts`), the MSFS SDK and the kln90b harness from `vendor/kln90b`, Astro.

**Spec:** `docs/superpowers/specs/2026-10-22-procedures-airspaces-super-nav-5-design.md`. Read it first, together with
`kln90b/generator/README.md` and `kln90b/generator/navdata/README.md`.

## Global Constraints

- Never change anything in `vendor/kln90b`. Copy a harness file into `kln90b/generator/harness-lgpl/` and record the
  change in its README if it must change.
- Data only from the FAA files: NASR `E:\msfs\01_Oct_2026_CSV`, CIFP `E:\msfs\CIFP_261001\FAACIFP18`,
  `E:\msfs\Class_Airspace.geojson`, `E:\msfs\Airspace_Boundary.geojson`. These paths go into no committed file.
- `Class_Airspace.geojson` is about 560 MB and has one feature per line: read it line by line, never whole.
- Generated files (`screen.txt`, `map-*.svg`, the extract JSON) are never edited by hand.
- New field explanations are placeholders: a sentence-case title and a lorem ipsum body, like `screens/apt-1-ksea/fields.mdx`.
  No new prose on `tutorial-2.mdx`; the OTH page gets placeholder text only.
- Screen ids: lowercase with hyphens; tutorial screens start with `tut2-`.
- No `msg` on any screen; every step that raises a message answers it (`adjustCourseIndicator(u)` or
  `u.panel.readMessages()`).
- Commit messages are plain sentences in American English, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push.
- No counts in prose for things that grow (READMEs, comments).
- Commands run from `kln90b/`. Type check: `node ../vendor/kln90b/node_modules/typescript/bin/tsc -p generator --noEmit`.

## Review Focus

- **CIFP continuation records** (column 39 is `2` or higher, e.g. KBFI R32LY sequence 020 has a `W` continuation): they
  must never become legs. Test in Task 2.
- **Procedure fixes of other sections** (a VOR `D `, an NDB `DB`, a terminal NDB `PN`, a runway `PG`, the airport `PA`)
  must resolve to the right kind of facility, not all to fixes. Test in Task 2.
- **GeoJSON polygons with holes and multipolygons** (class B shelves that ring an inner area): the extract must not
  turn a hole into an airspace of its own or crash. Test in Task 4.
- **Screen files written before this change** (layouts `split` and `full`, maps `L` and `R`) must parse and render
  exactly as before. Test in Task 7, and the full regeneration in Task 5 must leave them byte-identical except
  `apt-1-ksea`.
- **A Super NAV 5 with a pending message** (its `msg` sits in the map overlay, not on a status line) must fail
  generation like any other screen. Test in Task 7.

---

### Task 1: Download links and Center frequencies in the NASR extract

**Files:**
- Modify: `kln90b/generator/navdata/extract-nasr.mjs` (`REQUIRED_COLUMNS['FRQ.csv']`, `extract`, `summary`)
- Modify: `kln90b/generator/navdata/README.md` (new section "Downloads", output format `centers`)
- Modify: `kln90b/generator/test/fixtures/nasr/FRQ.csv` (add RCAG rows and the columns they need)
- Modify: `kln90b/generator/navdata/nasr-2026-10-01.json` (regenerated)
- Test: `kln90b/generator/test/extract.test.ts`

**Interfaces:**
- Produces: the extract gains `centers: {artcc: string; frequencies: number[]}[]`, sorted by `artcc`, each list in
  `FRQ.csv` file order without repeats. `NavdataExtract` in `lib/navdata.ts` gains the same field.

- [ ] **Step 1: Extend the fixture and write the failing test**

Add to the fixture's header the columns `ARTCC_OR_FSS_ID`, `LAT_DECIMAL`, `LONG_DECIMAL`, `SECTORIZATION` (fill them
empty in the existing rows) and add RCAG rows copied from the real `FRQ.csv` for ZSE: ANTELOPE MOUNTAIN 124.85 `LOW`
and 306.3 `LOW` (outside the Seattle region), ARCATA 121.5 `LOW/HIGH`, BADGER MOUNTAIN 126.1 `LOW` and 127.05
`LOW/HIGH`, COTTONWOOD 118.625 `HIGH`, plus one RCAG row of an ARTCC with no site in any region (e.g. ZAB, ABAJO PEAK).

```ts
it('keeps the low VHF RCAG frequencies of every ARTCC with a site in a region, in file order', () => {
	const x = extract(FIXTURE, [SEATTLE]);
	expect(x.centers).toEqual([{artcc: 'ZSE', frequencies: [124.85, 126.1, 127.05]}]);
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `npm run screens:test -- generator/test/extract.test.ts`
Expected: FAIL, `centers` is undefined.

- [ ] **Step 3: Implement**

In `extract`: an ARTCC qualifies when an RCAG row (`FACILITY_TYPE` `RCAG`) with that `ARTCC_OR_FSS_ID` lies within a
region. Its frequencies are all its RCAG rows with `SECTORIZATION` `LOW` or `LOW/HIGH`, 118.000 to 136.975 MHz, not
121.5, in file order, each once. The summary prints the number of Centers. The README's "Downloads" section lists the
four downloads with these links and the file each script reads, without local paths:
- NASR: https://www.faa.gov/air_traffic/flight_info/aeronav/aero_data/NASR_Subscription/
- CIFP: https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/cifp/download/ (`FAACIFP18`)
- Airspace Boundary: https://adds-faa.opendata.arcgis.com/datasets/faa::airspace-boundary-1/about
- Class Airspace: https://adds-faa.opendata.arcgis.com/datasets/faa::class-airspace/about

- [ ] **Step 4: Run the tests, then regenerate the extract**

Run: `npm run screens:test -- generator/test/extract.test.ts` → PASS.
Run: `node generator/navdata/extract-nasr.mjs E:/msfs/01_Oct_2026_CSV` → the summary names one Center or more;
`git diff --stat` shows only `nasr-2026-10-01.json` grew by the `centers` block (check that ZSE's first frequency is 124.85).

- [ ] **Step 5: Commit**

`git commit -m "Keep the Center frequencies of the ARTCCs in the NASR extract and list the FAA downloads."`

---

### Task 2: The CIFP extract

**Files:**
- Create: `kln90b/generator/navdata/extract-cifp.mjs`
- Create: `kln90b/generator/test/fixtures/cifp/FAACIFP18` (records copied from the real file, see Step 1)
- Create: `kln90b/generator/navdata/cifp-2610.json` (generated)
- Modify: `kln90b/generator/navdata/README.md` (section on the CIFP extract and its format)
- Test: `kln90b/generator/test/extractCifp.test.ts`

**Interfaces:**
- Consumes: the newest `nasr-*.json` (its `airports`, `vors`, `ndbs`, `fixes`).
- Produces: `export function parseRecord(line: string): CifpRecord | null` and
  `export function extractCifp(cifpText: string, nasr: NavdataExtract, stats?: object): CifpExtract`, and the file:

```ts
interface FixRef { ident: string; region: string; kind: 'airport' | 'vor' | 'ndb' | 'fix' | 'terminal' | 'runway'; airport?: string }
interface CifpLeg {
	type: string;              // path terminator as published: 'IF', 'TF', 'CF', 'VM', 'HM', 'AF', 'RF', ...
	fix?: FixRef;              // absent when the record names none
	navaid?: FixRef;           // the recommended navaid, for AF, CF and PI
	courseMag?: number; turn?: 'L' | 'R'; flyOver?: boolean;
	role?: 'IAF' | 'IF' | 'FAF' | 'MAP';   // from waypoint description column 43
	rhoNm?: number; thetaDeg?: number; arcRadiusNm?: number;
}
interface CifpExtract {
	cycle: string; source: string;      // '2610', from the HDR01 record
	airports: {ident: string; departures: Proc[]; arrivals: Proc[]; approaches: Approach[]}[];
	waypoints: {ident: string; region: string; kind: 'terminal' | 'fix' | 'vor' | 'ndb'; airport?: string; lat: number; lon: number}[];
}
interface Proc { name: string; runways: {runway: string; legs: CifpLeg[]}[]; common: CifpLeg[]; transitions: {name: string; legs: CifpLeg[]}[] }
interface Approach { ident: string; type: string; runway: string; suffix: string; transitions: {name: string; legs: CifpLeg[]}[]; final: CifpLeg[]; missed: CifpLeg[] }
```

`runway` keeps the CIFP coding (`'27'`, `'32B'`, `'ALL'`); transcoding is Task 3's job.

- [ ] **Step 1: Build the fixture and write the failing tests**

Copy into the fixture: the HDR01 line, every `SUSAP KYKMK1D` record of `YKM7`, every `SUSAP KBFIK1E` record of
`CHINS5`, every `SUSAP KBFIK1F` record of `R32LY` and `H32LZ`, the `SUSAP KBFIK1C` records of the terminal waypoints
those use, and the `SUSAD`/`SUSAEA` records of one fix outside the 250 NM region that some procedure references (find
one with the reviewer's list: LKV, LMT or OED), plus that procedure.

Tests (literal expectations, read from the records):
- `parseRecord` of the `R32LY` sequence 020 continuation record (column 39 `2`) returns null.
- `YKM7` at KYKM: runway transitions `09`, `22`, `27`, common route legs ending at TITON with the hold, no en route transitions.
- `CHINS5`: transitions include `YKM` with first fix YKM (`kind: 'vor'`); runway transitions `14B` and `32B`; each runway
  transition's last leg is `VM` with `fix.kind === 'airport'`.
- `R32LY`: `type 'R'`, `runway '32L'`, `suffix 'Y'`; transition `HUMPP` starts with an `IF` at HUMPP with `role 'IAF'`;
  `final` ends with the leg to `RW32L` (`kind 'runway'`, `role 'MAP'`, `flyOver true`); `missed` starts with the `CA` leg.
- `H32LZ` is present with `type 'H'`.
- A fix of a procedure that NASR lacks appears in `waypoints` with its coordinates; the out-of-region fix too.

- [ ] **Step 2: Run and see them fail**

Run: `npm run screens:test -- generator/test/extractCifp.test.ts` → FAIL, module not found.

- [ ] **Step 3: Implement**

Column layout (1-based, ARINC 424 airport procedure records, section `P`, subsection col 13 `D`/`E`/`F`): airport
7–10, procedure 14–19, route type 20, transition 21–25, sequence 27–29, fix 30–34, fix region 35–36, fix section 37–38,
continuation 39, waypoint description 40–43, turn direction 44, path terminator 48–49, recommended navaid 51–54, its
region 55–56, arc radius 57–62, theta 63–66, rho 67–70, magnetic course 71–74, navaid section 79–80. Terminal waypoints
are subsection `C` (col 13) with the ident in 14–18; en route waypoints `EA`, VORs `D `, NDBs `DB`/`PN`; their
latitude and longitude are the usual `N47265670W122183920` fields of those records (columns 33–51 for waypoints;
check the VOR and NDB records against the fixture).

Route types: SID `1`/`4` runway, `2`/`5` common, `3`/`6` en route; STAR `1`/`4` en route, `2`/`5` common, `3`/`6`
runway; approach `A` transition, any other letter the final approach. Final legs after the leg whose column 43 is `M`
are missed. Column 43 `A`/`C`/`D` → IAF, `B`/`I` → IF, `F` → FAF, `M` → MAP; column 41 `Y` → fly-over. Fix kinds:
section `PA` airport, `PG` runway, `PC` terminal, `EA` fix, `D ` VOR, `DB` NDB, `PN` terminal NDB (kind `ndb` with
`airport`). A fix is looked up in NASR by ident and kind; found → only the `FixRef`; not found → also into `waypoints`
from the CIFP record of it. A procedure with a fix found nowhere is skipped and counted. Airports: the NASR extract's
airports with records in the CIFP. CLI: `node generator/navdata/extract-cifp.mjs <FAACIFP18>`, writes
`cifp-<cycle>.json` sorted and indented like the NASR extract, prints counts and every skip reason.

- [ ] **Step 4: Run the tests, then generate the extract**

Run: `npm run screens:test -- generator/test/extractCifp.test.ts` → PASS.
Run: `node generator/navdata/extract-cifp.mjs E:/msfs/CIFP_261001/FAACIFP18` → writes `cifp-2610.json`; the summary
lists skips (expect none or a few named ones; no procedure of KYKM or KBFI skipped).

- [ ] **Step 5: Commit**

`git commit -m "Extract the SIDs, STARs and approaches of the extract's airports from the FAA CIFP."`

---

### Task 3: Procedures in the unit's navdata

**Files:**
- Modify: `kln90b/generator/lib/navdata.ts` (`loadProcedures`, `facilitiesOf`)
- Modify: `kln90b/generator/harness-lgpl/builders.ts` and its `README.md` (`intersection` and `ndb` gain `airport?: string`)
- Test: `kln90b/generator/test/procedures.capture.test.ts`

**Interfaces:**
- Consumes: `CifpExtract` (Task 2); `Leg`, `sid`, `star`, `approach`, `withProcedures`, `runwayFix` from
  `vendor/kln90b/test/harness/navdata/procedures.ts`, or `FlightPlan.createLeg` for leg types `Leg` lacks.
- Produces: `export function loadProcedures(): CifpExtract`, and
  `facilitiesOf(x: NavdataExtract, p?: CifpExtract): Facility[]` that returns airports with their procedures, the
  terminal and out-of-region waypoints, and the runway facilities procedures use. `generate.ts` passes
  `loadProcedures()`; `facility()` and `place()` keep their signatures.

- [ ] **Step 1: Write the failing tests**

```ts
const apt = (ident: string) => facilitiesOf(loadExtract(), loadProcedures()).find(f => f.icaoStruct.ident === ident) as AirportFacility;
it('splits a runway transition for both parallels into one per runway, as the simulator does', () => {
	const chins = apt('KBFI').arrivals.find(p => p.name === 'CHINS5')!;
	expect(chins.runwayTransitions.map(r => RunwayUtils.getRunwayNameString(r.runwayNumber, r.runwayDesignation)).sort())
		.toEqual(['14L', '14R', '32L', '32R']);
});
it('delivers a leg whose fix is the airport itself without a fix', () => {
	const last = apt('KBFI').arrivals.find(p => p.name === 'CHINS5')!.runwayTransitions[0].legs.at(-1)!;
	expect(last.fixIcaoStruct.ident.trim()).toBe('');
});
it('marks the IAF of an approach transition and RNP AR approaches', () => {
	const r32ly = apt('KBFI').approaches.find(a => a.approachType === ApproachType.APPROACH_TYPE_RNAV && a.runway === '32L' && a.approachSuffix === 'Y')!;
	const humpp = r32ly.transitions.find(t => t.name === 'HUMPP')!;
	expect(BitFlags.isAll(humpp.legs[0].fixTypeFlags, FixTypeFlags.IAF)).toBe(true);
	expect(r32ly.rnpAr).toBe(false);
	expect(apt('KBFI').approaches.filter(a => a.approachSuffix === 'Z').every(a => a.rnpAr)).toBe(true);
});
it('gives a terminal waypoint the ICAO of its airport', () => { /* a waypoint of kind 'terminal' of KBFI: icaoStruct.airport === 'KBFI', type 'W' */ });
```

Plus one capture test: boot with `bootUnit` the way `generate.ts` does at `place('KYKM')`, select APT 7 on the right,
enter KYKM, and assert the screen lists `YKM7`.

- [ ] **Step 2: Run and see them fail**

Run: `npm run screens:test -- generator/test/procedures.capture.test.ts` → FAIL.

- [ ] **Step 3: Implement**

Transcoding (spec, "Procedures"): `32B` → one transition per runway end of that number the airport has (letters from
the NASR runway designations), same legs, fresh leg objects each; `ALL` → one per runway end. A leg with
`fix.kind === 'airport'` gets an empty fix ICAO. Approach types: `P` GPS, `R` RNAV (LNAV flag), `H` RNAV with
`rnpAr: true`, `I` ILS, `L` LOC, `B` back course, `D` VOR/DME, `V`/`S` VOR, `N` NDB, `Q` NDB/DME, `X` LDA, `U` SDF;
others are left out and counted in a thrown-away stat (log nothing). Roles map to `FixTypeFlags` IAF/IF/FAF/MAP; mag
courses and navaids as in the harness `Leg` builders. A `FixRef` resolves to the extract facility of that ident and
kind (terminal ones carry `airport`), a runway to `runwayFix(airport, designation)`.

- [ ] **Step 4: Run the tests and the type check**

Run: `npm run screens:test -- generator/test/procedures.capture.test.ts` → PASS; type check clean.

- [ ] **Step 5: Commit**

`git commit -m "Give the airports of the screens their procedures, transcoded the way the simulator delivers them."`

---

### Task 4: The airspace extract

**Files:**
- Create: `kln90b/generator/navdata/extract-airspaces.mjs`
- Create: `kln90b/generator/test/fixtures/airspaces/Class_Airspace.geojson`, `.../Airspace_Boundary.geojson` (a few
  real feature lines each, see Step 1)
- Create: `kln90b/generator/navdata/airspaces-2026-10-22.json` (generated; the date is the download date)
- Modify: `kln90b/generator/navdata/README.md`
- Test: `kln90b/generator/test/extractAirspaces.test.ts`

**Interfaces:**
- Produces: `export async function extractAirspaces(classFile: string, boundaryFile: string, regions: Region[], date: string, stats?: object): Promise<AirspaceExtract>`

```ts
interface AirspaceExtract {
	date: string; source: string;
	airspaces: {name: string; kind: 'B' | 'C' | 'center'; ident?: string; sector?: string;
		lowerFt: number; lowerRef: 'MSL' | 'SFC' | 'AGL'; upperFt: number | null; upperRef: 'MSL' | 'AGL' | null;
		polygon: [number, number][]}[];      // outer ring as [lat, lon], not closed, rounded to 5 decimals
}
```

- [ ] **Step 1: Build the fixtures and write the failing tests**

From the real files (`grep` the lines, never load the large one whole): Seattle class B `AREA A` and `AREA B`, one class
C feature of the region (Portland), one class B far away (Atlanta), one `MODE C` feature; from `Airspace_Boundary`, the
ZSE `ARTCC_L` and `ARTCC_H` features. Build one synthetic feature line with a hole and one `MultiPolygon` from the
Seattle area A coordinates. Tests:
- Kinds and names: exactly the Seattle shelves, the Portland class C and ZSE (`kind 'center'`, `ident 'ZSE'`); not
  Atlanta, not MODE C, not `ARTCC_H`.
- Area A: `lowerFt 0`, `lowerRef 'SFC'`, `upperFt 10000`, `upperRef 'MSL'`; area B `lowerFt 1100 'MSL'`.
- A polygon with a hole yields one airspace with the outer ring only; a multipolygon yields one airspace per part.
- The output is the same when the class file is read as a stream of lines with CRLF endings.

- [ ] **Step 2: Run and see them fail**

Run: `npm run screens:test -- generator/test/extractAirspaces.test.ts` → FAIL.

- [ ] **Step 3: Implement**

Read both files line by line (`readline` over `fs.createReadStream`), parse each line that starts with `{"type":"Feature"`
(strip a trailing comma). Keep class B/C (`CLASS` `B`/`C`) and `LOCAL_TYPE` `ARTCC_L`. A feature is in a region when a
vertex of its outer ring lies within `radiusNm` of a region center or the center lies inside the ring (same great-circle
distance as `extract-nasr.mjs`). `-9998` limits become `null`. CLI:
`node generator/navdata/extract-airspaces.mjs <Class_Airspace.geojson> <Airspace_Boundary.geojson> <YYYY-MM-DD>`.

- [ ] **Step 4: Run the tests, then generate the extract**

Run: `npm run screens:test -- generator/test/extractAirspaces.test.ts` → PASS.
Run: `node generator/navdata/extract-airspaces.mjs E:/msfs/Class_Airspace.geojson E:/msfs/Airspace_Boundary.geojson 2026-10-22`
→ writes `airspaces-2026-10-22.json`; summary counts per kind.

- [ ] **Step 5: Commit**

`git commit -m "Extract the class B and C airspace and the Center boundaries of the region from the FAA's ADDS data."`

---

### Task 5: Airspaces on the unit, the alert off, and CL B on APT 1

**Files:**
- Modify: `kln90b/generator/lib/navdata.ts` (`loadAirspaces`, `airspacesOf`)
- Modify: `kln90b/generator/lib/generate.ts` (pass airspaces; default storage)
- Modify: `kln90b/generator/README.md` ("Defaults of a screen": airspace alert off; airspaces in the data)
- Modify: `kln90b/screens/apt-1-ksea/screen.ts`, `fields.mdx`; regenerated `screen.txt`
- Test: `kln90b/generator/test/airspaces.test.ts`

**Interfaces:**
- Produces: `export function loadAirspaces(): AirspaceExtract`;
  `export function airspacesOf(a: AirspaceExtract, x: NavdataExtract): BoundaryFacility[]` (class B → `BoundaryType.ClassB`,
  C → `ClassC`, center → `Center` with `frequencyMHz` = the first of that ARTCC's `centers` frequencies, `frequencyName`
  the airspace name); `export function screenStorage(position?: {lat: number; lon: number}, own?: Record<string, unknown>): Record<string, unknown>`
  in `generate.ts`, which returns `{airspaceAlertEnabled: false, lastLatitude, lastLongitude, ...own}`.

- [ ] **Step 1: Write the failing tests**

```ts
it('gives ZSE its first Center frequency', () => {
	const zse = airspacesOf(loadAirspaces(), loadExtract()).filter(b => b.type === BoundaryType.Center);
	expect(zse.map(b => (b as any).frequency.freqMHz)).toEqual([124.85]);
});
it('turns the airspace alert off unless the screen turns it on', () => {
	expect(screenStorage({lat: 1, lon: 2})).toEqual({airspaceAlertEnabled: false, lastLatitude: 1, lastLongitude: 2});
	expect(screenStorage(undefined, {airspaceAlertEnabled: true}).airspaceAlertEnabled).toBe(true);
});
```

Check the exact setting key against `vendor/kln90b/kln90b/settings/KLN90BUserSettings.ts` (`airspaceAlertEnabled`)
and how the harness storage stores a boolean.

- [ ] **Step 2: Run and see them fail** — `npm run screens:test -- generator/test/airspaces.test.ts` → FAIL.

- [ ] **Step 3: Implement** with the vendor `airspace()` builder (`vendor/kln90b/test/harness/navdata/airspaces.ts`),
`lowerRef` SFC/AGL → `BoundaryAltitudeType.AGL`, MSL → `MSL`, `null` upper → `Unlimited`. `generate.ts` passes
`airspaces: airspacesOf(...)` and `storage: screenStorage(...)`; drop `'airspaces'` from the `Omit` only if a screen
should set its own (it should not: keep it omitted).

- [ ] **Step 4: Run the tests** → PASS.

- [ ] **Step 5: Add the class field to APT 1 and regenerate every screen**

In `apt-1-ksea/screen.ts` add `{id: 'class', find: {re: /CL B/, area: 'R'}}` and a `<Field id="class" title="Airspace
class">` placeholder. Run `npm run screens`. Expected: `git status` shows only `screens/apt-1-ksea/*` changed, and its
`screen.txt` has `CL B` on the line under the name. Any other changed screen is a finding: stop and explain it.

- [ ] **Step 6: Commit**

`git commit -m "Load the airspaces into the unit with the alert off by default, and show the class of Seattle-Tacoma on APT 1."`

---

### Task 6: OTH 2 and the OTH page reference

**Files:**
- Create: `kln90b/screens/oth-2-zse/screen.ts`, `fields.mdx`, generated `screen.txt`
- Create: `kln90b/src/content/docs/pages/oth.mdx`

**Interfaces:**
- Consumes: Center airspaces from Task 5.

- [ ] **Step 1: Describe the screen**

`show: 'left'`, `boot.position: place('KYKM')`, steps select OTH 2 on the left and `wait` until the search has run
(`Oth2Page` searches every 10 s). Fields cover every label and value on the left half and the status line page name;
read `vendor/kln90b/kln90b/pages/left/Oth2Page.tsx` for the layout.

- [ ] **Step 2: Generate**

Run: `npm run screens -- screens/oth-2-zse` → PASS; `screen.txt` shows `124.85`.

- [ ] **Step 3: The page**

`pages/oth.mdx` like `pages/set.mdx`: `title: OTH pages`, a one-sentence description, `sidebar.order: 8`, placeholder
paragraphs, sections `## OTH 1`, `## OTH 2` (with `<KlnScreen screen="oth-2-zse" />`), `## OTH 3 and OTH 4`,
`## OTH 5 to OTH 8` and `## OTH 9 and OTH 10` with a `<Callout kind="availability">` placeholder each (fuel computer, air
data computer). Check the OTH page names in `src/data/pageTree.ts` and group the headings to match.

- [ ] **Step 4: Build** — `npm run build` → passes with no new `[page links]` warning.

- [ ] **Step 5: Commit** — `git commit -m "Add the OTH page reference with a generated OTH 2 screen."`

---

### Task 7: Super NAV 5 in the generator

**Files:**
- Modify: `kln90b/generator/lib/capture.ts`, `kln90b/generator/lib/fields.ts`, `kln90b/generator/lib/generate.ts`
- Modify: `kln90b/src/lib/screenFile.ts` (layout `super-nav-5`, side `F`)
- Modify: `kln90b/generator/README.md` ("Map fields": side `F`; Super NAV 5)
- Test: `kln90b/src/lib/screenFile.test.ts`, `kln90b/generator/test/superNav5.capture.test.ts`

**Interfaces:**
- Produces: `ScreenCapture.layout: 'split' | 'full' | 'super-nav-5'`; map sides `'L' | 'R' | 'F'` (`MapSide` in
  `fields.ts`, `screenFile.ts`); `CapturedScreen.canvases.F`. Map locators `{map: 'F', draw}`. A `super-nav-5` screen
  has `show: 'both'`, `status no`, text area `F`.

The grid of a `super-nav-5` screen is 23 × 7, built from the DOM the way `vendor/kln90b/test/harness/render/superNav5.ts`
reads it, with `readRows` (exported by `test/harness/render/screen.ts`) so that cells keep their attributes:
- columns 0–5, rows 0–6: `.super-nav5-left-controls` without its `.super-nav5-mgs-range`;
- columns 6 onward, rows 5–6: the two rows of `.super-nav5-mgs-range` (`msg`, then the range); the site draws them 6
  unit pixels right of column 6 (CSS `left: 6 * charWidth + 6`);
- all other cells blank.
A visible `.super-nav5-right-controls-parent` or `.super-nav5-directto-window` throws
`Super NAV 5 with the right menu or the direct-to window is not supported yet`.
The map is the `.canvas-fullpage` canvas, side `F`.

- [ ] **Step 1: Write the failing tests**

- `screenFile.test.ts`: a capture with `layout 'super-nav-5'`, `maps ['F']`, a map field on `F` round-trips; every
  committed `screens/*/screen.txt` of the other layouts parses and re-serializes to the same text.
- `superNav5.capture.test.ts`, with `generateScreen` into a temp folder (copy the pattern of
  `generate.capture.test.ts`): a unit at `pointFrom(place('KSEA'), 180, 20)` with `savedFlightplan(0, [facility('KPDX'),
  facility('KSEA')])`, `moveAircraft`, Direct To KSEA answered with `adjustCourseIndicator`, `showSuperNav5(u)`; fields
  for the left column rows by regex and map fields `{map: 'F', draw: /./, many: true}`. Expect `screen.txt` to contain
  `layout super-nav-5` and `map F`, and `map-F.svg` to exist. A second case leaves ADJ NAV IND CRS unanswered and expects
  the error `a message is pending`.

- [ ] **Step 2: Run and see them fail** — `npm run screens:test -- src/lib/screenFile.test.ts generator/test/superNav5.capture.test.ts` → FAIL.

- [ ] **Step 3: Implement** the layout through `inspect`, `readGrid`, `mapsOf`, `locateFields`/`locateMapFields`
(`SHOWN` depends on the layout: `super-nav-5` shows `['F']`), the `msg` check (for `super-nav-5`: row 5, columns 6–8),
and the screen file reader and writer.

- [ ] **Step 4: Run the tests** → PASS; `npm run screens` regenerates every existing screen byte-identical
(`git status` clean under `screens/`).

- [ ] **Step 5: Commit** — `git commit -m "Capture Super NAV 5 with its full-page map."`

---

### Task 8: Super NAV 5 on the site

**Files:**
- Modify: `kln90b/src/lib/screenHtml.ts`, `kln90b/src/lib/screens.ts`, `kln90b/src/components/KlnScreen.astro`
- Modify: `kln90b/src/styles/kln-screen.css`
- Test: `kln90b/src/lib/screenHtml.test.ts`

**Interfaces:**
- Consumes: layout `super-nav-5` and map side `F` from Task 7. `Maps` becomes `Partial<Record<'L' | 'R' | 'F', string>>`.

Geometry in unit pixels (`--u`, as the existing CSS uses): the map at `left: 4 + 59`, `top: 3`, width 148, height 91
(`.canvas-fullpage`: `(6*9+5)`, `17*9-5`, `7*13`); a 1-unit vertical line at the right edge of the left column (x 58,
the `border-right` of `.super-nav5-left-controls`); the overlay rows 5–6 from column 6 shifted right by 6 units.

- [ ] **Step 1: Write the failing tests** in `screenHtml.test.ts`: a `super-nav-5` capture renders
`<div class="kln-map kln-map-full"` before the text, its map fields get the same `role="group"` and help-window wiring as
`kln-map-left`, the overlay cells sit in an element with class `kln-snav5-overlay`, and a `split` capture's HTML is
unchanged (compare with the current output of an existing test fixture).

- [ ] **Step 2: Run and see them fail** — `npm run screens:test -- src/lib/screenHtml.test.ts` → FAIL.

- [ ] **Step 3: Implement**; reuse `mapFieldsHtml` for side `F`.

- [ ] **Step 4: Run the tests** → PASS. Then show the Task 7 test screen on a scratch page or the dev server
(`npm run dev`) and compare it by eye with the layout of `vendor/kln90b/KLN90B.scss` `.super-nav5-*`; remove the
scratch page afterwards.

- [ ] **Step 5: Commit** — `git commit -m "Show Super NAV 5 screens on the site."`

---

### Task 9: The departure screens

**Files:**
- Create: `kln90b/screens/shared/tut2.ts`
- Create: `kln90b/screens/tut2-apt-7-sid-procedure/`, `tut2-apt-7-sid-runway/`, `tut2-apt-7-sid-load/` (each
  `screen.ts`, `fields.mdx`, generated files)

**Interfaces:**
- Produces in `shared/tut2.ts`: `export const TUT2_ENROUTE = ['KYKM', 'TITON', 'CADED', 'CHINS', 'KBFI']`;
  `export const tut2Boot: ScreenDescription['boot']` (at `place('KYKM')`, FPL 0 = `TUT2_ENROUTE` via `savedFlightplan`);
  `export async function loadSid(u: HeadlessUnit)`, `loadStar(u)`, `loadApproach(u)`: each walks its selection to the
  end and answers every message it raises; `export async function cleanUpDuplicates(u: HeadlessUnit)` (Task 11).

- [ ] **Step 1: Find the steps**

Read `Apt7Page.tsx` (`Apt7ProcedurePage`, `Apt7RunwayPage`, `Apt7TransitionPage`, `Apt7PreviewPage`, the add and
replace pages and when each appears). With FPL 0 holding KYKM, YKM7 has no en route transition, so the expected
sequence is procedure list → runway list → preview with `LOAD IN FPL`. If the unit shows another page in between, it
gets a screen of its own (`tut2-apt-7-sid-<page>`).

- [ ] **Step 2: Describe and generate each screen**

`show: 'right'`; each screen's steps go to APT 7 of KYKM, select SID, and stop with the cursor on the choice of that step:
`YKM7`, `RW27`, `LOAD IN FPL`. Fields cover every row of the right half and the status line fields shown. Run
`npm run screens -- screens/tut2-apt-7-sid` → PASS for all; read each `screen.txt` and check the inverse cells mark the
chosen value.

- [ ] **Step 3: Commit** — `git commit -m "Generate the APT 7 screens of selecting the YAKIMA SEVEN departure."`

---

### Task 10: The arrival and approach screens

**Files:**
- Create: `kln90b/screens/tut2-apt-7-star-procedure/`, `-star-transition/`, `-star-runway/`, `-star-load/`
- Create: `kln90b/screens/tut2-apt-8-approach/`, `tut2-apt-8-iaf/`, `tut2-apt-8-load/`
- Modify: `kln90b/screens/shared/tut2.ts`

**Interfaces:**
- Consumes: `tut2Boot`, `loadSid`, `loadStar` from Task 9.

- [ ] **Step 1: STAR screens.** Each starts with `loadSid(u)`, then APT 7 of KBFI, STAR: cursor on `CHINS5`, on the
transition `YKM`, on the runway `RW32L` (the runway of the approach; four entries until kln90b#409 is fixed), on
`LOAD IN FPL`. Follow the order `Apt7Page.tsx` uses for a STAR (transition before runway).
- [ ] **Step 2: Approach screens.** Each starts with `loadSid(u)` and `loadStar(u)`, then APT 8 of KBFI
(`Apt8Page.tsx`: `Apt8IAPPage`, `Apt8IAFPage`, `Apt8PreviewPage`): cursor on the RNAV 32L Y approach, on `HUMPP`, on the
load entry. The unit installation must allow approaches: use `panelXml` with the approach-certified option the
harness tests use for APT 8 (read `vendor/kln90b/test/harness/panelXml.ts`).
- [ ] **Step 3: Generate** — `npm run screens -- screens/tut2-apt` → PASS; check every screen's inverse cells.
- [ ] **Step 4: Commit** — `git commit -m "Generate the APT 7 screens of the CHINS FIVE arrival and the APT 8 screens of the RNAV (GPS) Y 32L approach."`

---

### Task 11: The assembled route on Super NAV 5, and the tutorial page

**Files:**
- Create: `kln90b/screens/tut2-super-nav-5-route/`
- Modify: `kln90b/screens/shared/tut2.ts` (`cleanUpDuplicates`)
- Modify: `kln90b/src/content/docs/getting-started/tutorial-2.mdx`

**Interfaces:**
- Consumes: Tasks 7–10.

- [ ] **Step 1: Clean up and list FPL 0**

Implement `cleanUpDuplicates(u)`: after `loadSid`, `loadStar`, `loadApproach`, delete the duplicate waypoints on FPL 0
with the left cursor as a pilot does: the en route copies the unit's `REDUNDANT WPTS IN FPL` message points at, and the
arrival's copies of the approach's waypoints, deleted from the end of the arrival. Read FPL 0 afterwards and write the
list of waypoints into the task report.

- [ ] **Step 2: STOP — the maintainer checks the list**

Show the maintainer the FPL 0 list from Step 1 and wait for confirmation before generating the screen. Adjust
`cleanUpDuplicates` to their answer.

- [ ] **Step 3: Describe and generate the screen**

`show: 'both'`; the aircraft at a plausible place on the route with GPS ground speed, `showSuperNav5(u)`, the range set
with the left cursor so that every waypoint of FPL 0 from KYKM to the approach is on the map; cursor off afterwards.
Map fields claim every element (`many: true` for the flight plan legs). `npm run screens -- screens/tut2-super-nav-5-route`
→ PASS.

- [ ] **Step 4: The page**

In `tutorial-2.mdx` import `KlnScreen` and add, without new text: under "Building the flight plan" the three departure
screens, the four arrival screens and then `tut2-super-nav-5-route`; under "The approach" the three APT 8 screens, each
in selection order. Run `npm run build` → passes, no new `[page links]` warning. Open the page on `npm run dev` and look
at every screen once.

- [ ] **Step 5: Commit** — `git commit -m "Show the procedure selection steps and the assembled route of tutorial flight 2."`

---

### Task 12: Final check

- [ ] `npm run screens:test` → all PASS. `npm run screens` → `git status` clean (every screen reproduces). Type check clean.
  `npm run build` → passes without new `[page links]` warnings.
- [ ] `git -C ../vendor/kln90b status --porcelain` is empty and the pin is unchanged.
- [ ] `git grep -n -i "e:[/\\]msfs" -- kln90b` finds nothing (no local download path committed).
