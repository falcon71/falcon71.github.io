# Package: apt (the APT chapter of the page reference)

Done. Written in the dry run of 2026-11-04 and corrected on 2026-11-16 against the rules added that day. The chapter
is the example page of the page reference (`docs/manual-plan.md`, "Example pages").

## Pages

### APT pages (`pages/apt.mdx`)

As written, with the anchors:

1. Summary: the airport waypoint pages, one airport on every page.
2. `#the-apt-pages-one-airport-on-every-page`: what is specific to airports in the general operation of a waypoint
   page, with `#user-defined-airports` and `#the-act-pages-of-an-airport`.
3. `APT 1: name, position and airspace`, with `#a-nearest-airport` and `#a-user-defined-airport`.
4. `APT 2: city, elevation, time zone and approaches`.
5. `APT 3: runways`.
6. `APT 4: communication frequencies`.
7. `APT 5: remarks`.
8. `APT 6: services`.
9. `APT 7: SID and STAR procedures`, with `#selecting-a-sid-or-a-star`, `#questions-before-the-load`,
   `#where-the-procedure-goes-in-fpl-0`, `#what-the-unit-keeps-of-a-procedure`.
10. `APT 8: approaches`, with `#selecting-an-approach`, `#questions-before-the-load-and-where-the-approach-goes`.
11. `#where-the-apt-pages-are-used`: the links on.

The headings of the numbered pages start with the page name; the page links go to them.

## Screens

The screens are in `kln90b/screens/` (`apt-*`). Variants without a screen, because the FAA extract cannot stage
them: APT 3 `RUNWAY DATA NOT AVAILABLE` (every airport of the extract has a runway), `MILTRY`, `PRIVAT`, `(R)`,
`LPC`/`LPT`, the state on APT 2 (the extract carries the country only). The APT 8 questions (add, replace) have no
screens of their own; the APT 7 questions differ by one word and stand for both. The tutorial screens
(`tut2-apt-*`) stay the tutorial's.

## Bugs

The candidates of the dry run were triaged and filed on 2026-11-16; the paragraphs of the chapter carry the
`kln90b#NN` comments.

- kln90b#474: APT 4 shows blank rows after the airport changes while a later frequency page is shown.
- kln90b#475: APT 3: typing an unknown identifier and then a valid one on a list page jumps to the diagram and
  drops the cursor.
- kln90b#476: the APT 3 diagram throws for airports with helipad-style runway entries and stays blank; the extract
  of the screens turns helipads into such entries, and whether the simulator's data does is unverified.
- kln90b#479: a route from the EFB loads an approach into a unit not installed for approaches; `CHANGE APR?` then
  throws. Belongs to Flight plans (`docs/plan/flight-plans.md`).
- kln90b#482 (an enhancement, not a bug): the simulation has no search for an airport by its name or city. The
  chapter leaves it out (style guide, section 3); Known limitations names it and can link the issue
  (`docs/plan/help.md`).
- kln90b#480 (the maintainer decides): a STAR or an approach is inserted before the first occurrence of the airport,
  which puts it at the start of a round trip. Belongs to SID and STAR procedures (`docs/plan/sid-star.md`).
- kln90b#481 (the maintainer decides): the frequencies of the simulator's flight service stations are labeled
  `AFIS` on APT 4. The chapter has no comment for it yet; the package waypoint-pages, which changes the chapter,
  adds the comment to the paragraph or the field explanation that names the frequency types.

Dropped after review (the real unit behaves the same, or the manual leans the code's way): the airspace text of
APT 1 ignores the airspace floor; a `/` in an airport name is deleted without a blank; a remark blanked out on APT 5
keeps its slot until it is deleted on OTH 4.

## Text the review moved out of the chapter

The review of the dry run cut text that other pages own: the scan rules, creating a user waypoint in full, the
`USER POS?` entry, where a procedure goes in FPL 0 in detail, the make-room question, the 30 NM arming. The
scratchpad files that held it are gone. The text is still in the history of `kln90b/src/content/docs/pages/apt.mdx`:
the draft is commit `f1465fc`, and the two review commits after it (`c1e312e`, `d3a39bd`) show what was cut. It was
written from the code under the writer's rules, so the researchers of the owning packages (controls, waypoints,
sid-star, approaches) may read it with `git show f1465fc:kln90b/src/content/docs/pages/apt.mdx` as a starting point,
and check every fact in the code again.

## Notes from other packages

None.

## Changes to earlier pages

The package waypoint-pages cuts this chapter back where Waypoints and the database then owns the text
(`docs/plan/waypoint-pages.md`).
