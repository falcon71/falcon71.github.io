# Package: messages (Messages; the two message lists; the Glossary page)

The lists come after the pages they summarize, so that every entry can link to the page that explains its cause.
Pointers come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not
checked facts.

## Pages

Written as planned (2026-11-21); the sections below are the pages as written. Settled from the fact sheet. The researcher's corrections to the notes below:
`DATA BASE OUT OF DATE` is raised only when the database expires while the unit is on, never at power-on;
`USER DATA LOST` is a one-time message; `EEPROM FAILURE: IC1045` has a second line.

### Messages (`operation/messages.mdx`, sidebar order 13)

1. Summary: the flashing `MSG` says there is a message, <kbd>MSG</kbd> shows it, and some messages stay while
   their cause lasts.
2. `## The message prompt` (`#the-message-prompt`): flashing, steady, gone; the `MSG` of Super NAV 5. Screen
   `messages/msg-prompt` (both halves, the status line with the flashing prompt).
3. `## Reading the messages` (`#reading-the-messages`): a short procedure, the MSG page (screen
   `messages/msg-page`, three messages, two of several lines), newest first, more than one page and <kbd>MSG</kbd>
   to page and close, what else closes it and acts on the page beneath, <kbd>CLR</kbd> ignored, a message that
   arrives while the page is open (a plain sentence; the review found it no Good to know), the empty page. This
   section owns the closing rules of the MSG page; Controls and display keeps one sentence and the link. `### Showing the nearest airport from the MSG page`: one sentence on <kbd>ENT</kbd> and the link
   to Nearest, `#finding-the-nearest-airport-quickly`.
4. `## Messages that stay while their cause lasts` (`#messages-that-stay-while-their-cause-lasts`): one-time and
   lasting messages, the steady prompt, a cause that returns makes the message unread again; the few that go when
   you do what they ask are said in their list entries.
5. `## Messages after a power-on` (`#messages-after-a-power-on`): what is dropped, what comes back read, the
   failure messages that come back unread (link Simulated failures).
6. `## Status line messages` (`#status-line-messages`): the middle part in inverse for 5 seconds, on the MSG page
   only while shown, the prompt flashing meanwhile. Screen `messages/status-line-message` (both halves).
7. `## The remote mounted annunciators` (`#the-remote-mounted-annunciators`): the message annunciator follows the prompt; WPT, ARM and
   ACTV in one sentence each with the link to their owners (Sequencing `#the-waypoint-alert-annunciator`, Non-precision
   approaches); Availability box.
8. Where to go next: the two lists.

### Message page messages (`lists/messages.mdx`, title "Message page messages", sidebar order 1)

Form (style guide, section 10, "Lists"; this page becomes the example of its kind once approved): a short summary
that links Messages; then one `##` heading per message, alphabetical by the text as the unit shows it. The heading
is the message's first line in code formatting, and its second line too where two messages share the first
(`RAIM NOT AVAILABLE`). A value is marked in lowercase (`nnn`, `xxxxx`). A message of several lines is quoted in
full in a code block under its heading. Then the meaning (the cause first where the pilot needs it to act),
whether it stays while its cause lasts, what to do, and the link to the owning section. The writer finds the owner
of each message by searching the manual for its text.

### Status line messages (`lists/status-line-messages.mdx`, sidebar order 2)

The same form. The course message after a direct-to in OBS mode is headed with the symbol named in words
("The Direct To symbol and `CRS nnn°`") and links Direct-to.

### Glossary (`lists/glossary.mdx`, sidebar order 3)

The glossary audit (2026-11-21) found every entry used and none a placeholder. Removed in this package, because
only one topic or the Self Test screens use them: `KYBD`, `LNAV`, `OBS IN`, `OUT`, `RMI`, `ANNUN`, `ALT`; the
field explanations that used them explain the word themselves. `MSG` was cut to two sentences. The audit's
borderline entries (`ETA`, `ETE`, `GS`, `BRG`, `BARO`, the mode annunciations, `RNAV`, `RF leg`, `RNP AR`,
`Transition`, `EFB`) stay; the maintainer found the glossary clean (2026-11-21).

## Bugs

- kln90b#532 (filed 2026-11-21): `LAST POSITION BY >2NM` lacks the space before `2NM`; marked on the list entry and
  on GPS reception and RAIM. Not filed: the airspace alert lines of kln90b#210, closed as not planned.

## Screens

`messages/msg-prompt`, `messages/msg-page`, `messages/status-line-message`.

## Topics this package owns

The MSG page, how messages arrive and are read, the annunciators; the texts with meaning and action.

## Notes from other packages

All used by this package (2026-11-21).

## Changes to earlier pages

Made by this package and checked in its reviews (2026-11-21):

- Controls and display: "The status line" keeps where the prompts stand and links Messages for what flashing and
  steady mean and for status line messages ("for a few seconds"); "Pages that use the whole screen" cut to one
  sentence on the MSG page and the link.
- Waypoints and the database (`NO SUCH WPT` is raised in any field that cannot offer to create a waypoint), Flight
  plans and User waypoints (`WAYPOINT xxxxx DELETED` quoted as one line and linked to its entry), Simulated failures
  ("super flag").
- The 5 seconds of a status line message removed from Simulated failures, the FLR chapter and two field
  explanations; `7000FT` in Airspace and altitude alerting; links from Direct-to, DME arcs, Nearest, Controls and
  display, Power-on, GPS reception and RAIM, VNAV and Waypoints sharpened to the new sections and entries.
- The glossary entries `KYBD`, `LNAV`, `OBS IN`, `OUT`, `RMI`, `ANNUN` and `ALT` removed, their uses on the
  Quickstart, Controls and display, Keyboard mode, Non-precision approaches, the APT chapter, Simulated failures,
  Power-on and three Self Test and keyboard screens replaced by the words.
