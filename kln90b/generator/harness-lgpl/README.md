# Copied harness code (LGPL-3.0)

`builders.ts` is a copy of `test/harness/navdata/builders.ts` of https://github.com/falcon71/kln90b at commit
`3d371f34a68144c80f8e7035490d8f0391b0eb45`, the commit `vendor/kln90b` is pinned to. It builds the facilities the
simulated unit finds in its navdata. The code is licensed under the LGPL-3.0, so it stays here with the license texts
(`LICENSE.LGPL-3.0.txt` and the GPL-3.0 it refers to), and the rest of this repository does not take on that license.

## What was changed

Modified 2026-10-21 and 2026-10-22. Only these additions; nothing of the original was removed or changed in behavior,
and without the new options every builder returns what it returned before.

- A header comment naming the source file and the commit, and `FacilityFrequency` in the SDK import.
- `RunwayOptions` gained:
  - `designation`: the designation as published (`16L-34R`). It is stored without letters (`16-34`), the letters set
    `designatorCharPrimary` and `designatorCharSecondary`, and `heading` is the heading of the first named end and
    becomes `direction`. A designation that is no pair of ends (`H1`) is stored as is.
  - `lat` and `lon`: the position of the runway, by default the airport's.
  - `lit`: full-time lighting when true, none when false, unknown when absent.
- `AirportOptions` gained `frequencies`, a list of `FrequencyOptions` (`name`, `type`, `mhz`) that becomes
  `AirportFacility.frequencies`, with `freqBCD16` computed from the frequency. Choosing which NASR frequencies become
  one of these, and their type, is the job of `lib/navdata.ts`, not of the copy.
- The helpers `PAIR`, `designator`, `bcd16` and `frequency`, and the exported `FrequencyOptions`.
- `intersection` and `ndb` gained the option `airport` (modified 2026-10-22): the airport a terminal waypoint or terminal
  NDB belongs to, which becomes the airport of its ICAO. Without it the ICAO has no airport, as before.

Compare with `git -C vendor/kln90b show 3d371f34a68144c80f8e7035490d8f0391b0eb45:test/harness/navdata/builders.ts` to see
the difference. `.gitattributes` keeps this folder on LF line endings, as the original has them.

## Moving the pin

When the submodule pin moves, copy the file again from the new commit, apply the changes above and update the commit
here and in the header of `builders.ts`.
