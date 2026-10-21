# Navdata of the example screens

The example screens show real US places. Their data is the FAA's public NASR data, never the simulator's and never
Navigraph's. `extract-nasr.mjs` turns the NASR 28-day subscription (CSV) into one neutral JSON file for the regions in
`regions.json`; the screens load only that file.

## Updating the extract

1. Download the current CSV data from the FAA's NASR Subscription page and unzip it into a folder outside this
   repository. Nothing from that folder is committed except the generated file.
2. From `kln90b/`:

   ```bash
   node generator/navdata/extract-nasr.mjs <unzipped CSV folder>
   ```

3. The script writes `nasr-<effective date>.json` here and prints a summary: the counts per type, how many regions it
   derived from the fixes of an ARTCC, how many it had to set to `K1`, and every record or value it skipped or
   defaulted, with the reason. Commit the new file and delete the old one; the records are sorted and indented so that
   the diff shows what changed.

Add a region to `regions.json` (`name`, `lat`, `lon`, `radiusNm`) to extract more. A record is included when it lies
within `radiusNm` of any region's center, measured along the great circle on a sphere of radius 3440.065 NM.

## Input

Six files of the download: `APT_BASE.csv`, `APT_RWY.csv`, `APT_RWY_END.csv`, `FRQ.csv`, `NAV_BASE.csv` and
`FIX_BASE.csv`. The script finds the columns by name in the header, and stops with the file and every missing column if
the FAA renames one. The column names and codes are described by the `*_CSV_DATA_STRUCTURE.csv` and
`* DATA LAYOUT.pdf` files of the same download. The effective date comes from `EFF_DATE`; the three files that carry
it must agree.

## Output format

All angles are degrees, true; distances are feet; frequencies are MHz, except NDBs in kHz. Every list is sorted by
ident (runways by designation, frequencies by use and then MHz).

- `cycle`, `source`: the effective date `YYYY-MM-DD` and a description of the data.
- `regions`: the regions the extract was made for.
- `airports`: `ident` (the FAA identifier, so `SEA`, not `KSEA`), `name`, `city`, `lat`, `lon`, `elevationFt`,
  `towered`, `heliport`, `runways`, `frequencies`.
- `vors`: `ident`, `name`, `type` (`VOR`, `VOR/DME` or `VORTAC`), `lat`, `lon`, `mhz`, `declinationEast` and `region`.
- `ndbs`: `ident`, `name`, `lat`, `lon`, `khz`, `region`.
- `fixes`: `ident`, `lat`, `lon`, `region`.

### What gets in

- Airports: public use, site type airport or heliport. Seaplane bases, gliderports and balloonports are left out.
  `towered` is set when the tower type code starts with `ATCT`.
- A heliport keeps the runways list of its helipads, which is usually empty or `H1`-style entries. An airport without
  runways is a heliport as far as the screens are concerned.
- Navaids: operational status only (`OPERATIONAL IFR`, `OPERATIONAL VFR ONLY`, `OPERATIONAL RESTRICTED`). VOR, VOR/DME
  and VORTAC are VORs; NDB and NDB/DME are NDBs. DME, TACAN, VOT, markers and marine beacons are left out.
- Fixes: all of them, whatever their use code.

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
