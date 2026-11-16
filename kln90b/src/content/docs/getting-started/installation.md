---
title: Installation
description: Which KLN 90B release to download for your simulator, where it goes in the Community folder, how to update or remove it, and what an aircraft needs to carry the unit.
---

Download the zip file for your simulator from the [home page](/kln90b/), unpack it, and put the folder `falcon71-kln90b` into the Community folder of the simulator. The package contains only the KLN 90B itself, so you also need an aircraft that carries the unit.

## Choosing the version

Version 2.x of the KLN 90B is for Microsoft Flight Simulator 2024, and version 1.x is for Microsoft Flight Simulator 2020. This manual describes version 2.x.

## Downloading

The [home page](/kln90b/) has a download button for each simulator. Each button gives the zip file of the newest release of that version. The file is named `falcon71-kln90b-` followed by the version, and it ends in `.zip`.

For an older version, or a version that the buttons do not offer, open the [Releases page](https://github.com/falcon71/kln90b/releases) of the KLN 90B on GitHub. Each release lists its files under Assets. Take the one named `falcon71-kln90b-` and ending in `.zip`.

**Note:** Every release also offers two archives named Source code, one as zip and one as tar.gz. They are the program's source files for developers, not the package, and the simulator cannot use them. Do not download them.

On the Releases page, take a release that is not marked as a pre-release. A pre-release is a beta version for testing.

## Installing in the Community folder

The zip file contains the folder `falcon71-kln90b`. Put it into the Community folder of the simulator, so that the package looks like this:

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
3. Check that `manifest.json` lies directly in `falcon71-kln90b`, as in the structure above.
4. Start the simulator.

To update to a newer version, delete the folder `falcon71-kln90b` in the Community folder and install the new version as above. Your flight plans, user waypoints and settings are kept.

To remove the unit, delete the folder `falcon71-kln90b` from the Community folder.

## An aircraft that carries the unit

Installing the package puts the unit into no aircraft by itself. The wiki of the KLN 90B project keeps the list of [aircraft that use the KLN 90B](https://github.com/falcon71/kln90b/wiki/Aircraft-using-the-KLN-90B).

In an aircraft that offers the unit by hot-swapping, you may have to select the KLN 90B in the configuration of the aircraft before it appears.

An aircraft can include its own copy of the unit and then needs no package from this page. That copy is updated with the aircraft and can be an older version than the one this manual describes.

Aircraft developers find everything they need on the [wiki](https://github.com/falcon71/kln90b/wiki).

## Next steps

- [Quickstart](/kln90b/getting-started/quickstart/): the screen, the knobs and the cursor, in a few minutes.
- [Tutorial flight 1](/kln90b/getting-started/tutorial-1/): a short flight with direct-to navigation.
