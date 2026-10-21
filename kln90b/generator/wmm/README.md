# World Magnetic Model data

`WMMHR.COF` holds the coefficients of NOAA's high-resolution World Magnetic Model WMMHR2025 (model epoch 2025.0, valid
2025 to 2030, degree and order 133). `WMMHR2025_TEST_VALUES.txt` holds NOAA's reference results for it. Both files were
downloaded from NOAA NCEI (https://www.ncei.noaa.gov/products/world-magnetic-model) and are in the public domain. They
are stored unchanged.

`generator/lib/wmm.ts` evaluates the model. The screens use degree and order 12 (`SCREEN_DEGREE`); the test checks the
full degree against the test values.
