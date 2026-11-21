---
title: FAQ and troubleshooting
description: Answers to the questions pilots ask most often about the KLN 90B, from a unit that does not turn on to a flight plan that loses its procedures, each with a link to the full explanation.
---

The answers below say what to do when the KLN 90B does not behave as you expect, and link to the page that explains each in full.

## Turning the unit on

### Why does the unit not turn on?

The avionics of the aircraft need power: the aircraft must be powered, the avionics bus on and no circuit breaker pulled. Then push in the power/brightness knob at the upper right of the unit. In some aircraft the knob needs a right click.

After you turn the unit on, the screen stays dark for a few seconds while it warms up, so wait before you try again, and do not pull the knob out, which turns the unit off. A screen that stays black while the unit runs may be turned all the way down: turn the power/brightness knob up. [Turning the unit on](/kln90b/getting-started/quickstart/#turning-the-unit-on) of the Quickstart walks you through it, [Using the controls in the simulator](/kln90b/unit/controls-and-display/#using-the-controls-in-the-simulator) covers the right click, [Controls and display](/kln90b/unit/controls-and-display/) the brightness, and [Turning the unit on](/kln90b/unit/power-on/#turning-the-unit-on) of Power-on and initialization the warm-up.

### Why does the Self Test page show TEST FAIL?

The self test has found a fault. Open the MSG page, where the message names the cause. If it is a failure to load the navigation data, turn the unit off and on again once, and restart the simulator if `TEST FAIL` comes back. A simulated failure survives turning the unit off and on and restarting the simulator until you repair it on FLR 2, so neither helps there. [`TEST FAIL` on the Self Test page](/kln90b/unit/power-on/#test-fail-on-the-self-test-page) says what to do for each cause.

### Why does it take so long to get a GPS position?

The acquisition is set to `REAL` on SET 10, and the unit starts from a memory that no longer matches the truth: its last position is far away, or its clock is wrong, or its satellite data are old or were never filled. The time depends on what the unit remembers. If the stored position is wrong, correct it on SET 1 while the unit searches. To skip the wait, set the acquisition to `FAST` on SET 10; while the unit searches, that starts the search over from the true position. [Acquiring satellites](/kln90b/operation/gps-receiver/#acquiring-satellites) has the table of times, and [Real and fast acquisition](/kln90b/operation/gps-receiver/#real-and-fast-acquisition) the steps to switch.

## The database

### How do I update the database?

The unit uses the navigation data of the simulator, so its database is as current as the simulator's, and there is nothing to load in the unit. The updates of the simulator itself arrive by themselves, or you install current navigation data from a provider such as Navigraph.

Until a current cycle is installed, set the date of the simulator to an earlier day. [The database](/kln90b/operation/waypoints/#the-database) explains why that helps and what an expired database changes, and [`DATA BASE OUT OF DATE`](/kln90b/operation/waypoints/#data-base-out-of-date) the message that tells you.

## Flight plans and procedures

### How do I load a flight plan from the simulator?

Plan the route in the EFB of the simulator and send it with the send to avionics function, while the unit is on: a route with procedures that arrives while the unit is off loses them at the next power-on. The unit drops what it cannot take and tells you with a message. [Loading a route from the EFB](/kln90b/operation/flight-plans/#loading-a-route-from-the-efb) lists what it takes and what it drops.

### How do I enter an airway?

The unit has no airway entry: you enter every fix of the airway by hand, one after the other, like any waypoint. Enter the fix where you join the airway, each fix along it and the exit fix. A route that you send from the EFB differs: the unit fills in the fixes of the airway between the fix before it and the exit fix ([Loading a route from the EFB](/kln90b/operation/flight-plans/#loading-a-route-from-the-efb)). [Adding a waypoint](/kln90b/operation/flight-plans/#adding-a-waypoint) explains how you enter a waypoint.

### Why did my flight plan disappear?

You most likely emptied it with <kbd>CLR</kbd>. On an FPL page, <kbd>CLR</kbd> with the cursor off asks `DELETE FPL?`, and <kbd>ENT</kbd> then deletes every waypoint of the plan, also when you meant the <kbd>CLR</kbd> for a field on the right side. Check the top line of the left page before you press <kbd>ENT</kbd>. [`DELETE FPL?`](/kln90b/operation/flight-plans/#delete-fpl) explains how to withdraw the question. A route sent from the EFB replaces FPL 0 at once, without a question ([Loading a route from the EFB](/kln90b/operation/flight-plans/#loading-a-route-from-the-efb)).

### Why are my SID, STAR and approach gone after the flight?

The unit keeps the procedures in FPL 0 only over a short time off. After a longer time off, and after a restart of the simulator, it drops them and keeps the other waypoints of the plan. Load the procedures again after the power-on. [What the unit keeps while it is off](/kln90b/unit/power-on/#what-the-unit-keeps-while-it-is-off) lists what stays and what goes.

### Why must I select a transition, and why are waypoints in my flight plan twice afterward?

A SID, a STAR or an approach that has transitions cannot be loaded without one. That is the unit's correct behavior. When the transition starts at a waypoint that FPL 0 already holds, the plan holds that waypoint twice, and you delete the copy you do not need, usually the en route one, so that the procedure stays complete. [A transition must be selected](/kln90b/operation/departures-arrivals/#a-transition-must-be-selected) shows an example.

### Why can I not start an approach at an intermediate fix?

The unit starts an approach only at one of its initial approach fixes. You select one of the transitions the list offers, and no entry starts at the intermediate fix or at the final approach fix. When ATC gives you vectors to final, load the approach with any IAF and make the final approach fix the active waypoint. [An approach starts only at an IAF](/kln90b/operation/approaches/#an-approach-starts-only-at-an-iaf) explains how.

### Why can I not select an ILS approach?

ILS approaches are deliberately not in the database of the unit, as on the real KLN 90B, and their absence is no fault. Fly an ILS on the NAV receiver of the aircraft. [Which approaches the unit offers](/kln90b/operation/approaches/#which-approaches-the-unit-offers) says what else the list leaves out.

### Why does the unit not fly the holding pattern or the procedure turn?

The unit drops the holding pattern or the procedure turn of a procedure and keeps its fix as a fly-over waypoint, so that you fly the reversal yourself. Near the fix it raises `IF REQUIRED SELECT OBS`: change to OBS mode, fly the pattern on a selected course through the fix, and change back to leg mode when you are inbound again. If the clearance has no hold, ignore the message: the unit flies over the fix and sequences on. [`IF REQUIRED SELECT OBS`](/kln90b/operation/departures-arrivals/#if-required-select-obs) has the details.

## Navigation

### Why does the unit not sequence to the next waypoint?

Most often the unit is in OBS mode, where it never sequences. The mode annunciation in the status line shows it as a colon and a course, such as `ENR:351`. A few other cases keep the waypoint active too, such as the last waypoint of FPL 0 or a navigation that is flagged. [When the unit does not sequence](/kln90b/operation/sequencing/#when-the-unit-does-not-sequence) lists every case, and [Selecting leg or OBS mode](/kln90b/operation/modes-of-operation/#selecting-leg-or-obs-mode) tells you how to return to leg mode.

### Why is my map blank?

With actual track up, NAV 5 and Super NAV 5 stay blank while the aircraft stands or barely moves, because the unit has no track then. This is no failure: the map comes back when the aircraft moves, or when you choose another map orientation. [The map is blank in actual track up](/kln90b/pages/nav/#the-map-is-blank-in-actual-track-up) explains it.
