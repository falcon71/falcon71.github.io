# Package: failures (the FLR chapter; Simulated failures)

Written on 2026-11-16, the second package of the full run, at the maintainer's request: the FLR pages are new and
pilots need guidance for them. Everything in this package is Simulator only (style guide, sections 3 and 11). The
pages this package links to for the basics (Controls and display, Power-on, the message lists, the SET chapter) are
not written yet; it links to them by the planned anchors and page links of the index.

## Pages

### Simulated failures (`operation/failures.mdx`), Operation

As written, with the anchors. The list of the failures stayed on the page.

1. Summary and the Simulator only box.
2. `#random-failures`: the setting of FLR 1, what the hours mean, which failures never come at random.
3. `#failing-a-part-and-repairing-it`: the two procedures on FLR 3 and FLR 2.
4. `#service`: what a service repairs and resets.
5. `#when-the-unit-notices-a-failure`: the self test (`TEST FAIL`), in operation, never; the failure messages, which
   come back unread at every power-on.
6. `#what-can-fail`, opened by an Availability box (only failures of equipment the aircraft has are offered), with
   `#the-receiver-and-the-antenna`, `#interference-and-a-faulty-satellite` (it ends with how to tell the failures
   of the reception apart on the unit), `#the-inputs-from-the-aircraft`, `#the-outputs-to-the-aircraft` (with the
   paragraph on which output carries the navigation data and the route exchange with the EFB),
   `#the-annunciators`, `#the-memory-of-the-unit`.
7. `#the-battery`: how the internal battery runs down, the warning, the loss of the user data at a power-on while
   the battery has failed, what is lost and what survives, the wrong date afterwards and the procedure that sets
   it.
8. `#further-reading`: the links on.

### FLR pages (`pages/flr.mdx`), page reference

As written, with the anchors. The headings of the numbered pages start with the page name; the page links go to
them.

1. Summary and the Simulator only box.
2. `#the-flr-pages-failing-and-repairing-parts-of-the-unit`: the way in from SET 10, with
   `#turning-from-one-flr-page-to-the-next` and `#leaving-the-flr-pages` (the outer knob closes the pages and moves
   on from SET 10 in the same step; the Direct To page and the ALT page open over the FLR pages). This section owns
   the way in and out.
3. `FLR 1: random failures, internal battery and service`, with `#entering-the-hours-of-the-random-failures`,
   `#the-battery`, `#servicing-the-unit`.
4. `FLR 2: the active failures`, with `#repairing-a-failure`.
5. `FLR 3: the inactive failures`, opened by an Availability box, with `#failing-a-part`.
6. `#where-the-flr-pages-are-used`: the links on.

### Inside the GPS simulation (`operation/gps-simulation.mdx`): the failures part

One section added before "Where the model simplifies": `#the-simulated-failures-in-the-model`, with
`#a-faulty-satellite`, `#jamming`, `#spoofing` and `#the-receiver-and-the-antenna`. It explains the mechanism and
links to Simulated failures for what the pilot sees and does; telling the failures apart is on Simulated failures.
"Where the model simplifies" was corrected where the new section contradicted it (what weakens a signal, the
satellites' clocks and health) and lists the simulation's own choices for the transmitters.

The drawings are `GpsFailureRamp.astro` (the position error of a faulty satellite in the page's two skies, and the
moment RAIM detects it), `GpsFailureJammer.astro` (the signal strength against the distance to a jammer) and
`GpsFailureSpoofer.astro` (the fake and the real signal strengths against the distance to a spoofer) and
`GpsFailureHorizon.astro` (the curvature of the earth shielding a jammer or a spoofer; added at the maintainer's
review). Each one's comment holds the numbers it was computed from.

At the maintainer's review the section also got an example screen of STA 1 for each failure (below, "Screens"),
so that the pilot learns by looking how they differ.

## Topics this package owns

Simulated failures owns what can fail, what each failure does, telling the failures apart on the unit, detection,
random failures, the battery and the loss of user data, and service. The FLR chapter owns the pages, their fields
and the way into them and out. Inside the GPS simulation owns how the failures of the reception act on the model.
Other pages say nothing about failures; the message lists give text, meaning and the link.

**The wording** (style guide, word list): a failure is active or inactive, as FLR 2 and FLR 3 head their lists;
the pilot fails a part and repairs it; the fail question and the repair question. The names FLR shows for the
failures are in code formatting, with no glossary entry and no `<Term>`.

## Screens

The screens are in `kln90b/screens/`: `set-10-failures`, `flr-1`, `flr-1-set`, `flr-1-mtbf-entry`,
`flr-1-confirm`, `flr-1-serviced` (shown as an excerpt of the status line), `flr-2-empty`, `flr-2`,
`flr-2-repair`, `flr-3`, `flr-3-fail` (the FLR chapter) and `failure-self-test-fail`,
`failure-msg-rcvr-hardware`, `failure-msg-battery-low`, `failure-msg-user-data-lost` (Simulated failures, which
also shows `sta-1-failed`), and the STA 1 examples `gpsfail-satellite`, `gpsfail-ant-gain`, `gpsfail-jamming`,
`gpsfail-jamming-lost`, `gpsfail-spoofing-mixed`, `gpsfail-spoofing-captured` (Inside the GPS simulation; Simulated
failures shows four of them and `sta-1-nav` where it tells the failures apart).

The `gpsfail-` screens are built in their descriptions the way the kln90b tests build the states: the helpers
`kln90b/screens/shared/jammer.ts` and `spoofer.ts` store a transmitter at a known site and fly the aircraft toward
it until the satellites are lost or the receiver is captured. The first run of this package had given these
states up as not stageable; the style guide (section 13) now asks for this before a state is given up.

How they were staged: the FLR pages open through kln90b's own test helpers for them; a failure is set on the unit
directly after the settle. A screen whose failure leaves a message pending sets `keepMessages: true` and reads the
message first, so the half that is shown has no `msg`.

Variants without a screen:

- An empty FLR 3, which occurs only when the pilot has failed every part by hand; the chapter says it in a
  sentence, and `flr-2-empty` shows the same look.
- The effects on the remote annunciators and on the outputs are not on the unit's screen.

## Bugs

Filed on 2026-11-16; the paragraph carries the `kln90b#NN` comment.

- kln90b#483: the service question `CONFIRM?` of FLR 1 is not withdrawn when the cursor leaves the button or is
  turned off (the FLR chapter, "Servicing the unit").
- kln90b#484: with `ANT GAIN` and `JAMMING` or `SPOOFING` active together the lower antenna gain does not lower the
  transmitter's own level, so the loss is counted too high (Inside the GPS simulation, "The receiver and the
  antenna"; the paragraph describes the loss alone).

Not filed:

- An empty internal battery alone loses nothing: the user data are lost only at a power-on while the failure
  `BATTERY` is active. Intended (maintainer, 2026-11-16); no later session files it.
- The faulty satellite gets an error of the range that grows evenly and holds, with no error of the rate. The
  failure imitates a fault of a satellite's clock (maintainer, 2026-11-16); the pages say so and never call it a
  jump, and "Where the model simplifies" names the missing rate error.
- A random failure rebuilds the lists of FLR 2 and FLR 3 and withdraws an open question; a code comment pins it,
  so it is taken as intended and described.

## The maintainer's review (2026-11-16)

Applied in this package: the reason for the longer search with `RCVR EEPROM` (the lost calibration of the
oscillator); `SATELLITE` as a fault of a satellite's clock, uncommon but not unrealistic (the remark stands on
Simulated failures only); the STA 1 example screens and the horizon drawing; the box about the loss of the user
data as the new Warning box. Rules added to the style guide: the Warning box (section 11) and "A state the pilot
must tell from another gets its screen" (section 13).

## Notes from other packages

Used. What the pages of the package sta said about failures is borne out, with one correction: `FAILR` also shows
for a failed antenna and for the receiver hardware faults that stop the receiver, so GPS reception and RAIM and
the STA chapter now say "the receiver or its antenna has failed".

## Changes to earlier pages

All went through the reviewer of the failures part of Inside the GPS simulation.

- `operation/gps-simulation.mdx`: the new section; "Where the model simplifies" as above; the description names
  the failures.
- `operation/gps-receiver.mdx`: the links to Simulated failures go to its sections; `FAILR` as above; the entry of
  `SYSTEM TIME UPDATED` says that the date is wrong after a simulated failure erased the unit's memory, with the
  link to `#the-battery`.
- `pages/sta.mdx`, "A failed receiver": the link goes to `#the-receiver-and-the-antenna`, and the sentence names
  the antenna too.

## Changes to the site

- `kln90b/src/data/pageTree.ts` has `offKnobTree` with FLR 1 to FLR 3, and the page links
  (`kln90b/src/plugins/remarkPageLinks.ts`) read it, so the FLR page names link to the chapter. The knob demo
  reads only the two knob trees (approved by the maintainer, 2026-11-16).
