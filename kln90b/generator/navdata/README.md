# Navdata of the example screens

The example screens show real US places. Their data is the FAA's public data, never the simulator's and never
Navigraph's. `extract-nasr.mjs` turns the NASR 28-day subscription (CSV) into one neutral JSON file for the regions in
`regions.json`, and `extract-cifp.mjs` takes the SIDs, STARs and approaches of that file's airports from the CIFP into a
second one. The screens load only these files.

## Downloads

The FAA publishes everything the generator reads. Download each file into a folder outside this repository; nothing
from those folders is committed except the generated files.

| Download | Link | Read by |
| --- | --- | --- |
| NASR subscription, CSV data | https://www.faa.gov/air_traffic/flight_info/aeronav/aero_data/NASR_Subscription/ | `extract-nasr.mjs`, from the unzipped folder |
| CIFP, the file `FAACIFP18` | https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/cifp/download/ | `extract-cifp.mjs`, from the file |
| Airspace Boundary | https://adds-faa.opendata.arcgis.com/datasets/faa::airspace-boundary-1/about | the airspaces script, from the GeoJSON file |
| Class Airspace | https://adds-faa.opendata.arcgis.com/datasets/faa::class-airspace/about | the airspaces script, from the GeoJSON file |

## Updating the extract

1. Download the current CSV data from the FAA's NASR Subscription page (see Downloads) and unzip it into a folder outside
   this repository. Nothing from that folder is committed except the generated file.
2. From `kln90b/`:

   ```bash
   node generator/navdata/extract-nasr.mjs <unzipped CSV folder>
   ```

3. The script writes `nasr-<effective date>.json` here and prints a summary: the counts per type (the Centers too),
   how many regions it derived from the fixes of an ARTCC, how many it had to set to `K1`, and every record or value it
   skipped or defaulted, with the reason. Commit the new file and delete the old one; the records are sorted and
   indented so that the diff shows what changed.

Add a region to `regions.json` (`name`, `lat`, `lon`, `radiusNm`) to extract more. A record is included when it lies
within `radiusNm` of any region's center, measured along the great circle on a sphere of radius 3440.065 NM.

## Input

The files of the download that the script reads (it names them when one is missing): `APT_BASE.csv`, `APT_RWY.csv`,
`APT_RWY_END.csv`, `FRQ.csv`, `NAV_BASE.csv` and `FIX_BASE.csv`. The script finds the columns by name in the header, and stops with the file and every missing column if
the FAA renames one. The column names and codes are described by the `*_CSV_DATA_STRUCTURE.csv` and
`* DATA LAYOUT.pdf` files of the same download. The effective date comes from `EFF_DATE`; the three files that carry
it must agree.

## Output format

All angles are degrees, true; distances are feet; frequencies are MHz, except NDBs in kHz. Every list is sorted by
ident (runways by designation, frequencies by use and then MHz).

- `cycle`, `source`: the effective date `YYYY-MM-DD` and a description of the data.
- `regions`: the regions the extract was made for.
- `airports`: `ident`, `faaId`, `name`, `city`, `lat`, `lon`, `elevationFt`, `towered`, `heliport`, `runways`,
  `frequencies`. `ident` is the identifier the simulator shows: the ICAO identifier (`ICAO_ID` of `APT_BASE.csv`) where
  the airport has one (`KSEA`), otherwise the FAA identifier (`S77`). Canadian fields carry their ICAO identifier in the
  FAA column already (`CYVR`). `faaId` is always the FAA identifier (`SEA`); runways and frequencies are filed under it
  in the data, and airports are sorted by `ident`.
- `vors`: `ident`, `name`, `type` (`VOR`, `VOR/DME` or `VORTAC`), `lat`, `lon`, `mhz`, `declinationEast` and `region`.
- `ndbs`: `ident`, `name`, `lat`, `lon`, `khz`, `region`.
- `fixes`: `ident`, `lat`, `lon`, `region`.
- `centers`: `artcc` (`ZSE`) and `frequencies`, in MHz. Sorted by `artcc`.

### What gets in

- Airports: public use, site type airport or heliport. Seaplane bases, gliderports and balloonports are left out.
  `towered` is set when the tower type code starts with `ATCT`.
- A heliport keeps the runways list of its helipads, which is usually empty or `H1`-style entries. An airport without
  runways is a heliport as far as the screens are concerned.
- Navaids: operational status only (`OPERATIONAL IFR`, `OPERATIONAL VFR ONLY`, `OPERATIONAL RESTRICTED`). VOR, VOR/DME
  and VORTAC are VORs; NDB and NDB/DME are NDBs. DME, TACAN, VOT, markers and marine beacons are left out.
- Fixes: all of them, whatever their use code.
- Centers: an ARTCC qualifies when a row of `FRQ.csv` for one of its remote sites (`FACILITY_TYPE` `RCAG`) lies within a
  region. The row's position is the one the file gives for that row, which for most rows is the airport the site
  serves. The `frequencies` are then all the RCAG rows of that ARTCC (`ARTCC_OR_FSS_ID`) with `SECTORIZATION` `LOW` or
  `LOW/HIGH`, from 118.000 to 136.975 MHz, without 121.5, in file order and each once, wherever the site lies: a
  Center's frequencies are those of the whole ARTCC, not of the region.

### Runways

- `designation` is published as `16L-34R` (the slash of the data becomes a dash). `surface` is the NASR surface code as
  published (`ASPH`, `CONC`, `TURF`, `ASPH-G` ...). `lit` is set for any edge light code but none.
- `headingTrue` is the published true alignment of the end that comes first in the designation. Where the data lacks
  it, the bearing between the two end positions is used, and failing that the designation times ten plus the airport's
  magnetic variation. A helipad has no heading and gets 0. The summary counts each case.
- `lat` and `lon` are the great circle midpoint of the two end positions. With one end position it is that end, with
  none it is the airport position. The summary counts these cases too.

### Frequencies

Every frequency FRQ.csv lists for the airport (matched by identifier and by site type, so a heliport and an airport of
the same identifier do not mix). `use` is the NASR text as published and `mhz` the frequency. A pair of use and
frequency appears once, even where the FAA lists it once per sector. Entries without a frequency and receive-only
frequencies such as `122.1R` are dropped. The list is not filtered by what a unit would show: it includes UHF
frequencies and the procedure names (`SUMMA DP`) that approach control frequencies are filed under. Whoever uses the
frequencies selects.

### Regions

A fix has its own ICAO region. A navaid has none (`REGION_CODE` of `NAV_BASE.csv` is the FAA region), so it takes the
ICAO region that most fixes of its ARTCC carry, from its low altitude ARTCC, otherwise the high altitude one. A navaid
whose ARTCC has no fixes, such as a Canadian one, gets `K1`. The summary says how many records each rule covered.

## The CIFP extract

The CIFP (Coded Instrument Flight Procedures) is the FAA's procedure data in ARINC 424, one fixed-width record of 132
columns per line. `extract-cifp.mjs` reads the file `FAACIFP18` of the download and the newest `nasr-*.json` here.

### Updating it

1. Download the current CIFP (see Downloads) and unzip it into a folder outside this repository. Update the NASR
   extract first when its cycle changed too, since the CIFP extract takes the airports and facilities from it.
2. From `kln90b/`:

   ```bash
   node generator/navdata/extract-cifp.mjs <path to FAACIFP18>
   ```

3. The script writes `cifp-<cycle>.json` here (`cifp-2610.json` for cycle 2610) and prints a summary: the NASR extract
   it used, the counts of airports, SIDs, STARs, approaches and waypoints, every procedure it skipped with the reason,
   and what it left out of the procedures it kept. Commit the new file and delete the old one.

### What gets in

- Airports: those of the NASR extract that have SIDs (subsection `PD`), STARs (`PE`) or approaches (`PF`) in the CIFP,
  matched by the identifier the unit shows (`KYKM`, `S50`).
- Every procedure of those airports with every leg, whatever its path terminator. The unit filters the legs itself.
- A procedure is skipped, and named in the summary, when one of its fixes can be found neither in the NASR extract nor
  in the CIFP, when the navaid of one of its arcs is not a VOR, or when a record of it has a route type or a value the
  script does not read.

### Output format

Courses are degrees magnetic, distances nautical miles, positions degrees. Airports, procedures, transitions and
waypoints are sorted by name or ident; legs stay in the order the CIFP gives them.

- `cycle`, `source`: the CIFP cycle (`2610`) from the header record, and a description of the data.
- `airports`: `ident` and its `departures`, `arrivals` and `approaches`.
- A SID or STAR: `name` (`YKM7`), `runways` (runway transitions: `runway` and `legs`), `common` (the legs of the common
  route) and `transitions` (en route transitions: `name` and `legs`). The route type (column 20) decides the part: for
  SIDs `1`, `4` and `T` (vector SID) are runway transitions, `2` and `5` the common route, `3`, `6` and `V` en route
  transitions; for STARs `1` and `4` are en route transitions, `2` and `5` the common route, `3` and `6` runway
  transitions. `runway` is the CIFP's transition name without the `RW`: `27`, `32L`, `32B` for both parallels, `ALL`.
- An approach: `ident` (`R32LY`), `type`, `runway`, `suffix`, `rnav`, `transitions` (route type `A`), `final` and
  `missed`.
  `type` is the route type of the final approach: `R` RNAV, `H` RNP, `I` ILS, `L` localizer, `B` localizer back course,
  `N` NDB, `S` and `D` VOR. A circling approach spells its type differently in its ident (`VOR-A` is type `S`).
  `runway` and `suffix` come from the ident: `R32LY` is runway `32L`, suffix `Y`; `R02-Y` runway `02`; `VOR-A` has no
  runway and suffix `A`. The missed approach starts after the leg to the missed approach point (column 43 `M`),
  or where there is none at the leg that column 42 marks `M`.
  `rnav` lists the levels the approach is authorized for, as published: `LPV` (or `LP`), `LNAV/VNAV` and `LNAV`, each
  where its field is marked `A`. They come from the continuation record of application `W` (column 40) of the final
  approach, three fields of eleven columns from column 41 (R32LY: `['LPV', 'LNAV/VNAV', 'LNAV']`, R14RY: `['LPV',
  'LNAV/VNAV']`). An approach without that record, and an RNP AR approach, whose record has its RNP values elsewhere,
  has an empty list. No continuation record becomes a leg.
- A leg: `type`, the path terminator as published (`IF`, `TF`, `CF`, `AF`, `VM`, `HM`, `RF` ...); `fix` where the record
  names one; `navaid`, the recommended navaid, for `AF`, `CF` and `PI` legs; `courseMag`; `turn` (`L` or `R`);
  `flyOver` where column 41 is `Y`, or `B`, which marks a fly-over fix that ends its route part; `role` from column 43 (`A`, `C` and `D` are `IAF`, `B` and `I` are `IF`, `F` is
  `FAF`, `M` is `MAP`); `rhoNm`, `thetaDeg` and `arcRadiusNm` where the record has them. A leg to the airport keeps its
  fix.
- A fix or navaid: `ident`, `region` and `kind`, which comes from the section of its record: `airport` (`PA`), `runway`
  (`PG`, `RW32L`), `terminal` (`PC`), `fix` (`EA`), `vor` (`D`), `ndb` (`DB`, and `PN` for a terminal NDB). A terminal
  waypoint, a terminal NDB and a runway carry the `airport` they belong to.
- A fix is looked up in the NASR extract by ident and region among the facilities of its kind: `fixes` for `fix` and
  for `terminal` (NASR files terminal waypoints as fixes, without their airport), `vors` for `vor`, `ndbs` for `ndb`.
  The `airport` of a terminal waypoint or terminal NDB is no part of that lookup, so a reference that carries it can
  resolve to a NASR fix or NDB. Where NASR has the facility, the leg has the reference only.
- `waypoints`: the fixes and navaids the procedures need that the NASR extract does not have, with `ident`, `region`,
  `kind`, `airport` where it has one, `lat` and `lon` from their CIFP record. For a terminal waypoint or terminal NDB
  that is the record filed under the procedure's airport. These are the terminal waypoints NASR lacks and the fixes and
  VORs outside the regions that procedures inside them reach. A VOR also has what the NASR extract has of one, in the
  same units: `name` (columns 94-123), `type` (`VOR`, `VOR/DME` or `VORTAC`, from the second letter of the navaid class
  in column 29), `mhz` (columns 23-27, hundredths) and `declinationEast` (the station declination in columns 75-79,
  east positive). An NDB has `name` and `khz` (columns 23-27, tenths). A VOR or NDB with a value the script cannot read
  skips its procedure. A navaid that is only the recommended navaid of a `CF` or `PI` leg is listed too (`YVR` of region
  `CY`, which NASR files as `K1`); `navdata.ts` makes no facility of it, since the unit never loads that navaid.
- A localizer, TACAN or DME is no facility of either extract. As the navaid of a `CF` or `PI` leg it is left out, which
  the unit does not miss: it reads the navaid of an `AF` leg only. The summary counts them.
