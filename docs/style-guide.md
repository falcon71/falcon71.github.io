# KLN 90B manual: specification and style guide

This is the one document that says what the KLN 90B manual on this site is, who works on it under which rules, and how
it is written. It supersedes the earlier draft specification. Read it in full before you write, coordinate or review.

The mechanics live next to the code and are not repeated here:

- `README.md` (repository root), "Writing a screen" and "Page links": how a page shows a screen and how page names
  become links.
- `kln90b/generator/README.md`: how a screen is described and generated, and how the kln90b pin is moved.
- `docs/superpowers/specs/2026-10-21-screen-generator-design.md`: why the generator works the way it does.

Sections 1 to 6 are the ground rules. Sections 7 to 16 are the style guide proper. Sections 17 to 20 are the
requirements for each chapter and for the site, the release procedure and the license. Section 21 is the checklist.

---

## 1. What the manual is

The official documentation of the KLN 90B is no longer freely available, so this site gives flight simulator pilots
their own manual. It describes the KLN 90B as it is simulated for Microsoft Flight Simulator 2024 by the kln90b project
(https://github.com/falcon71/kln90b).

The manual is written from the source code of the simulation, not from the real unit's manual. The simulation aims to
emulate the real unit faithfully, quirks included, so a manual that describes the simulation well also describes the
real unit well. It is nevertheless for flight simulation only: every page carries a banner that says so (section 18).

## 2. Readers

The readers are flight simulator pilots. Assume they can fly an aircraft and know aviation terms and radio navigation:
VOR, NDB, ILS, airways, magnetic and true courses, instrument approaches, a CDI and an HSI. Do not explain those. Do
explain anything specific to GPS navigation of the 1990s or to this unit.

The manual serves two ways of reading, and the same pilot often uses both:

- **Looking something up.** The pilot is in the middle of a flight, sees a page or a message they do not understand,
  searches for it, reads a few lines and goes back to flying. Every page and every section must give them the answer in
  its first sentences.
- **Studying.** The pilot reads a chapter from start to end, wants every rule and every exception, and may fly a tutorial
  step by step. The detail that follows the first sentences is for this.

Describe reading situations like these when you need to, never kinds of readers. Do not label, rank or sort pilots in
the manual or in anything committed to this repository.

The depth is that of the real unit's manual: a pilot who knows this manual well could operate a real KLN 90B. Shallower
is wrong, and so is deeper than a pilot needs (section 3).

The manual is not for software developers. It shows no code and no truth tables, and it leaves out everything a pilot
cannot see or use: class names, settings keys, H event names, how the simulation computes something. The exceptions are
the External hardware page and the optional page Inside the GPS simulation (section 17). Aircraft developers are not readers either; integration details stay on the
GitHub wiki of the kln90b project.

## 3. Scope

- **Only the current version** of the simulation is described, now 2.x for Microsoft Flight Simulator 2024. Version
  1.x for FS2020 is mentioned only on the Installation page and by the download buttons of the home page, so that
  FS2020 users download the right release.
- **The simulation, not the real unit.** A feature the real unit has and the simulation lacks is not mentioned at all,
  because it is useless to a simulator pilot. Where the simulator lacks the data a feature needs, say so in one sentence
  (OTH 1 shows no flight service stations, because the simulator has none).
- **Nothing that matters only in real aviation.** Database subscriptions, certification paperwork, the flight manual
  supplement, antenna installation and the like are left out.
- **Features that depend on the installation** (an approach-certified unit for APT 8, a fuel management system for OTH 5 to OTH
  8, an air data system for OTH 9 and OTH 10, VFR-only units, altitude alerting) are described the way a pilot meets
  them: the feature depends on how the unit is installed in the aircraft. Never name the panel.xml key or any other
  configuration that controls it. Use the Availability box (section 11).
- **Nothing that goes stale between releases.** The manual is updated when kln90b releases a version (section 19), not
  when a new aircraft comes out. Never say what the aircraft that carry the unit offer or lack today ("the aircraft
  so far give it no sound output"); describe the feature and its condition, and leave it there (maintainer,
  2026-11-17).
- **No trademarks of manufacturers.** Never name an aircraft or avionics maker or its products, in the text, on a
  screen or in a drawing: no Cessna, no Skyhawk, no Bendix/King. The unit is the KLN 90B and nothing more. A
  company name that the unit itself shows and whose company no longer exists (AlliedSignal on the Turn-On page)
  may stay; text the pilot writes into the unit on a screen uses neutral words (maintainer, 2026-11-17). The name of
  a real place that contains a company name, as the database gives it (Boeing Field, `BOEING FLDK` on the APT
  pages), is a place name and stays (maintainer, 2026-11-19). Microsoft
  Flight Simulator is named, because the manual is for it. The one exception is External hardware: it names the
  tools and the hardware that pilots use with the unit, as the wiki page does, the product names of their makers
  included (the RealSimGear GNS430), because naming them is in those makers' interest; the aircraft makers stay
  unnamed there too (maintainer, 2026-11-21).
- **Features that exist only in the simulation** (the SET 10 page, the FLR pages and the failures they set, keyboard
  mode) are marked with the Simulator only box (section 11).

## 4. Roles and the copyright wall

The real manuals of the KLN 90B are copyrighted. This manual must not contain any of their text, tables, figures or
structure. The roles below make sure that no manual text can reach the site.

The manual is written in work packages. For each package the maintainer starts a coordinator session in
`E:\msfs\falcon71.github.io` (`docs/coordinator-prompt.md`); the plan carries the state from one session to the next.
The coordinator starts every other agent (researchers, writers, reviewers) as a subagent and names its role and its rules in the agent's prompt, because a
subagent knows only what that prompt and this repository tell it. A session started in this repository does not inherit
the kln90b project's Claude memory.

### Writer

A writer writes pages, field explanations, glossary entries and drawings. A researcher that gathers facts for writing
works under the same rules.

- **A writer never reads a real manual**, nor anything derived from one: not the local reference library, not Claude's
  index of it, not the kln90b project's Claude memory, and no copy, excerpt or summary of a KLN manual found on the web.
- **Sources a writer uses:** the kln90b source code and tests in `vendor/kln90b`, with `docs/architecture.md` and
  `test/README.md` as guides to them; the kln90b wiki, cloned read-only at `E:\msfs\kln90b.wiki` (its integration pages
  are background, not manual content, section 2); and the simulated unit itself, which the screen generator can boot
  and operate to show what it does in a given state.
- **Not a writer's source:** the other files in kln90b's `docs/` (plans, reviews and the trainer record paraphrase the
  real manual) and the text of kln90b issues, which cite and paraphrase it too. A writer opens issues only to search
  for duplicates and to file bugs (section 5), and takes no description of the real unit from them.
- Code comments cite pages of the real manual ("3-29", "5-36"). Use them as pointers while reading the code, and never
  put a manual page number, section number or figure number into the manual or into this repository.

### Coordinator

The coordinator plans the work, hands sections to writers, sends their drafts to reviewers and passes findings back.

- The coordinator may read the real manuals for their general structure, presentation and writing style. It writes no
  documentation itself.
- The outline it gives the writers is its own. It is not the real manual's chapter order with new words. The order of
  the page reference follows the unit's page tree, which is a fact of the device.
- **What it tells a writer** is the outline, the topics the writer's pages own, where in the code to look, and
  reviewer findings in the reviewer's own words. It never passes on a fact about the unit that it learned from a
  manual; a writer finds every fact in the code.
- It keeps the plan of the whole manual (`docs/manual-plan.md` and the package files in `docs/plan/`): which page
  owns which topic, so that each fact is said once (section 8), and what the next session must know.
- It alone edits the shared files (the glossary, the word list in section 12, the sidebar). Writers report new entries
  to it, so that parallel writers never overwrite each other.
- It files the bugs that writers and reviewers report (section 5), so that parallel agents do not file duplicates.
- It commits the work.

### Reviewer

A reviewer checks a draft for factual correctness, against the code and against the real manuals, and checks it
against this guide.

- A reviewer may read the real manuals. It never quotes them and never shows a page or a figure of one.
- A finding states the error in the reviewer's own words: "Direct-to, step 3: the draft says A; the unit does B." It
  names no manual page. It reaches the writer only through the coordinator.
- A reviewer checks that the draft uses the official terms (section 12, "Official terms") and reports each term that
  differs, as the term alone.
- Where the manual and the code disagree, the finding is a kln90b bug (section 5), not a change to the draft.

### Where the manuals are

The coordinator and the reviewers find the reference library and Claude's index of it through this repository's
Claude memory (`reference-library-pointer`); the coordinator gives a reviewer the path in its prompt. The index maps a
manual page cited in the code to the page of the PDF and lists topics and facts. A writer never follows that pointer.

## 5. Bugs and errors

- **Who files:** a writer or a reviewer that finds a bug reports it to the coordinator with everything below; the
  coordinator checks for duplicates, shows the maintainer a summary, and files it once the maintainer approves.
- **A bug in the simulation** (in the code, or where the code and the real unit disagree) goes to the kln90b issues,
  https://github.com/falcon71/kln90b/issues. Search open and closed issues first, with several wordings; a closed issue
  may be a partial fix. A new issue gets the `bug` label and states what is wrong, a concrete reproduction (input,
  observed and expected values), the file and line, the impact on the pilot and a suggested fix. It never mentions
  this manual or how the bug was found ("found while writing the docs"), because the kln90b project must not learn
  about the manual (coordinator, 2026-11-19, after three issues said so). If it continues a
  closed issue, it references that issue. An issue cites neither a manual page number nor the
  manual's text; the permission check of the maintainer's session refused an issue with a page number (2026-11-21).
- **Never change kln90b.** Nothing in `vendor/kln90b` is edited, and no fix or test is added there for the
  documentation. The kln90b project does not know about this manual.
- **The manual describes the simulation as it is now**, bug included, and the paragraph or field explanation carries a
  hidden comment with the issue, so that it is found when the fix lands (section 19):
  - in `.mdx` files: `{/* kln90b#123: describes the current behavior; the fix makes the unit do B */}`
  - in `.md` files: `<!-- kln90b#123: describes the current behavior; the fix makes the unit do B -->`

  Always write the issue as `kln90b#` and its number, so that one search finds them all.
- **An error in the manual itself** goes to the issues of this repository,
  https://github.com/falcon71/falcon71.github.io/issues, with the `bug` label.
- Never close an issue, neither through the API nor with a comment. The maintainer closes them.

## 6. Where the text lives

| What | Where |
| --- | --- |
| A page of the manual | `kln90b/src/content/docs/<chapter>/<page>.md` or `.mdx` (`.mdx` when it uses a component) |
| A screen and its field explanations | `kln90b/screens/<id>/screen.ts` and `fields.mdx`, `<id>` being the screen's path below `screens/`, packages included |
| A glossary entry | `kln90b/src/data/glossary.ts` |
| The sidebar | `kln90b/astro.config.mjs` |
| The page tree (knob order, optional pages) | `kln90b/src/data/pageTree.ts` |
| The download files of External hardware | `kln90b/public/downloads/`, written by `kln90b/generator/hardware-files.mjs` |

---

## 7. Voice

The model is the writing of the real unit's manual: plain English, addressed to the pilot, calm and practical, as if
an experienced instructor sat next to them, and dense with facts. This guide describes that style completely, so that
writers can follow it without ever seeing the model. The coordinator and the reviewers, who may read the real manual,
judge drafts against it; they report what to change in their own words, never with an example from it.

- **Second person, present tense, active voice.** "You press ENT." "The unit shows the waypoint page." Not "the user",
  not "the pilot will press", not "is displayed by the unit". Even a sequence in time reads naturally in the present:
  "When you pass the waypoint, the unit makes the next leg active."
- **Name the unit "the KLN 90B"** at its first mention on a page and "the unit" after that. Never "the GPS" (that is
  the receiver inside), "the gauge", "the mod" or "the add-on". Talk about the simulation or the simulator itself only
  where it matters to the pilot: Simulator only boxes, Installation, Known limitations, the controls in the simulator,
  and the one sentence that says the simulator lacks the data for a feature (section 3).
- **Say why** when the reason helps the pilot remember or predict the behavior: "The selected course is shown as a magnetic
  course, because you set it on a course indicator that is read in magnetic." One clause is usually enough.
- **Give the practical consequence.** After a rule, say what it means in the cockpit: "Flight plans are stored when the
  unit is off, so you can prepare tomorrow's route tonight."
- **Friendly, never chatty.** An occasional warm remark where the unit does something genuinely handy is in keeping
  with the model ("That saves a lot of knob turning."). Keep it to one sentence, and rare. No jokes, no hype, no
  "simply", "just", "easy", "powerful", "amazing".
- **Confident.** State what the unit does. Avoid "should", "might", "typically" and "it seems" unless the behavior
  really varies; then say what it depends on.
- **American English** spelling and usage: behavior, color, center, meter, gray, canceled.

## 8. Density

The model packs several facts into every paragraph and wastes no words. So does this manual.

- **Every sentence carries** a fact, an instruction, a reason or a consequence. Cut sentences that only announce
  ("In this section we will look at…"), repeat the heading, or summarize what was just said. A sentence that says what a
  section leaves out and where to find it is useful and stays: "Approaches are covered in Non-precision approaches."
- **Exact values.** Give the numbers the unit uses: distances, times, limits, ranges, step sizes, the number of
  entries: "up to 30 waypoints", "26 flight plans", "in steps of 100 ft". Never "a few", "several", "some time" where
  the code has a number.
- **A time measured on the real unit is approximate.** Where the simulation copies a duration from recordings of
  the real unit (the Turn-On page stays for 15 to 20 seconds), the real unit varies, so give it as a range with
  "about" ("about 15 to 20 seconds"), never as the exact number the code happens to use (maintainer, 2026-11-17).
- **The time a calculation takes is no specification.** Where the unit shows a result as soon as it has computed
  it (the reference VOR of the INT page, a search, a list that fills in), the delay in the code is the
  simulation's choice, not a property of the unit. Say "a few seconds" and give no number (maintainer,
  2026-11-17).
- **A number is said once, at its owner.** Other pages, and the rest of the owning page, refer to the event instead
  of repeating the number: "while the Turn-On page is shown", not "about 17 seconds after power-on" on every page.
  A repeated number reads as a lecture and goes wrong everywhere at once when it changes (maintainer, 2026-11-17).
- **Only details that change what the pilot does or expects.** That one timer counts from the power-on and another
  from a later moment, and how the two overlap, is true in the code and of no use in the cockpit; leave it out
  (maintainer, 2026-11-17).
- **A state that only a failure brings is no edge case of the feature.** A heading input that arrives or is lost
  while the unit runs, an altitude input that fails mid-flight: these happen only when something fails, and the
  page of the feature does not walk through them. It says what the feature needs (in its Availability box, where
  it depends on the installation); Simulated failures says what a failure does (maintainer, 2026-11-18).
- **Every exception.** Someone studying a chapter wants the edge cases: what happens with no GPS fix, with an empty flight plan,
  in OBS mode, when the field is dashed, when the list is full, when a value is out of range. Put each right after the
  rule it qualifies (section 11).
- **No section and no screen for a case a pilot hardly ever meets.** An exception earns its place by happening in
  normal use. A wind stronger than the true airspeed on TRI 1, or the setting of a calculator that was never entered
  on a new unit, happens to nobody in flight; such a case gets neither a section, nor a screen, nor a rule in a field
  explanation. A plain field that shows dashes says so in its explanation, and that is enough (maintainer,
  2026-11-21).
- **Say each fact once,** in the place a pilot would look for it, and link to it from everywhere else. A field is
  explained in its screen's field explanation; a task in Operation; a page's overall purpose in the page reference.
  This holds above all for the basic operation of the unit: how a page type is selected, how the cursor and the knobs
  enter characters, how the scan works, how a waypoint identifier is entered and confirmed. A chapter that opens by
  explaining those again is fatiguing to read, because every chapter would, and the pilot who studies the manual
  reads them all. Such a chapter says in one sentence that the operation is the same as everywhere and links to the
  page that explains it (section 10, "Page reference").
- **Assume a capable reader.** Do not tell the pilot what the screen shows them plainly or what they find out the
  moment they try: that a line has as many characters as it has, how many characters a field holds, which
  characters a field accepts, that the cursor stops on every field in turn. Say what they cannot see: the limits, what is stored and where, what happens at the
  edges. If a sentence would make a pilot feel talked down to, cut it.
- **What feels natural in use needs no rule.** Where the unit simply does what the pilot expects (which side an
  <kbd>ENT</kbd> acts on, how each kind of field takes a typed key), do not write the rules out: a pilot who reads
  them finds them more confusing than the unit. Describe the use case, the gotchas and what surprises, and leave the
  rest to the unit. That every rule is in the code is no reason to write it down (maintainer, 2026-11-17).
- **Say what is, not what is not.** Do not state what the manual leaves out, what the site does not offer or what the
  unit does not do, unless a pilot would otherwise expect it and act on it. "This manual does not say how version 1.x
  differs" sounds as if something were withheld; "the download buttons never offer a pre-release" answers a question
  nobody asked. Cut such sentences. This holds for lists of what is skipped as well: an aircraft loaded with the
  engine running "comes up ready to navigate"; the pages it does not show are not listed (maintainer, 2026-11-17).
- **Nothing about how the simulation is built,** not even in pilot words: that the unit only receives the commands
  of its controls, which part of the aircraft decides what a click does, how the aircraft switches the unit in. Say
  what the pilot does and sees (section 2). The one page that explains a model of the simulation is Inside the GPS
  simulation (section 17), and it is marked as optional reading.
- **What the pilot sees, not what the unit does inside.** Describe a control by what it is for and a display by how
  it looks, never by how the code implements them. <kbd>Backspace</kbd> in keyboard mode takes the cursor back to
  the previous character so that you can correct it, even though it is a step of the outer knob inside; the
  brightness knob dims the screen, and its internal step size is nobody's concern; text the unit draws in smaller
  capitals is capitals (section 12), even though the code stores it as small letters (maintainer, 2026-11-17).
- **A gotcha must not be overlooked.** Where the unit regularly catches pilots off guard (the screen stays dark for a
  few seconds after power-on while it warms up), the fact never stands in a subordinate clause. It gets the Good to
  know box (section 11) at the place where the pilot meets it, and the text around it keeps its natural order: a
  gotcha moved to the front of a section makes the section read out of order.
- **Paragraphs of two to five sentences.** Sentences mostly of 10 to 25 words. Split a sentence that carries two
  conditions.
- **Lists** for parallel items: the fields of a page, the choices of a menu, the conditions of a message. Prose for
  explanations and reasons.
- **Tables** only for real lookups (control, action, result; message, meaning, what to do). No truth tables.

## 9. Anatomy of a page

- **Front matter:** `title` (the sidebar label, sentence case) and `description`: one sentence that tells a searching
  pilot what the page answers. It appears in search results and link previews. Add `sidebar.order` where the chapter
  needs a fixed order.
- **The summary.** The text before the first heading is one to three sentences that answer the page's main question on
  their own. A pilot who reads only these sentences must come away with something correct and useful.
- **Then the detail,** under `##` headings, each section again opening with the sentence that answers its heading.
- **What a pilot searches for gets its own heading.** A warning or a state the unit shows that alarms a pilot
  (`TEST FAIL` on the Self Test page, an expired database) is something they type into the search. It gets a
  section of its own, named after what the pilot sees, that says what it means and what to do next, not one
  sentence inside another section with a link (maintainer, 2026-11-17).
- **Headings in sentence case.** In Operation, a heading names the task as a gerund: "Adding a waypoint to a flight
  plan", "Canceling a direct-to". In the page reference, a heading starts with the page name, then a colon and what the
  page is for in lowercase: "APT 4: communication frequencies". The page name must come first; the page links depend on
  it.
- **End** with the links that lead on, where the page has natural next steps, as a short list or one sentence. Not a
  summary.

## 10. Kinds of pages

### Task pages (Operation)

They answer "how do I…". Each task section has a sentence of context (what the task is for, when you would do it,
what must be true first), the procedure ("Procedures" below), and the rules and exceptions that apply. A task names the pages
it uses; the names link to the page reference by themselves.

**An Operation page earns its place** by a task or a concept that spans several page types, or that the pilot looks
for apart from the pages (direct-to, flight plans, modes of operation). Where every task of a topic is done on one
page type and its chapter can say it all, there is no Operation page: the chapter carries the procedures, the
gotchas and the messages, with the screens beside the text that explains them. A second page would split the topic
in half and add nothing (maintainer, 2026-11-21: Fuel and air data was folded into the OTH chapter).

### Page reference

It answers "what is this page and what is this field". One chapter per page type, in page tree order (section 17).
Each page gets its section:

1. A heading with the page name (section 9).
2. One to three sentences: what the page shows and when a pilot uses it.
3. The screen (section 13). Its field explanations explain every field; the text does not go through the fields again.
4. The rules of the page as a whole: when it shows dashes, what the cursor can change on it, how it differs on the left
   and the right side, the variants of the page and what selects them (section 13 says which variants get a screen).
5. A sentence linking to the Operation sections that use the page. A page type that has no Operation page ("Task
   pages" above) holds its procedures, its gotchas and its messages in its own sections instead.

A chapter explains what is specific to its page type and nothing that is the same on other pages. The waypoint
pages (APT, VOR, NDB, INT, SUP) share the way an identifier is entered, the scan through the database, the nearest
list, the offer to create a user waypoint, the ACT page and the approving of the waypoint page; Waypoints and the database
explains all of that once, and each waypoint chapter says in one sentence that it works as it does everywhere, links
there, and goes on with what its kind of waypoint shows and does differently. The same applies to the cursor and data
entry (Controls and display) and to every topic the plan assigns to another page.

### Tutorial flights

A narrative flight, told in phases (preflight, departure, en route, arrival). Each phase is a section with a short
introduction and numbered steps. Show a screen wherever the pilot must recognize what the unit shows at that moment.
Say what the pilot should see after each important step, so that they notice when something went wrong. The page
requirements are in section 17.

### Lists

The message page messages and the status line messages are lookup lists, sorted alphabetically by the text as the unit
shows it. Each entry: the text exactly as on the screen, what it means, and what to do. The cause comes first if the
pilot needs it to act.

### FAQ and troubleshooting

Each entry has the question as the pilot would ask it as its heading ("Why does the unit not sequence to the next
waypoint?"), then the answer in its first sentence, then the explanation and a link to the full treatment.

### Known limitations

What the simulation does not do that a pilot might expect, one short entry each, in pilot terms.

### Procedures

A procedure is introduced by a line that ends in a colon: "To add a waypoint to a flight plan:". Then:

- **Numbered steps, one action each**, starting with the verb: Press, Turn, Pull, Select, Enter. Two actions belong in
  one step only when the pilot does them as one movement ("Turn the right outer knob to the APT pages and the right
  inner knob to APT 4").
- **The result follows the action** in the same step, when the pilot needs to see it: "Press ENT. The unit shows the
  waypoint page of KSEA, so that you can check that it is the right one."
- **Say which side** for every knob and every CRSR: "the left outer knob", "the right CRSR".
- **Give the way back** where a step can be undone: "If you selected the wrong waypoint, press CLR."
- **End in a stable state:** the last step turns the cursor off if the procedure turned it on, or says what the unit
  shows now.
- **Conditions go before the steps,** not in them: "The flight plan must have fewer than 30 waypoints."
- **The page a pilot would use.** Where several pages can do the same thing, the procedure uses the page that a
  pilot normally does it on, and a sentence names the others: the time zone is set on SET 2, not on D/T 4, although
  both change it (maintainer, 2026-11-21).
- **No advice from general aviation knowledge.** Do not tell the pilot which winds, charts or reports come in which
  reference; they know (section 2). Say how the unit takes the value, and leave the rest to them (maintainer,
  2026-11-21: en route winds are published true).
- A screen may follow the step whose result it shows. **The screen shows the page the steps use.** A procedure on
  one page beside a screen of another reads wrong; where two pages take the same entry, the procedure and its
  screen use one of them and a sentence names the other (maintainer, 2026-11-21: the fuel reserve was described on
  OTH 6 beside a screen of OTH 5).

An example of the form (the facts in the examples of this guide illustrate the form; check every fact in the code
before you reuse one):

> To fly direct to an airport:
>
> 1. Press `<DirectToKey />`. The Direct To page appears on the left side with the cursor on the waypoint identifier.
> 2. Enter the identifier with the left knobs: the inner knob selects a character, the outer knob moves to the next
>    one.
> 3. Press <kbd>ENT</kbd>. The unit shows the waypoint page of the identifier you entered. Check that it is the right
>    place.
> 4. Press <kbd>ENT</kbd> again to approve it. The direct-to is now active.

## 11. Notes and boxes

- **A note** qualifies the rule right before it: an exception, a special case, a consequence that is easy to miss. It
  is its own paragraph, starting with `**Note:**`. Use notes sparingly; most exceptions read better as a plain sentence
  after the rule.
- **The Availability box** (`<Callout kind="availability">`) says that a feature depends on how the unit is installed
  in the aircraft: "Approaches on APT 8 are available only if the unit is installed as an approach-certified unit. Not
  every aircraft has one." It never names a configuration key. Put it at the start of the section about the feature.
- **The Simulator only box** (`<Callout kind="sim-only">`) marks a feature that the real unit does not have. Put it at
  the start of the section about the feature.
- **The Good to know box** (`<Callout kind="info">`) holds a fact that regularly catches pilots off guard and that a
  pilot may open the page to find: the screen stays dark for a few seconds after power-on while the unit warms up. Put
  it where the pilot meets the surprise, so that the text around it stays in its natural order. Two or three
  sentences. It is rare: a page has at most one, and most pages have none; an ordinary exception stays a sentence or a
  note. The one exception is a page with two separate facts that each catch pilots off guard, such as Non-precision
  approaches, with the missing ILS approaches and the missing vertical guidance; it may have two (maintainer,
  2026-11-21).
- **The Optional reading box** (`<Callout kind="optional">`) opens a page or a section that goes deeper than a
  pilot needs to operate the unit, and says in one or two sentences that nothing in it is needed and where the
  operating knowledge is. So far only Inside the GPS simulation has one (section 17).
- **The Warning box** (`<Callout kind="warning">`), the one red box, stands where an action of the pilot destroys
  their data or settings for good and nothing on the unit asks first: a power-on with a failed internal battery
  erases the user waypoints, the flight plans and the settings. It says what is lost, what triggers the loss and how
  to avoid it, in two or three sentences, right before the text that describes the loss. A loss of data is never a
  Good to know box. It is rarer still than that box: a hazard to the flight in the simulator, a surprise or an
  ordinary caution is no warning (maintainer, 2026-11-16).
- There are no other boxes. If a new kind is needed, ask the coordinator; it is added to `Callout` with one fixed title,
  so that pilots learn to recognize it.

## 12. Words and notation

### Official terms

The manual names the things of the unit as the real unit's documentation names them: the controls, the pages, the
parts of the screen, the prompts, the modes and the functions. Terms are not copyrighted, and a pilot who meets two
names for one thing takes them for two things.

- A writer cannot know the official term, because a writer never reads the real manuals (section 4). The writer uses
  the terms of the word list below and of the pages already written, and otherwise the name the unit's screen or the
  code suggests.
- **The reviewer checks every term against the real manuals** and reports each difference as a finding: the draft's
  term and the official term, nothing else. A term is a name of a few words; no sentence around it comes along.
- **Titles are not terms.** The titles of pages and sections and the order of the manual are its own (section 4);
  the reviewer does not check them against the real manuals, so that the manual never copies their structure.
- **Slugs may change while the manual is being built.** A renamed page gets the matching slug, and every link to it
  is changed in the same commit. Once the manual is published as complete, slugs stay.
- The coordinator adds the official term to the word list below, so that every later writer uses it without a
  reviewer having to find it again.

### Controls

- **Buttons** are written with `<kbd>` and their label: <kbd>CRSR</kbd>, <kbd>ENT</kbd>, <kbd>CLR</kbd>,
  <kbd>MSG</kbd>, <kbd>ALT</kbd>. A button that exists on both sides gets its side: "the left <kbd>CRSR</kbd>". In
  prose, "press" a button. The unit has buttons, not keys; "key" is only for the keys of the PC keyboard (Keyboard
  mode).
- **The Direct To button** is the one exception: write `<DirectToKey />`, which shows D→ with the arrow centered on the
  D. The fonts of the site have no arrow of their own, so `<kbd>D→</kbd>` shows it too low. A page that names the button
  is therefore `.mdx`.
- **Knobs** are the left outer knob, the left inner knob, the right outer knob and the right inner knob. You "turn" a
  knob, "one step" or "clockwise" and "counterclockwise", and you "pull" or "push" the right inner knob.
- **The power/brightness knob** turns the unit on and off (pushed in for on) and sets the brightness of the screen
  (turned).
- The Controls and display page names every control of the front panel, including the power and brightness controls.
  Every other page uses exactly those names.
- **Mouse and keyboard.** Most aircraft follow the simulator's own control schemes, which need no description, and
  pilots on Xbox use a controller. Write "turn" and "press", as on the real panel, and never describe a control scheme.
  Only Controls and display, the Quickstart and Keyboard mode talk about the mouse, and they name just the special
  cases that catch pilots (below, "Quickstart").

### Pages of the unit

- **A page name is written as the unit's page tree names it** (`kln90b/src/data/pageTree.ts`), with a space before
  the number: NAV 1, SET 10, FPL 0, D/T 2, APT 8, Super NAV 5. The status line writes some of them without the space
  (SET10, FPL10); in prose, use the space.
- **A page without a number** is written with "page": the VOR page, the REF page. The pages of one kind are a page type, written "the APT pages".
- **The full-screen pages** are Super NAV 1, Super NAV 5, the MSG page and SET 0.
- **Do not link page names by hand.** The site links them when it builds (README, "Page links"). Write the name plainly
  in the text, outside code formatting.
- **The halves:** "the left page" and "the right page" for what each half shows, "the left side" and "the right side"
  for where. The bottom line of the screen is "the status line".
- **Lines on a page:** a page has six lines. Refer to a line by what is on it ("the line with DIS"), or as "the top
  line", "the second line", "the bottom line of the left page". Do not number lines from 0.

### Text the unit shows

- Quote text from the screen exactly as shown, in code formatting: `DIS`, `FLY R 0.4NM`, `ENR-LEG`. The unit
  draws some text in smaller capitals (the units `NM`, `KT`, `FT`, the modes such as `ENR-LEG`, the prompts `ENT`
  and `MSG`, `NR` of the nearest lists). It is capitals to the pilot and is quoted in capitals; the code stores it as
  small letters only to select the smaller glyphs (maintainer, 2026-11-17).
- **A symbol is named in words, never quoted.** The unit's font draws its symbols (the active leg symbol, the Direct
  To symbol, the degree sign of a field) on characters that the site's fonts show as accented letters or other
  glyphs (`Á`, `›`). Name the symbol in words ("the head of the active leg symbol"); the screen shows it. A label
  that the font draws in smaller letters is quoted in capitals as always (`CHINS5-STAR`) (coordinator, 2026-11-19,
  after the writers of the package flight-plans quoted the code points).
- A message is quoted in full. A message page message of several lines is quoted with its lines as the MSG page
  shows them, in a code block; this holds for the message lists and wherever a page explains the message. A
  sentence that only names a message of one line quotes it in code formatting: `ADJ NAV IND CRS TO 271°`.
  A sentence that only names a message of several lines, which the page or the list quotes in full, names it by
  its first line in code formatting, and by its second line too, as a code span of its own, where two messages
  share the first: "`RAIM NOT AVAILABLE` `CROSS CHECK POSITION`".
- Field labels are quoted the same way, then named in words when it helps: "`ETE`, the estimated time en route".
- **Choices in the screen's order.** When the text names several choices, menu entries, questions or fields that the
  unit shows together, it names them in the order they appear on the screen, top to bottom, and describes the knob
  turn that reaches them accordingly. A list in another order than the one the pilot is looking at confuses.

### Units and numbers

- **In prose:** NM, kt, ft, fpm, °, with a space between number and unit except for degrees: 5 NM, 120 kt, 3,000 ft,
  500 fpm, 271°. Thousands get a comma in prose (3,000 ft) and stay as the unit shows them in quoted screen text.
- **Courses and bearings** are magnetic unless marked: "271°", "271° true".
- **Times:** UTC as `14:30 UTC`; durations in words and numerals ("about 36 seconds", "2 minutes").
- **Frequencies** as charted: 119.90, 116.80.
- **Coordinates** as the unit shows them: N 47°26.94', W 122°18.66'.
- **Numerals** for every value with a unit, every page number and every count of 10 or more. Words for counts from one
  to nine without a unit: "two pages", "three waypoints".

### Word list

Use these forms. A writer who needs a new one reports it to the coordinator, who adds it here.

| Use | Not |
| --- | --- |
| direct-to (noun and adjective: "a direct-to", "the direct-to waypoint"); fly direct to KSEA | Direct-To, direct to (as a noun) |
| the Direct To page | the DCT page |
| the pages of the power-on sequence: the Turn-On page, the Self Test page, the VFR-only warning page, the OBS warning page, the Database page | the VFR-only page, the database page |
| `OBS OUT` (the test course output on the Self Test page); `OBS IN` | course out |
| ORS level (the revision the unit shows as `ORS` and a number) | revision |
| flight plan; the active flight plan (FPL 0) | flightplan |
| waypoint; active waypoint; user waypoint | |
| en route | enroute, en-route (except the unit's `ENR-LEG`) |
| groundspeed | ground speed |
| button (the buttons of the unit) | key |
| page type (the APT pages are a page type) | page group, group |
| the modes by their official names: Enroute-Leg mode (`ENR-LEG`), Enroute-OBS mode (`ENR:` and the selected course), Approach Arm-Leg mode (`ARM-LEG`), Approach Arm-OBS mode (`ARM:` and the selected course), Approach Active-Leg mode (`APR-LEG`) | en route leg mode, en route in OBS mode |
| course mode (leg mode or OBS mode, as a kind) | navigation mode |
| NAV ready (the unit is NAV ready once it has a position good enough to navigate) | has found its position |
| D-bar (the course deviation bar of NAV 1 and the Self Test page) | CDI bar, deviation bar |
| leg mode, OBS mode | LEG mode |
| turn anticipation, waypoint alerting, waypoint sequencing | |
| self test (noun), self-test (adjective) | selftest |
| database; database cycle | data base |
| power-on (noun and adjective); turn the unit on | power-up |
| the message page; the MSG page | |
| cursor; turn the cursor on, turn the cursor off | activate the cursor |
| identifier; ident only in screen text | ID |
| hot-swapping (noun), hot-swap (verb): an aircraft that offers the unit as one of several GPS units | take turns, switch in |
| the power/brightness knob | the brightness knob, the power button, the power knob |
| waypoint type (airport, VOR, NDB, intersection, supplemental) | kind of waypoint |
| procedure header, approach header (the line of FPL 0 that names a loaded procedure) | |
| DME arc waypoint (also the one the unit computes where you join the arc) | arc entry |
| the beginning of the arc, the end of the arc (of a DME arc as published) | published start fix, end fix |
| the present radial is within the arc, outside the arc | abeam the arc |
| the reference VOR of the arc (the VOR a DME arc is flown around; on the SUP page of the DME arc waypoint it is the reference waypoint) | the VOR of the arc, the arc's VOR |
| several pages with one page name ("there is more than one APT 3 page", shown by the `+`) | subpage |
| SID, STAR; SIDs, STARs; SID and STAR procedures; a SID procedure, a STAR procedure | departure, arrival (as names of the procedures) |
| suffix (the letter after a waypoint of a loaded procedure) | mark, marker |
| user-defined airport; user waypoint stays the short form of user-defined waypoint | user airport |
| approve the waypoint page; the waypoint page shown for approval | waypoint confirmation |
| the Duplicate Waypoint page (the list of waypoints with one identifier) | the duplicate waypoint page, the duplicates page |
| the complete list (the waypoints of a type that the scan goes through), the nearest list | the list of a page, the database list |
| the Active Waypoint pages at the first mention, then the ACT pages | the active pages |
| user database (where the user waypoints are stored, with `USR DB FULL`) | database of user waypoints |
| the waypoints the unit makes by name: reference waypoint, center waypoint, DME arc waypoint, the waypoints of a route from the EFB | temporary waypoint |
| frequency type (of a frequency on APT 4) | frequency label |
| terminal area (`TMA` on APT 1) | terminal control area |
| pilot-controlled lighting (`LPC` on APT 1 and APT 3) | lighting you turn on by radio |
| terminal waypoint (a waypoint of a SID, a STAR or an approach, shown on the INT page; `T` on the ACT pages) | terminal fix, fix of a terminal procedure |
| user-defined intersection; supplemental waypoint | |
| published magnetic variation (of a VOR) | magnetic variation of the station |
| the class `U` of a VOR: undefined | unknown |
| underscores (the empty cells of an open entry, as the screen draws them) | dashes (dashes are a field without a value) |
| page identification (the part of the status line that shows a page's name); "page name" in running text | |
| mode annunciation (in the middle part of the status line, between the page identifications) | mode field |
| the CRSR annunciation (`CRSR` in place of a page identification while that side's cursor is on) | CRSR indicator |
| the message prompt (`MSG`), the enter prompt (`ENT`); both stand at the right end of the middle part of the status line | prompt segment |
| the status line has three parts: the left page identification, the middle part (mode annunciation and prompts), the right page identification | four segments |
| Microsoft Flight Simulator 2024, then "the simulator" | MSFS, FS2024 (except on Installation) |
| GPS state (the `STATE` of STA 1); the states by name: initialization (`INIT`), acquisition (`ACQ`), transition (`TRAN`), navigation (`NAV`), navigation with altitude aiding (`NAV A`), navigation with data collection (`NAV D`), navigation with position degradation (`DEGRD`), receiver failure (`FAILR`) | receiver state |
| ephemeris data; almanac data | orbit data |
| satellite health (the mark before a satellite's number on STA 1) | satellite mark |
| time to first fix | time to NAV ready |
| the altitude input | altitude aiding (except in the name of `NAV A`) |
| RAIM prediction; the bar graph of STA 5, a bar above the line, a bar below the line | high bar, low bar |
| ETA (the field of STA 5 and wherever the unit shows `ETA`) | arrival time |
| approach arm mode, approach active mode | approach armed, armed mode, active mode |
| the GPS APR switch, the GPS CRS switch (the aircraft's switches with their annunciators; the unit's screen text says `BUTTON` and is quoted as it is) | the GPS APR button, the GPS CRS button |
| total operational time (STA 4) | total operating time |
| software revision status (STA 3) | software version |
| remote mounted annunciators (the annunciators outside the unit that it drives) | remote annunciators, annunciator lamps, external annunciators |
| the message annunciator (the remote mounted annunciator that follows the message prompt; `MSG` where quoted) | the MSG annunciator, the MSG light |
| one-time message, lasting message (the two kinds of message page message: gone once read, or kept while the cause lasts; the manual's own names) | |
| the super flag (the output that takes the NAV flag of the external indicator out of view; `NAV SUPER FLAG FAILURE`) | the nav super flag |
| airport remarks (APT 5) | remarks alone in running text |
| internal battery (at its first mention; "the battery" after that) | memory battery, backup battery |
| fuel management system | fuel computer |
| air data system | air data computer |
| a failure is active or inactive, as FLR 2 and FLR 3 head their lists; fail a part, repair a part | a failure is on or off; set a failure |
| default waypoint (the waypoint the Direct To page offers when it opens) | offered waypoint, prefilled waypoint |
| the Direct To symbol (the mark the unit draws for a direct-to, on NAV 1 and in the status line); written in words in prose | `d`, the d-arrow |
| the window of Super NAV 5 (the waypoint the left side scans through) | the scan window, the waypoint window |
| the `DIRECT TO` annunciation, the `ACTIVATE` annunciation (the top line of the Direct To page) | the heading, the page title |
| selected course (the course set in OBS mode) | OBS course, OBS value |
| CDI scale factor (the full-scale deflection of the D-bar, set on MOD 1) | CDI scale |
| the TO/FROM indicator (the mark in the D-bar and of the external indicator) | the to/from flag |
| the external indicator (the CDI or HSI of the aircraft that the unit drives); the KLN 90B is the displayed navigation source | course indicator; switched to the GPS |
| primary coverage area (where the unit has a magnetic variation, from 74°N to 60°S) | |
| activate a waypoint (what `ACTIVATE` does in OBS mode) | |
| nearest airport criteria (the settings of SET 3) | nearest airport settings |
| the fail question, the repair question (FLR 3, FLR 2) | |
| transition, in a turn (the curved path the unit guides through a turn at a waypoint); the midpoint of the transition (where the unit makes the next leg active). Where the page also speaks of procedures, say "the transition through the turn" | curved path, bisector |
| transition, of a procedure (the part of a SID, a STAR or an approach that you select on APT 7 or APT 8; `<Term t="Transition">`) | |
| the beginning of turn anticipation (where the unit starts guiding the turn) | turn start |
| abeam the waypoint; fly-over waypoint; the waypoint alert annunciator (one of the remote mounted annunciators; `WPT` where quoted) | the WPT annunciator |
| the waypoint type identification page (`TYPE WPT`, `1 EN ROUTE?`, `2 SID/STAR?`) | the `TYPE WPT` question |
| cross-track error (`XTK`) | cross-track distance |
| actual track (`TK`) | track over the ground, your track |
| minimum safe altitude (`MSA`), minimum en route safe altitude (`ESA`) | en route safe altitude |
| offset (of the VNAV point, NAV 4) | offset distance |
| the nearby VOR (of NAV 2) | the reference VOR (that is the INT page's) |
| range scale (of NAV 5 and Super NAV 5); the `AUTO` range scale | range, map scale, auto range |
| map orientation; North up, desired track up, actual track up, heading up | the orientation, track up |
| the pop-up menu (of Super NAV 5); the VOR, NDB and APT selections (its entries) | the menu, the layers |
| the left side of Super NAV 5 | the left column |
| numbered flight plan (FPL 1 to FPL 25) | stored flight plan, stored plan |
| the active leg symbol (the arrow on an FPL page from the from waypoint to the active waypoint, its tail and its head); the arrow (the one mark at the active waypoint in OBS mode or during a direct-to) | the leg marks, the Direct To symbol (on an FPL page) |
| blank waypoint position (the empty numbered row after the last waypoint of a flight plan) | next position, first position, blank position |
| fence (the line `*NO WPT SEQ` in FPL 0) | |
| the Distance/Time pages at the first mention, then the D/T pages | |
| estimated time en route (`ETE`), estimated time of arrival (`ETA`) | time en route, time of arrival |
| present time (`TIME` on D/T 4) | the time now |
| next waypoint (the waypoint after the active waypoint) | following waypoint |
| destination waypoint (the last waypoint of the flight plan) | |
| the unit flags its navigation; the NAV flag (no position good enough to navigate) | the unit loses its position (for the flag) |
| reference waypoint: with the REF page, the waypoint the unit creates on the plan (`OLMA`); the waypoint you enter on the REF page is "the waypoint you enter". On the INT and SUP pages, the reference waypoint is the waypoint of their `REF` field. | new waypoint (for the one the REF page creates) |
| airport reference point (the point of an airport that the 30 NM of arming an approach are measured from); in FPL 0 the row is the airport itself | the airport (as the point a distance is measured from) |
| the ARM annunciator, the ACTV annunciator (the remote mounted annunciators of the approach modes, at the GPS APR switch) | the arm lamp, the active lamp |
| VNAV: the vertical path; the descent point (where the descent starts); the advisory altitude; the VNAV waypoint; the offset point (the offset before the VNAV waypoint, where the path ends); VNAV is inactive (`VNV INACTV`), armed, active | the path (at its first mention), the start of the path, VNAV not running |
| the altimeter baro setting at the first mention, then the baro setting | altimeter setting (for the unit's own setting) |
| the warn altitude (`WARN` on the ALT page); the altitude deviation alert (the tones when you leave the selected altitude) | deviation limit |
| the aural alarm (the tones of altitude alerting as a whole); a tone | the alert tones |
| the special use airspace alert at the first mention, then the airspace alert (as SET 8 names it); special use airspace; the vertical buffer (SET 8) | SUA alert |
| the height above airport alert; the offset height (its height, set on SET 5) | |
| center waypoint (the waypoint the CTR pages create at a Center boundary); area control center (ACC or ARTCC) where a page first introduces the concept, then Center (maintainer, 2026-11-20) | air route traffic control center alone, ACC alone |
| the SET pages, named once on the SET chapter as the setup pages of the unit | the settings pages |
| the initial heading (the degrees on the groundspeed line of SET 1) | track (on SET 1) |
| the system time zone (the one zone that SET 2, D/T 2, D/T 4, STA 5 and the Self Test page share; CAL 6 and CAL 7 start from it) | the time zone of SET 2, the chosen zone |
| reserve fuel (`RES` on the TRI pages) | the reserve |
| the "from" waypoint, the "to" waypoint (TRI 3 and TRI 4), with the quotation marks | the first waypoint, the second waypoint |
| areas of special use airspace (what the list of TRI 2, 4 and 6 shows, Class B and Class C areas included); military operation area (`MOA`) | the airspaces along the route (except in a title) |
| the Calculator pages at the first mention, then the CAL pages | the calculator pages |
| altimeter setting (the entry of CAL 1 and CAL 2, separate from the unit's baro setting) | baro setting (for the CAL entry) |
| the descent or ascent angle and the rate of descent or ascent (CAL 4) | descent angle, vertical speed (on CAL 4) |
| the fuel management pages (OTH 5 to OTH 8); fuel units (`GAL`, `IMP`, `L`, `KG`, `LB`) | the fuel pages; the unit of the installation |
| fuel on board (`FOB`), fuel required (`REQD`), landing fuel on board (`L FOB`), extra fuel (`EXTRA`), fuel reserve (`RES` on OTH 5 and OTH 6, a value of its own; the TRI pages' `RES` is reserve fuel) | fuel left on board |
| fuel efficiency (the NM per fuel unit of OTH 6) | efficiency |
| static air temperature (`SAT`), total air temperature (`TAT`), pressure altitude, density altitude (OTH 10) | outside air temperature |

### Spelling and style

- American spelling. Sentence case for headings and titles.
- Abbreviations: write them as the unit and pilots do (DTK, XTK, RAIM). One that has a glossary entry is explained
  with a tooltip (section 14), not with a parenthesis; one that a single screen uses is explained in that screen's
  field explanation.
- No exclamation marks in a row, no emphasis by capitals, bold only for a word the pilot must not miss.

## 13. Screens

Show the unit's screen wherever the text describes a page of the unit. The text explains how the page works in
general; the screen shows one concrete case.

- **Every page in the page reference has a screen,** and so does every variant of a page that looks different or shows
  different fields (a waypoint from the database and a user waypoint, a page with and without the cursor on).
- **In Operation and in the tutorials,** show a screen wherever the text describes what a page shows or how it looks,
  and wherever the pilot must recognize the result of a step, a prompt or a message. A page that is only named (and
  linked) needs no screen.
- **Screens are generated, never typed by hand** (README, "Writing a screen"). The one exception, which the README
  allows, is an illustration that shows no state of the unit at all, such as a status line on its own; it uses real
  identifiers like any other screen. If you need a screen that does not exist yet, describe it in a new
  `screens/<id>/screen.ts` and generate it.
- **One screen, one id, one meaning.** The same page with other values or in another state is another screen with its
  own id. The id is the screen's path below `kln90b/screens/`: its package, then its name, both lowercase with hyphens.
  A screen of one page of the unit goes into `pages/<page>/` and is named for the page, then what distinguishes it
  (`pages/apt/apt-1-ksea`, `pages/vor/vor-user`). A screen whose point is a mechanism or a sequence rather than a page
  goes into the package of that topic and drops the prefix the package already says (`direct-to/ident-entry`,
  `power-on/self-test`, `tutorial-2/apt-7-sid-load`).
- **Real places.** Screens show real, well-known US places from the FAA data (section 18). Never invent identifiers.
- **No message prompt** unless the message is what the text explains. A screen shows no flashing `MSG` and no pending
  message; a step that raises one answers it before the screen is captured. For the same reason the screens run with the
  airspace alert off, unless a screen is about the airspace alert and turns it on.
- **Show half a screen** when only one side matters. The generator keeps the line between the halves. A screen
  about a status line message shows both halves, because a half screen cannot show the middle part of the status
  line; the other half's fields are explained like any others (maintainer, 2026-11-17).
- **A step that carries data from one side to the other gets a screen** that shows both halves: where the data
  comes from and where it goes, such as the identifier of the right page taken into a field of the left page. The
  pilot learns such a step by seeing it (maintainer, 2026-11-17).
- **A page that works with a field of the other side shows both halves.** Where a page points to a value on the
  other half and uses it (the arrow after `ON` on the ALT page points to the selected altitude of NAV 4, which the
  altitude alert uses), its screen shows both halves, so that the pilot sees what the page works with. The rule
  below, to show only the page the text is about, gives way to this one (maintainer, 2026-11-20).
- **Show only the page the text is about.** A screen of both halves, or an excerpt of both halves, where the text
  is about one page shows the other page's data as well, and where the other page repeats the same data (the top
  line of NAV 1 and of NAV 3), the pilot sees it twice and wonders why. Show the one half, and let the other page
  have its own screen where the text describes it (maintainer, 2026-11-18).
- **Show an excerpt** when only one line or a few lines of a page matter: the shared top line of a page type, a
  question the unit asks, a prompt in the status line. A page shows the rows of a generated screen with `rows`
  (README, "Writing a screen"); the fields on those rows keep their explanations. Where the text describes a line in
  detail, the reader needs to see it, so the excerpt stands next to the description instead of leaving the line to the
  imagination. The screen is still generated whole, so the same screen serves the page that shows it in full.
- **A state the pilot must tell from another gets its screen.** Where the text teaches how to recognize a state on
  a page (a failure on STA 1, a mode in the status line), each state is shown, so that the pilot learns the
  difference by looking; this holds on the optional pages too. A state that the steps of a screen cannot reach by
  operating the unit is built in the screen's description, by setting up the unit's own objects the way the kln90b
  tests do, before it is given up as not stageable (maintainer, 2026-11-16).
- **A screen shows its case unmistakably.** Stage it so that it cannot be taken for another state: a selected
  course in OBS mode clearly off the line between the places on the map (about 45°), not one that looks like a
  leg between them; and leave out what the screen does not teach, so that the map stays uncluttered (maintainer,
  2026-11-18).
- **Flashing.** The site draws flashing text as a static dashed box and explains it under the screen. Say in the text
  what flashes and when.

### Field explanations

The explanations of a screen's fields live in its `fields.mdx` and appear wherever the screen is shown. Therefore:

- **They are free of context.** No "now", no "in this step", no "as you saw above". What depends on the situation (why
  the pilot sees this screen, what to do next) goes in the text around the screen.
- **The title** names what the field is, in sentence case: "Distance to the active waypoint", not "DIS".
- **The body** starts with what the field shows. Then, as they apply: the unit and the format, the range and the
  resolution, when it shows dashes, whether and how the pilot can change it with the cursor, and what changing it does.
- **Length:** one to four sentences for most fields; a complex field (the CDI, a selectable list) may take a few short
  paragraphs.
- **Everything on a screen that carries information is a field, and every field gets an explanation,** the status line
  fields included. That covers titles, labels, units, fixed text and the page identification as well as the values;
  only blank cells and pure decoration (the line between the halves) need none. A field is a label and its value
  together: its location covers both, so that pointing at `REF:` and at `SEA` opens the same explanation. Locate a
  field with a regex that matches the label and the value (`/GS +\S+/`), or with a place that takes the whole row
  (`{area: 'R', row: 1}`); a regex that finds the label alone leaves the value without a tooltip.
- **A field covers everything the cursor marks.** Where the cursor (inverse or flashing inverse) marks an entry, the
  field spans every cell of the cursor, the entry's number and padding included, so that pointing anywhere at what the
  cursor marks opens the explanation. The generator widens a field to its cursor and fails when one cursor would mark
  two fields.
- Field explanations are indexed by the search and can be linked one by one (`#screen-pages/nav/nav-1--dis`), so the FAQ and
  answers on Discord can point to a single field.

## 14. Glossary and tooltips

- `<Term t="XTK" />` shows the abbreviation with a dotted underline and its explanation on hover, focus or tap.
  `<Term t="XTK">cross-track error</Term>` explains other words with the same entry.
- **The glossary holds the common terms:** the aviation and GPS navigation terms and abbreviations that the unit
  shows on several pages or that the text uses across chapters (DTK, XTK, RAIM, a RAIM prediction). It stays short
  enough to read.
- **An abbreviation or a code that a single screen uses is no glossary term.** The codes for runway surface and
  lighting on APT 3, the frequency types of APT 4 and the names of the failures on the FLR pages are explained in
  the field explanation of their screen, and in the text of that page where it describes them. They get no glossary
  entry and no `<Term>` (maintainer, 2026-11-16: the glossary had become cluttered).
- **Nor is one that a few pages show.** A code the unit shows on a few pages only (`HRD` and `SFT` for the runway
  surface on APT 1, APT 3 and SET 3) is explained in the field explanations of those pages, not in the glossary
  (maintainer, 2026-11-17).
- **A display form is no abbreviation of the manual.** Where the unit writes a word short because of the room on
  its screen (`RW` before a runway number), the manual quotes it in the screen text and otherwise writes the word
  ("runway 16L"); it gets no glossary entry (maintainer, 2026-11-17).
- **Nor is an abbreviation that every pilot reads at once.** `DIS` for distance, a label whose word is plain from
  the screen, needs no tooltip and gets no glossary entry; the field explanation names it (maintainer, 2026-11-20).
- **Operating concepts are not glossary terms.** The nearest list, the active waypoint, waypoint alerting, turn
  anticipation, the scan, OBS mode, user waypoints and the like are ways the unit works, explained in their Operation
  section. A tooltip cannot explain how something works, so these get no glossary entry and no `<Term>`; the text
  writes them in plain words and links to the owning section at the first use on a page (`[nearest
  list](/kln90b/operation/nearest/)`), and at the first use in a field explanation. The plan's topic ownership says
  which section owns which concept.
- **Use `<Term>` at the first use of a glossary term on a page,** and at its first use in each field explanation. Not
  on every use. The exception is the vocabulary every pilot knows (section 2), which gets no tooltip even though the
  glossary lists it: VOR, NDB, DME, ILS, IFR, VFR, ATC, UTC, CDI, HSI, NM, kt, ft. Add to this list only with the
  coordinator.
- **An entry** has `expansion` (the written-out form, for an abbreviation) and `text`: one or two plain sentences that
  say what the term means on this unit. No tooltips inside, no links, no formatting.
- The glossary file is shared. A writer reports each new entry (term, expansion, text) to the coordinator, who adds
  it. Until then the writer's `<Term>` for it fails the build, which is the reminder.

## 15. Links

- **Page names link themselves** (section 12). Do not wrap them in links.
- **Other links** are Markdown links with the full site path: `[Direct-to](/kln90b/operation/direct-to/)`, with a
  heading's anchor where useful: `/kln90b/unit/controls-and-display/#entering-data-with-the-cursor`.
- **Operation and the page reference link to each other:** a task names the pages it uses, and a page's section in the
  page reference links to the tasks that use the page.
- **Link text** says where the link goes ("see [Flight plans](…)"), never "click here".
- **External links** go to stable addresses: the kln90b GitHub repository and its Releases page, the wiki, the Discord
  invitation, the FAA's chart search page (the PDF of a chart changes its address every cycle, so do not link it).

## 16. Drawings

Draw a picture where it explains something words explain badly: the geometry of turn anticipation, the CDI scale in
the modes, a selected course to a waypoint, a holding pattern entry. Drawings are SVG components in
`kln90b/src/components/drawings/`, in the site's colors, readable in light and dark themes, with a caption that says
what to notice.

- **A computation or a geometry the pilot must picture gets a drawing:** where the REF page puts a reference
  waypoint abeam a VOR, where the CTR pages find the crossing of a Center boundary. Words and a screen of the result
  do not show it (maintainer, 2026-11-20).
- Drawings are synthetic. Never draw or trace a real chart or real navigation data. A drawing either uses a generic
  airport and invented fixes, which is the one place where invented names are right, or it illustrates the example of
  a screen on the same page: then it shows the screen's places schematically, labeled with their identifiers, so that
  the pilot recognizes the screen in it (maintainer, 2026-11-20).
- A drawing explains the unit's behavior, not general aviation knowledge the readers already have.

---

## 17. Chapters

The sidebar has these chapters and pages. Operation explains tasks ("how do I…"); the page reference explains screens
("what is this field").

| Chapter | Pages |
| --- | --- |
| Getting started | Table of contents (home page) · Installation · Quickstart · Tutorial flight 1 · Tutorial flight 2 |
| The unit | Controls and display (knobs, buttons, the two halves, status line, cursor and data entry, scan, page tree) · Keyboard mode · Power-on and initialization |
| Operation | Waypoints and the database · User waypoints · Nearest · Direct-to · Flight plans · Modes of operation (leg and OBS) · Sequencing and turn anticipation · SID and STAR procedures · DME arcs · Non-precision approaches · VNAV · GPS reception and RAIM · Inside the GPS simulation (optional) · Messages · Airspace and altitude alerting · Trip planning and calculators · Simulated failures |
| Page reference | One chapter per page type in page tree order. Left: TRI, MOD, FPL, NAV, CAL, STA, SET, FLR, OTH. Right: CTR, REF, ACT, D/T, NAV, APT, VOR, NDB, INT, SUP. Each page with its screen. |
| Reference lists | Message page messages · Status line messages · Glossary |
| Help | External hardware · FAQ and troubleshooting · Known limitations · Contact |

The NAV pages exist on both sides. The page reference has one NAV chapter that covers both sides, in its place among
the left page types (after FPL); the right ones skip it. The page links depend on this: a page type has exactly one chapter.

A page of the unit that belongs to no page type (the Direct To page, the ALT page, the MSG page, the pages of the
power-on sequence, the Duplicate Waypoint page, the make-room pages) has no chapter in the page reference. The
Operation page that owns its task shows its screen with the field explanations; the plan says which.

### Installation

- How to download: the download buttons of the home page, which link the zip of the current release directly. For
  another version, the Releases page of the kln90b GitHub repository and the zip attached to a release. Some pilots
  download the source code by mistake; say which file to take.
- Version 1.x is for Microsoft Flight Simulator 2020, version 2.x for Microsoft Flight Simulator 2024.
- Where the package goes in the Community folder, and the folder structure it must have there. The zip contains the
  folder `falcon71-kln90b` itself. Do not say where the Community folder is; pilots know.
- Updating: delete the old folder and install the new one. Flight plans, user waypoints and settings are kept
  (confirmed by the maintainer, 2026-11-16).
- Installing the package puts the unit into no aircraft by itself. The pilot needs an aircraft that carries the unit
  (link the wiki page "Aircraft using the KLN 90B"). Some aircraft offer it by hot-swapping; of that the page says
  only that the KLN 90B may have to be selected in the configuration of the aircraft before it appears.

### Quickstart

The KLN 90B works very differently from modern graphical GPS units, which can make the first session with it
daunting. The Quickstart gets a pilot going with as little reading as possible: the two halves of the screen, how pages are selected with the
knobs, the cursor, and data entry, each in a few sentences, each linking to the full treatment.

- It contains the interactive knob demo, which walks the real page tree.
- **Turning the unit on.** It says prominently that the screen stays dark for a few seconds while the unit warms up
  in a Good to know box (sections 8 and 11): pilots open this page to find out why their unit does not turn on. It shows the Self Test
  page, which a pilot at that point has never seen; the other power-on pages need no screen here. It does not mention
  the beep on approval, which needs an audio output that the aircraft so far lack; that belongs to Power-on and
  initialization.
- **Two ways of entering data, each in its own section:** fields that the knobs change directly, and entries that
  flash and take effect only with <kbd>ENT</kbd>. The code calls the second kind editors; that is no term of the unit
  and stays out of the manual.
- **The controls in the simulator** is short. It describes no control scheme and nothing about how the aircraft and
  the unit work together. It names the two special cases (in some aircraft the power knob needs a right click; in
  some control schemes a click needs a second mouse button held) and describes keyboard mode in a few sentences with
  the link.

### Keyboard mode

Its own page, based on the wiki page "Keyboard Mode" and the code, marked Simulator only.

### Power-on and initialization

The self test, the database confirmation, position and time initialization and GPS acquisition, with the time each
takes and what the pilot does when the unit does not become NAV ready.

### SET 10

Documented in the page reference like the other SET pages and marked Simulator only. Based on the wiki page "SET 10
Page" and the code.

### The FLR pages and Simulated failures

The FLR pages set and repair simulated failures. They are not a stop of the left outer knob: they open from SET 10.
Their chapter stands after SET in the page reference and is marked Simulator only, and so is the Operation page
Simulated failures, which says what can fail and what each failure does. Both are written from the code alone; the
design notes in kln90b's `docs/` are not a writer's source (section 4). A failure is described by what the pilot
observes, never by how the simulation draws or times it (section 8).

### GPS reception and RAIM

The Operation page for the receiver: acquisition, the receiver states, the position error, RAIM and its
prediction. The STA chapter explains the pages and their fields and links there for how the receiver works.

### Inside the GPS simulation

An optional excursion for the curious pilot, after GPS reception and RAIM in the Operation chapter (maintainer,
2026-11-16): how the simulation models the satellites, their signals, the errors of the position, the filter,
the search for satellites and RAIM. Nothing on it is needed to use or understand the unit, and it says so at its
start in the Optional reading box (section 11); the richness of the model is what pilots appreciate here.

- It is the one page that explains how the simulation works inside (sections 2 and 8). It still speaks to a pilot:
  it explains the model and its numbers in words and shows what each part makes the pilot see on the unit. It shows
  no code, names no class, file or setting key, and uses a formula only where the formula is the plainest way to
  say it.
- **Prose first.** It is written in the manual's style, in paragraphs that explain and give reasons, not as a
  poster of bullet points. Lists are for parallel items, as everywhere (section 8).
- **Explanatory drawings** carry what words explain badly: the geometry of the satellites, the signal strength
  over the elevation, a filter's answer to a jump, RAIM with and without a spare measurement. They follow section
  16, and every number in a drawing is one the code uses.
- Operating knowledge stays on GPS reception and RAIM and in the STA chapter; the excursion links there and does
  not repeat it. How each simulated failure acts on the model is added by the package that writes Simulated
  failures.
- The simulation models a receiver; where the model simplifies or chooses a number of its own, the page may say
  so, because that is what the curious reader asks.

### SID and STAR procedures and approaches

Two rules of procedure selection surprise pilots used to other GPS units, who then take them for bugs. They are the
unit's correct behavior (confirmed by the maintainer, 2026-10-22). State both plainly in SID and STAR procedures, in
Non-precision approaches, on APT 7 and APT 8 in the page reference, and as an FAQ entry:

- **A transition must be selected whenever the procedure has one.** A SID, a STAR or an approach with transitions
  cannot be loaded without one. When the selected transition repeats waypoints that are already in the flight plan, the
  pilot deletes the duplicates by hand.
- **An approach starts only at an IAF.** The pilot selects one of the approach's initial approach fixes; an
  intermediate fix cannot be selected as the start of the approach.

### Tutorial flights

Two flights in the United States, each about an hour in a small single-engine propeller aircraft that carries the
unit.

- They use the real navigation database, so that pilots can fly them. Print the route; never draw a chart of it.
- Avoid exotic airports, so that the flights work with the simulator's default navigation data and with Navigraph's,
  which are nearly identical in the US. State which navigation data and which AIRAC cycle the flight was checked with.
- The unit drops procedures with RF legs and RNP AR approaches. Choose procedures that the unit offers.
- Link the free official FAA charts for the airports and procedures instead of drawing anything. The address of a
  chart PDF changes every cycle, so link the FAA's chart search and name each chart exactly (airport and procedure
  name) so that the pilot finds it in one search.
- **The aircraft requirement.** Both tutorials need an aircraft in which the KLN 90B is the main GPS, the one that
  drives the course indicator. That is the normal installation. Where the unit is installed only as a secondary GPS
  (the aircraft option `Output.WriteGPSSimVars` off), it sends almost nothing to the aircraft: the CDI does not move
  and the EFB gets no route from it. Such an aircraft is not suited for the tutorials. The tutorials say so in pilot
  terms at the start, under what the pilot needs ("the KLN 90B must drive your CDI or HSI; if the needle does not move
  in the first direct-to, choose another aircraft"), and never name the option.
- The maintainer flies every tutorial in the simulator before it is published; an agent cannot. The screens of a
  tutorial are generated, so the navigation data extract (section 18) must cover the tutorial's area.

**Tutorial flight 1** teaches the basic operation and the knobs. It covers power-on, the self test, the database
confirmation, position and time initialization and GPS acquisition, and then direct-to navigation only. It uses no
flight plan.

- Route (chosen by the maintainer, 2026-10-21): `KFHR DCT KTIW`, Friday Harbor to Tacoma Narrows, two airports that
  simulator pilots know well.

**Tutorial flight 2** introduces flight plans with a SID, a STAR and an approach. Approaches need an approach-certified
installation (APT 8); a pilot without one flies a visual approach at the end instead. Say explicitly that SIDs and
STARs (APT 7) work without it, so that such a pilot does not skip the whole procedure part.

- Route (chosen by the maintainer, 2026-10-21): `KYKM/27 YKM7 TITON V4 CHINS CHINS5 KBFI/R32LY`. Yakima runway 27,
  the YAKIMA SEVEN departure to TITON, V4 to CHINS, the CHINS FIVE arrival, and the RNAV (GPS) Y approach to runway
  32L at Boeing Field.
- What the maintainer chose it for: the departure is flown along a VOR radial, which makes it the place to teach OBS
  mode; the route has a holding pattern for climbing to the minimum en route or crossing altitude; the arrival needs at
  least 10,000 ft.
- What the maintainer found when flying it in the simulator (2026-10-21):
  - YKM7 can be selected as it is, and the unit recognizes TITON as a holding fix. The unit keeps only the legs of a
    procedure that end at a fix, so the climb on runway heading and the heading to intercept the radial are not in the
    flight plan; the pilot flies them by heading.
  - V4 has the waypoint CADED between TITON and CHINS. The pilot enters every waypoint of the airway by hand, because
    the unit cannot load an airway as a whole. Make this an explicit lesson: pilots often ask about it.
  - CHINS5 cannot be loaded without a transition, and all its transitions start before CHINS. The pilot selects the
    YKM transition and then deletes the waypoints that the flight plan now has twice.
  - The approach also needs a transition. The pilot selects HUMPP and again deletes the duplicate waypoints, this time
    from the end of the arrival.
  - This is the unit's correct behavior, not a bug (confirmed by the maintainer, 2026-10-22; see "Departures,
    arrivals and approaches" above). The tutorial says so where the pilot meets it, and has the pilot edit the
    procedures by hand as above.
- **No flight plan file to download** (maintainer's decision, 2026-10-21). The pilot enters the whole flight plan in
  the KLN 90B by hand, which is the point of the flight; a file imported into the EFB and sent to the unit would skip
  that.
- **The EFB afterwards.** Once FPL 0 is complete, the pilot can load it into the simulator's EFB as a reference: open
  the flight planner app, select the Route tab, click Import and choose `REQUEST FROM AVIONICS` from the menu. The
  unit then sends FPL 0 to the EFB, the en route waypoints together with the SID, the STAR and the approach by name
  and transition (`KlnEfbSaver` in the kln90b code). No Availability box: the unit answers in every aircraft that is
  suited for the tutorials (see the aircraft requirement above).
- Tutorial flight 1 offers no flight plan either, because its lesson is flying without one.

### External hardware

Based on the wiki page "External Hardware". The only page that may show configuration: the event names. The
SPAD.neXt XML and the FSUIPC `myevents.txt` are offered as downloads, not as code to copy (`kln90b/public/downloads/`,
written by `npm run hardware-files` from kln90b's events, section 19; maintainer, 2026-11-21). The page names every
tool, hardware and community project the wiki page names, with their links (section 3).

### FAQ and troubleshooting

Based on the wiki's FAQ. It explains where the unit behaves differently from modern GPS units in ways that surprise in
the cockpit, and the common pitfalls.

### Known limitations

Its own page, based on the wiki page "Known Limitations".

### Contact

Links to the kln90b GitHub repository and to the Discord community. Pilots may report bugs or ask questions in either
place.

### What stays on the wiki

The wiki page "Aircraft using the KLN 90B" stays on the wiki, because its list changes at any time. All integration
details for aircraft developers stay there too.

## 18. Site requirements

These are built. They are listed here so that they stay true; changes to them go through the maintainer.

### Format

- HTML pages on GitHub Pages from the repository falcon71.github.io, in the `kln90b/` folder, served at
  https://falcon71.github.io/kln90b/. Standalone: the manual does not live in the kln90b repository.
- An interactive document with direct links. A pilot can search for a page or keyword and land in the right section;
  the search also finds the text of the field explanations.
- Responsive, from a phone to a large display.
- A design fitting a technical manual for a mature audience. The accent color is green; the phosphor green of the
  unit's screen is used only on the screens.
- The site menu is on every page, the home page included. The pilot can hide it on every screen size to get more room
  for reading, and the choice is remembered.
- **The banner** states that the manual is for flight simulation only and must not be used for real-world aviation.
  It stays on screen at the bottom of every page, fully readable on every screen size; the site menu never covers its
  text.
- The site loads nothing from third parties: fonts are self-hosted, no analytics, no embedded widgets.
- A print stylesheet is welcome where it is cheap.
- **The home page** is titled "KLN 90B for Microsoft Flight Simulator" and opens with a drawing of the whole unit
  that shows a generated screen without its fields (`kln90b/src/components/Hero.astro`). Under it come a short
  description of the unit, the download buttons, and the manual with its own heading and the table of contents.
- **The home page has a download button for each simulator**, Microsoft Flight Simulator 2024 (version 2.x) and 2020
  (version 1.x), linking the zip of the newest full release straight from GitHub; pre-releases never get a button. The
  build reads the releases from the GitHub API (`kln90b/src/lib/releases.ts`), so the buttons follow the newest release
  each time the site is built. Pilots are sent to the home page to download, not to the kln90b repository.

### Screens on the site

- Rendered as HTML text in the KLN font, not as images. The map pages (NAV 5, Super NAV 5, APT 3) are inline SVG made
  from the pixels the unit draws.
- Pointing at a field opens a help window with its explanation, which closes when the pointer leaves. A click or tap
  keeps it open until the pilot clicks elsewhere or presses Escape. Keyboard users reach the fields with Tab.
- Fields are not marked at rest; they highlight when pointed at. A short line under each screen tells the pilot to point
  at a field.
- Every field explanation has a direct link (`#screen-pages/nav/nav-1--dis`).
- Under each screen, a collapsed list holds all its field explanations; the search indexes it.
- Nothing flashes. Text that flashes on the unit has a static dashed box, explained in a legend under the screen.
- When only one side matters, only that half is shown, with the middle line kept.

### Generating the screens

- kln90b is a git submodule, `vendor/kln90b`, pinned to a commit. The pin moves only by a deliberate commit in this
  repository. kln90b is never changed for the manual.
- The generator and the description of every screen (how the unit is set up, which keys reach the screen, where its
  fields are) live in this repository. The generator boots the unit headless the way the kln90b tests do; helpers that
  need changes are copied here and adapted, under their license.
- Generated screens are committed. The kln90b commit they all came from is recorded once, in
  `kln90b/screens/kln90b-commit.txt`, which `npm run screens` writes after a run of all screens; a screen file changes
  in git only when the screen itself changed. Regenerating all screens after the pin moves, or after a fix to the
  generator, shows every changed screen as a git change, which tells the writers what to look at. A run with filters
  refuses to start while the file names another commit than the pin.
- The site build reads only the committed screens; it needs neither the submodule nor its dependencies.
- A screen is defined in one place and shown on any page by its id. A field is found by a regular expression over the
  text, or by its place when its contents do not matter. Generation fails when a field is found nowhere or more than
  once.

### Navigation data on the screens

- Real US places from public data only: the FAA's NASR, CIFP and airspace data, and NOAA's World Magnetic Model for the
  magnetic variation. Nothing is taken from commercial navigation data (Navigraph) or from the simulator's database:
  single facts are free, a database as a collection is not.
- The extract the screens use is committed with the script that made it and the cycle it came from.

### Text features

- Tooltips for terms come from one glossary, which is also the Glossary page, so the two never disagree.
- Every page name in the text links to the page reference, except the page the section describes, a page already linked
  since the last heading, and names in headings, links and code.

## 19. Following kln90b releases

The manual describes the kln90b commit it is pinned to. When kln90b releases a new version, the maintainer starts a
session in this repository and asks for an update to that release. The session:

1. Creates a branch, notes the current pin (`git -C vendor/kln90b rev-parse HEAD`) and moves the pin to the release
   (`kln90b/generator/README.md`, "Moving the pin").
2. Reads what changed: `git -C vendor/kln90b log --oneline <old>..<new>` and the diff of the user-visible code (pages,
   controls, messages, settings, navigation behavior, H events for External hardware). Commit messages that say
   `fixes #NN` name the kln90b issue; read it.
3. Searches the manual for `kln90b#NN` of every fixed issue, rewrites those paragraphs and removes the comment.
4. Regenerates all screens with `npm run screens` (no filters, so that `kln90b/screens/kln90b-commit.txt` is updated) and
   goes through the diff of `kln90b/screens/`: every changed screen needs a look at its field explanations and at the
   text around it on every page that shows it.
5. Regenerates the download files of External hardware with `npm run hardware-files` in `kln90b/`; a changed file
   means the H events changed, and the page is checked against them.
6. Updates the pages for every other user-visible change: new or removed pages and fields, changed behavior, new
   messages, changed installation options (in pilot terms).
7. Updates the version in the footer if the major version changed.
8. Hands the result to review like any other change.

The kln90b repository is not touched and not told.

## 20. License

The manual and the site are released under CC0 1.0 Universal. The KLN font comes from the kln90b project and keeps its
license, LGPL-3.0. Harness code copied from kln90b keeps its license in a folder of its own.

---

## 21. Checklist

Before a writer hands in a page:

- [ ] The summary answers the page's question on its own; each section opens with its answer.
- [ ] Second person, present tense, active voice, American spelling.
- [ ] Every fact checked in the code or on the generated screen; no fact from memory or from another unit.
- [ ] Exact numbers instead of vague words; every exception after its rule.
- [ ] Procedures: numbered, one action per step, sides named, way back given, stable end state.
- [ ] Buttons in `<kbd>`, the Direct To button as `<DirectToKey />`, screen text in code formatting, page names plain and with a space before the number.
- [ ] The terms of the word list used; no second name for a thing that a page already written names.
- [ ] `<Term>` at the first use of each glossary term; operating concepts linked to their section instead; new terms
      and words reported to the coordinator.
- [ ] Nothing re-explained that another page owns; the basic operation of the unit linked, not repeated.
- [ ] Choices and fields named in the order the screen shows them.
- [ ] Screens shown by id, generated, every field explained, explanations free of context; an excerpt where the text
      describes a single line.
- [ ] Installation-dependent and simulator-only features in their boxes; no configuration keys.
- [ ] No code or configuration (outside External hardware), no manual page numbers, no invented identifiers outside drawings.
- [ ] Bugs found are reported to the coordinator, with the paragraph that describes the current behavior; it adds
      the `kln90b#NN` comment once the issue is filed.
- [ ] `npm run build` in `kln90b/` passes without new `[page links]` warnings.

A reviewer checks the same list, then the facts against the code and the real manuals and every term against the
official terms of the real manuals (section 12), and reports each finding in their own words, with the place in the draft, what it says and what is right.
