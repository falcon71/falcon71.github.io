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
cannot see or use: class names, settings keys, H event names, how the simulation computes something. The one exception is
the External hardware page (section 17). Aircraft developers are not readers either; integration details stay on the
GitHub wiki of the kln90b project.

## 3. Scope

- **Only the current version** of the simulation is described, now 2.x for Microsoft Flight Simulator 2024. Version
  1.x for FS2020 is mentioned on the Installation page only, so that FS2020 users download the right release.
- **The simulation, not the real unit.** A feature the real unit has and the simulation lacks is not mentioned at all,
  because it is useless to a simulator pilot. Where the simulator lacks the data a feature needs, say so in one sentence
  (OTH 1 shows no flight service stations, because the simulator has none).
- **Nothing that matters only in real aviation.** Database subscriptions, certification paperwork, the flight manual
  supplement, antenna installation and the like are left out.
- **Features that depend on the installation** (an approach-certified unit for APT 8, a fuel computer for OTH 5 to OTH
  8, an air data computer for OTH 9 and OTH 10, VFR-only units, altitude alerting) are described the way a pilot meets
  them: the feature depends on how the unit is installed in the aircraft. Never name the panel.xml key or any other
  configuration that controls it. Use the Availability box (section 11).
- **Features that exist only in the simulation** (the SET 10 page, keyboard mode) are marked with the Simulator only box
  (section 11).

## 4. Roles and the copyright wall

The real manuals of the KLN 90B are copyrighted. This manual must not contain any of their text, tables, figures or
structure. The roles below make sure that no manual text can reach the site.

The maintainer starts one coordinator session in `E:\msfs\falcon71.github.io`. The coordinator starts every other
agent (researchers, writers, reviewers) as a subagent and names its role and its rules in the agent's prompt, because a
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
- It keeps the plan of the whole manual: which page owns which topic, so that each fact is said once (section 8).
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
- Where the manual and the code disagree, the finding is a kln90b bug (section 5), not a change to the draft.

### Where the manuals are

The coordinator and the reviewers find the reference library and Claude's index of it through this repository's
Claude memory (`reference-library-pointer`); the coordinator gives a reviewer the path in its prompt. The index maps a
manual page cited in the code to the page of the PDF and lists topics and facts. A writer never follows that pointer.

## 5. Bugs and errors

- **Who files:** a writer or a reviewer that finds a bug reports it to the coordinator with everything below; the
  coordinator checks for duplicates and files it.
- **A bug in the simulation** (in the code, or where the code and the real unit disagree) goes to the kln90b issues,
  https://github.com/falcon71/kln90b/issues. Search open and closed issues first, with several wordings; a closed issue
  may be a partial fix. A new issue gets the `bug` label and states what is wrong, a concrete reproduction (input,
  observed and expected values), the file and line, the impact on the pilot and a suggested fix. If it continues a
  closed issue, it references that issue. A reviewer may cite a manual page number in a kln90b issue, never the
  manual's text; a writer has no manual to cite.
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
| A screen and its field explanations | `kln90b/screens/<id>/screen.ts` and `fields.mdx` |
| A glossary entry | `kln90b/src/data/glossary.ts` |
| The sidebar | `kln90b/astro.config.mjs` |
| The page tree (knob order, optional pages) | `kln90b/src/data/pageTree.ts` |

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
- **Say why** when the reason helps the pilot remember or predict the behavior: "The OBS course is shown as a magnetic
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
- **Every exception.** Someone studying a chapter wants the edge cases: what happens with no GPS fix, with an empty flight plan,
  in OBS mode, when the field is dashed, when the list is full, when a value is out of range. Put each right after the
  rule it qualifies (section 11).
- **Say each fact once,** in the place a pilot would look for it, and link to it from everywhere else. A field is
  explained in its screen's field explanation; a task in Operation; a page's overall purpose in the page reference.
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

### Page reference

It answers "what is this page and what is this field". One chapter per page group, in page tree order (section 17).
Each page gets its section:

1. A heading with the page name (section 9).
2. One to three sentences: what the page shows and when a pilot uses it.
3. The screen (section 13). Its field explanations explain every field; the text does not go through the fields again.
4. The rules of the page as a whole: when it shows dashes, what the cursor can change on it, how it differs on the left
   and the right side, the variants of the page and what selects them (section 13 says which variants get a screen).
5. A sentence linking to the Operation sections that use the page.

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
- A screen may follow the step whose result it shows.

An example of the form (the facts in the examples of this guide illustrate the form; check every fact in the code
before you reuse one):

> To fly direct to an airport:
>
> 1. Press <kbd>D→</kbd>. The Direct To page appears on the left side with the cursor on the waypoint identifier.
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
- There are no other boxes. If a new kind is needed, ask the coordinator; it is added to `Callout` with one fixed title,
  so that pilots learn to recognize it.

## 12. Words and notation

### Controls

- **Keys** are written with `<kbd>` and their label: <kbd>CRSR</kbd>, <kbd>ENT</kbd>, <kbd>CLR</kbd>, <kbd>MSG</kbd>,
  <kbd>ALT</kbd>, <kbd>D→</kbd> (the Direct To key). A key that exists on both sides gets its side: "the left
  <kbd>CRSR</kbd>". In prose, "press" a key.
- **Knobs** are the left outer knob, the left inner knob, the right outer knob and the right inner knob. You "turn" a
  knob, "one step" or "clockwise" and "counterclockwise", and you "pull" or "push" the right inner knob.
- The Controls and display page names every control of the front panel, including the power and brightness controls.
  Every other page uses exactly those names.
- **Mouse and keyboard.** How a knob or key reacts to the mouse depends on the aircraft (click zones, the mouse wheel, a
  right click for power). Write "turn" and "press", as on the real panel; only Controls and display, the Quickstart and
  Keyboard mode talk about the mouse.

### Pages of the unit

- **A page name is written as the unit's page tree names it** (`kln90b/src/data/pageTree.ts`), with a space before
  the number: NAV 1, SET 10, FPL 0, D/T 2, APT 8, Super NAV 5. The status line writes some of them without the space
  (SET10, FPL10); in prose, use the space.
- **A page without a number** is written with "page": the VOR page, the REF page. A group is "the APT pages".
- **The full-screen pages** are Super NAV 1, Super NAV 5, the MSG page and SET 0.
- **Do not link page names by hand.** The site links them when it builds (README, "Page links"). Write the name plainly
  in the text, outside code formatting.
- **The halves:** "the left page" and "the right page" for what each half shows, "the left side" and "the right side"
  for where. The bottom line of the screen is "the status line".
- **Lines on a page:** a page has six lines. Refer to a line by what is on it ("the line with DIS"), or as "the top
  line", "the second line", "the bottom line of the left page". Do not number lines from 0.

### Text the unit shows

- Quote text from the screen exactly as shown, in code formatting: `DIS`, `FLY R 0.4nm`, `enr-leg`. The
  unit's small letters (`nm`, `kt`, `ft`, `enr-leg`) stay small.
- A message is quoted in full: `ADJ NAV IND CRS TO 271°`.
- Field labels are quoted the same way, then named in words when it helps: "`ETE`, the estimated time en route".

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
| flight plan; the active flight plan (FPL 0) | flightplan |
| waypoint; active waypoint; user waypoint | |
| en route | enroute, en-route (except the unit's `enr-leg`) |
| ground speed | groundspeed |
| leg mode, OBS mode | LEG mode |
| turn anticipation, waypoint alerting, waypoint sequencing | |
| self test (noun), self-test (adjective) | selftest |
| database; database cycle | data base |
| power-on (noun and adjective); turn the unit on | power-up |
| the message page; the MSG page | |
| cursor; turn the cursor on, turn the cursor off | activate the cursor |
| identifier; ident only in screen text | ID |
| Microsoft Flight Simulator 2024, then "the simulator" | MSFS, FS2024 (except on Installation) |

### Spelling and style

- American spelling. Sentence case for headings and titles.
- Abbreviations: write them as the unit and pilots do (DTK, XTK, RAIM), and explain them with a tooltip (section 14),
  not with a parenthesis.
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
  own id. Ids are lowercase with hyphens: the page, then what distinguishes it (`apt-1-ksea`, `vor-user-waypoint`,
  `fpl-0-approach`). Tutorial screens start with `tut1-` or `tut2-`.
- **Real places.** Screens show real, well-known US places from the FAA data (section 18). Never invent identifiers.
- **Show half a screen** when only one side matters. The generator keeps the line between the halves.
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
- **Every field gets an explanation,** the status line fields included. A field is a label and its value together.
- Field explanations are indexed by the search and can be linked one by one (`#screen-nav-1--dis`), so the FAQ and
  answers on Discord can point to a single field.

## 14. Glossary and tooltips

- `<Term t="XTK" />` shows the abbreviation with a dotted underline and its explanation on hover, focus or tap.
  `<Term t="XTK">cross-track error</Term>` explains other words with the same entry.
- **Every abbreviation the unit shows** has a glossary entry, so that the Glossary page is a complete lookup list, and
  so does every concept specific to the unit or to GPS navigation (turn anticipation, waypoint alerting, a fence in the
  flight plan). Common pilot vocabulary that the unit does not display needs no entry.
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
the modes, an OBS course to a waypoint, a holding pattern entry. Drawings are SVG components in
`kln90b/src/components/drawings/`, in the site's colors, readable in light and dark themes, with a caption that says
what to notice.

- Drawings are synthetic. Never draw or trace a real chart or real navigation data; a drawing may use a generic airport
  and invented fixes, which is the one place where invented names are right.
- A drawing explains the unit's behavior, not general aviation knowledge the readers already have.

---

## 17. Chapters

The sidebar has these chapters and pages. Operation explains tasks ("how do I…"); the page reference explains screens
("what is this field").

| Chapter | Pages |
| --- | --- |
| Getting started | Table of contents (home page) · Installation · Quickstart · Tutorial flight 1 · Tutorial flight 2 |
| The unit | Controls and display (knobs, buttons, the two halves, status line, cursor and data entry, scan, page tree) · Keyboard mode · Power-on and initialization |
| Operation | Waypoints and the database · Nearest · Direct-to · Flight plans · Navigation modes (leg and OBS) · Sequencing and turn anticipation · Departures and arrivals · Non-precision approaches · VNAV · Messages · Airspace and altitude alerting · Trip planning and calculators · Fuel and air data |
| Page reference | One chapter per page group in page tree order. Left: TRI, MOD, FPL, NAV, CAL, STA, SET, OTH. Right: CTR, REF, ACT, D/T, NAV, APT, VOR, NDB, INT, SUP. Each page with its screen. |
| Reference lists | Message page messages · Status line messages · Glossary |
| Help | External hardware · FAQ and troubleshooting · Known limitations · Contact |

The NAV pages exist on both sides. The page reference has one NAV chapter that covers both sides, in its place among
the left groups (after FPL); the right groups skip it. The page links depend on this: a group has exactly one chapter.

### Installation

- How to download: the Releases page of the kln90b GitHub repository and the zip attached to a release. Some pilots
  download the source code by mistake; say which file to take.
- Version 1.x is for Microsoft Flight Simulator 2020, version 2.x for Microsoft Flight Simulator 2024.
- Where the package goes in the Community folder, and the folder structure it must have there.
- Installing the package puts the unit into no aircraft by itself. The pilot needs an aircraft that carries the unit
  (link the wiki page "Aircraft using the KLN 90B") or one into which the unit can be hot-swapped.

### Quickstart

The KLN 90B works very differently from modern graphical GPS units, which can make the first session with it
daunting. The Quickstart gets a pilot going with as little reading as possible: the two halves of the screen, how pages are selected with the
knobs, the cursor, and data entry, each in a few sentences, each linking to the full treatment.

- It contains the interactive knob demo, which walks the real page tree.
- It says that the mouse controls differ between aircraft, describes the common pattern and points to Keyboard mode.

### Keyboard mode

Its own page, based on the wiki page "Keyboard Mode" and the code, marked Simulator only.

### Power-on and initialization

The self test, the database confirmation, position and time initialization and GPS acquisition, with the time each
takes and what the pilot does when the unit cannot find its position.

### SET 10

Documented in the page reference like the other SET pages and marked Simulator only. Based on the wiki page "SET 10
Page" and the code.

### Departures, arrivals and approaches

Two rules of procedure selection surprise pilots used to other GPS units, who then take them for bugs. They are the
unit's correct behavior (confirmed by the maintainer, 2026-10-22). State both plainly in Departures and arrivals, in
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
  unit then sends FPL 0 to the EFB, the en route waypoints together with the departure, arrival and approach by name
  and transition (`KlnEfbSaver` in the kln90b code). No Availability box: the unit answers in every aircraft that is
  suited for the tutorials (see the aircraft requirement above).
- Tutorial flight 1 offers no flight plan either, because its lesson is flying without one.

### External hardware

Based on the wiki page "External Hardware". The only page that may show copyable configuration snippets: event names,
the SPAD.neXt XML, the FSUIPC `myevents.txt`.

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

### Screens on the site

- Rendered as HTML text in the KLN font, not as images. The map pages (NAV 5, Super NAV 5, APT 3) are inline SVG made
  from the pixels the unit draws.
- Pointing at a field opens a help window with its explanation, which closes when the pointer leaves. A click or tap
  keeps it open until the pilot clicks elsewhere or presses Escape. Keyboard users reach the fields with Tab.
- Fields are not marked at rest; they highlight when pointed at. A short line under each screen tells the pilot to point
  at a field.
- Every field explanation has a direct link (`#screen-nav-1--dis`).
- Under each screen, a collapsed list holds all its field explanations; the search indexes it.
- Nothing flashes. Text that flashes on the unit has a static dashed box, explained in a legend under the screen.
- When only one side matters, only that half is shown, with the middle line kept.

### Generating the screens

- kln90b is a git submodule, `vendor/kln90b`, pinned to a commit. The pin moves only by a deliberate commit in this
  repository. kln90b is never changed for the manual.
- The generator and the description of every screen (how the unit is set up, which keys reach the screen, where its
  fields are) live in this repository. The generator boots the unit headless the way the kln90b tests do; helpers that
  need changes are copied here and adapted, under their license.
- Generated screens are committed and record the kln90b commit they came from. Regenerating all screens after the pin
  moves, or after a fix to the generator, shows every changed screen as a git change, which tells the writers what to
  look at.
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
4. Regenerates all screens and goes through the diff of `kln90b/screens/`: every changed screen needs a look at its
   field explanations and at the text around it on every page that shows it.
5. Updates the pages for every other user-visible change: new or removed pages and fields, changed behavior, new
   messages, changed installation options (in pilot terms).
6. Updates the version in the footer if the major version changed.
7. Hands the result to review like any other change.

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
- [ ] Keys in `<kbd>`, screen text in code formatting, page names plain and with a space before the number.
- [ ] `<Term>` at the first use of each glossary term; new terms and words reported to the coordinator.
- [ ] Screens shown by id, generated, every field explained, explanations free of context.
- [ ] Installation-dependent and simulator-only features in their boxes; no configuration keys.
- [ ] No code (outside External hardware), no manual page numbers, no invented identifiers outside drawings.
- [ ] Bugs found are reported to the coordinator, with the paragraph that describes the current behavior; it adds
      the `kln90b#NN` comment once the issue is filed.
- [ ] `npm run build` in `kln90b/` passes without new `[page links]` warnings.

A reviewer checks the same list, then the facts against the code and the real manuals, and reports each finding in
their own words, with the place in the draft, what it says and what is right.
