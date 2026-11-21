---
title: Known limitations
description: What the KLN 90B simulation does not do that you might expect, such as searching an airport by name, listing flight service stations or installing on Xbox.
---

These are the things you might expect of the unit that it does not do.

## No search of an airport by name or city

You find an airport only by its identifier. The unit cannot search by the name of the airport or of its city. The enhancement is tracked as [kln90b#482](https://github.com/falcon71/kln90b/issues/482). [Entering an identifier](/kln90b/operation/waypoints/#entering-an-identifier) explains the entry.

## No flight service stations on OTH 1

OTH 1 shows `NO NEAREST` for the nearest flight service station, because the simulator has no flight service stations.

## No fuel, oxygen, customs or fee data on APT 6

The simulator has no such data for airports, so APT 6 shows `NO FUEL`, `NO OXYGEN` and `NO FEE INFO` for every airport and leaves the line for customs blank. `NO FUEL` does not mean that the airport has no fuel.

## Minimum safe altitudes from terrain alone

The minimum safe altitudes of NAV 3 allow for the terrain only; obstacles such as towers are not included. [Minimum safe altitudes](/kln90b/pages/nav/#minimum-safe-altitudes) explains the values.

## No dark outline around map text

The text and the symbols on the map of NAV 5 and Super NAV 5 lack the dark outline that the real unit draws around them, so they stand directly on the lines of the map.

## The screen refreshes as a whole

The real screen redraws line by line. The simulated screen refreshes as a whole, periodically.

## No installation on Xbox

You cannot install the package of the unit on Xbox. There, only aircraft that bring their own copy of the unit offer it. [Installation](/kln90b/getting-started/installation/) says how the package is installed everywhere else.
