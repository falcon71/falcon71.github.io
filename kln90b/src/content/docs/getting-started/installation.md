---
title: Installation
description: Which KLN 90B release to download for your simulator, where it goes in the Community folder, how to update or remove it, and what an aircraft needs to carry the unit.
---

Download the zip file for your simulator from the [home page](/kln90b/), unpack it, and put the folder `falcon71-kln90b` into the Community folder of the simulator. The package contains only the KLN 90B itself: you also need an aircraft that carries the unit, and the unit appears in no other aircraft.

## Choosing the version

Version 2.x of the KLN 90B is for Microsoft Flight Simulator 2024, and version 1.x is for Microsoft Flight Simulator 2020. A version does not work in the other simulator, so take the one that matches yours.

This manual describes version 2.x. Version 1.x differs from it, and this manual does not say how.

## Downloading

The [home page](/kln90b/) has a download button for each simulator. Each button gives the zip file of the newest release of that version. The file is named `falcon71-kln90b-` followed by the version, and it ends in `.zip`.

For an older version, or a version that the buttons do not offer, open the [Releases page](https://github.com/falcon71/kln90b/releases) of the KLN 90B on GitHub. Each release lists its files under Assets. Take the one named `falcon71-kln90b-` and ending in `.zip`.

**Note:** Every release also offers two archives named Source code, one as zip and one as tar.gz. They are the program's source files for developers, not the package, and the simulator cannot use them. Do not download them.

A release marked as a pre-release is a beta version for testing. The download buttons never offer one.

## Installing in the Community folder

The package goes into the Community folder of the simulator, in a folder of its own named `falcon71-kln90b`. The zip file contains this folder. In the Community folder the package must look like this:

```
Community
└── falcon71-kln90b
    ├── ContentInfo
    ├── html_ui
    ├── layout.json
    └── manifest.json
```

To install the package:

1. Unpack the zip file.
2. Copy the folder `falcon71-kln90b` into the Community folder of the simulator.
3. Compare the result with the folder structure above. If `manifest.json` is not directly in `falcon71-kln90b`, move the contents up by one level.
4. Start the simulator.

To update to a newer version, delete the folder `falcon71-kln90b` in the Community folder and install the new version as above.

To remove the unit, delete the folder `falcon71-kln90b` from the Community folder.

## An aircraft that carries the unit

Installing the package puts the unit into no aircraft by itself. The aircraft must have the KLN 90B built into its panel, which its developer does. The wiki of the KLN 90B project keeps the list of [aircraft that use the KLN 90B](https://github.com/falcon71/kln90b/wiki/Aircraft-using-the-KLN-90B).

Some aircraft let the unit and another GPS take turns: the aircraft sets the KLN 90B aside while the other unit works. When the aircraft brings it back, the unit continues where it was, without a power-on and without a self test. How you switch, and whether the aircraft offers it, depends on the aircraft, so read its description.

An aircraft can also include its own copy of the unit, because the Community folder is out of reach on Xbox. You need no package from this page for such an aircraft, and the copy is updated with the aircraft. It can be an older version than the one this manual describes, and installing the package from this page does not change it.

Aircraft developers find everything they need on the [wiki](https://github.com/falcon71/kln90b/wiki).

## Next steps

- [Quickstart](/kln90b/getting-started/quickstart/): the screen, the knobs and the cursor, in a few minutes.
- [Tutorial flight 1](/kln90b/getting-started/tutorial-1/): a short flight with direct-to navigation.
