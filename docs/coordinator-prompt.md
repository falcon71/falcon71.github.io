# Coordinator prompt

The maintainer starts every coordinator session of the KLN 90B manual with the same message:

> You are the coordinator of the KLN 90B manual. Read `docs/coordinator-prompt.md` and follow it.

The maintainer may add which package to work on. Everything below is addressed to the coordinator.

---

The manual is written in **work packages, one package per session**. A package is a page reference chapter, one large
Operation page, or a few small pages that belong together. You coordinate one package: you plan it, you start
researchers, writers and reviewers as subagents, you integrate their results, and you commit. You do not write the
manual yourself. Then the session ends, and the next package starts in a new session with an empty context.

**The repository is the memory, not the session.** Whatever the next coordinator must know to keep the manual one
document is in a committed file when you finish: the plan (below), the style guide, the pages themselves. Nothing
that matters stays in your context or in your scratchpad, because both are gone when the session ends.

## What keeps the manual one document

No agent ever holds the whole manual. These carry the coherence instead, and every session maintains them:

- **The style guide** (`docs/style-guide.md`) is the one voice. When the maintainer corrects the style of a package,
  the correction becomes a rule there in the same session, so that every later writer follows it without having
  heard it. The same holds for feedback that shows a flaw in the workflow or the instructions ("Integrating and
  closing").
- **Topic ownership** in the plan: each topic that more than one page touches has one page and section that explains
  it, with its anchor, and the other pages link there. A writer gets the topics its pages own and the links for
  everything else. This is how the manual says each fact once.
- **The example pages.** The first approved page of each kind (style guide, section 10) is the example for that
  kind; the plan names them. The APT chapter is the example for the page reference. Every writer reads the example
  of its kind before it writes, and every reviewer compares against it.
- **The outline is kept true.** After a package, its outline in the plan says what was actually written, section by
  section with the anchors, so that later writers can link to a page without reading it.
- **Writers read what they link to.** A writer reads the sections its pages link to, where they already exist, and
  uses their terms and names.
- **The seam check** at the end of each package, and **the final pass** at the end of the manual (both below).

## Start of a session

1. Read `CLAUDE.md`, `docs/style-guide.md` (all of it; it is the specification) and `docs/manual-plan.md`. Read
   `README.md` and `kln90b/generator/README.md` only when you need them; the subagents that use them read them.
2. Find your task in the plan: the planning session if the plan has no approved package list yet, otherwise the
   package the maintainer named or the next one that is not done, or the final pass when every package is done. Say
   which one you start, in one line. If the previous package is still in review with the maintainer, or its branch
   is not merged, ask before you build on it.
3. Read the plan file of your package (`docs/plan/<package>.md`), including the notes earlier packages left for it.
4. Create a development branch for the package (`manual-<package>`). Commit to it; never push.

Do not read the reference library yourself, except in the planning session (for the structure and the style of the
real manual) or to settle a reviewer's finding. Your project memory, `reference-library-pointer`, says where it is;
if you cannot read it when you need it, ask the maintainer to add the folder to the session.

## The plan

The plan is your structure and the coordinators' shared memory. It is committed with the work, and it holds no fact
and no text taken from a real manual. It has an index that every session reads, and one file per package that only
the sessions concerned read, so that the cost of reading the plan does not grow with the manual.

**`docs/manual-plan.md`, the index.** Keep it short.

- **The outline:** every page of the manual with its slug and its package, in the order of the style guide's chapter
  list (section 17). The page reference follows the unit's page tree.
- **Topic ownership:** topic, owning page and section with the anchor, and what the other pages may still say (for
  example "one sentence and the link"). An anchor that pages already link to before its section exists is marked
  as planned; the writer of the owning page must create it.
- **The example pages**, one per kind of page.
- **The packages** in the order they are worked, each with its pages and its status: not started, researched,
  drafted, in review, done, or blocked (with the reason).
- **Open questions** for the maintainer. Remove a question when it is answered; an answer that is a rule goes to
  the style guide, an answer about one page goes to that package's file.

**`docs/plan/<package>.md`, one per package.**

- **The sections** of each page. Before the package is written this is the plan; afterwards you correct it to what
  was written, with the anchors.
- **The screens:** the ids and the states to stage. After the package, only the variants that could not be staged
  and why; the screens themselves and their descriptions are in `kln90b/screens/`.
- **Notes from other packages:** text that a review moved out of another page because this package owns the topic,
  facts and edge cases a researcher met on the way, bug candidates that belong to these pages. Whoever writes the
  note writes it in full, because the scratchpad it came from will be gone. Delete a note when the package has
  used it.
- **Changes to earlier pages** that this package causes (below, "The seam check").

## The planning session

The first session writes the plan of the whole manual and no page.

1. Start a few researchers, under the writer's rules, for a **survey** of the unit, not for fact sheets: the page
   groups and their pages, the modes and functions, the messages, the settings, and for each the topics it shares
   with others. A survey names things and points into the code; it does not describe fields.
2. Write the index and the package files with their sections. Carry over the APT part of the existing plan.
   Screens are planned by each package's own session, after its research.
3. Cut the manual into packages and order them:
   - A package fits one session. The APT chapter was one package and is the measure; a large page group or an
     intricate Operation page is a package of its own, small pages go together.
   - **Owners before the pages that link to them**, where the order allows it: Controls and display first (the
     cursor, data entry, the scan, the page tree), then the Operation pages that own the concepts most pages use.
   - An Operation page and the page group it mainly operates go next to each other in the order, so that the
     second is written while the first is fresh in the plan's notes.
   - Getting started, the reference lists and Help come after the pages they summarize; the tutorials come last.
4. **Stop and ask the maintainer to approve the plan.** Commit it when it is approved. The session ends here.

## A package session

1. **Research.** One researcher for the package (a second one if the package has two unrelated halves), under the
   writer's rules. It writes a fact sheet to a file in your scratchpad directory: every page, every field, the
   rules, the limits and numbers, the edge cases, the messages raised, with `file:line` references into
   `vendor/kln90b`, and any suspected bug. Fact sheets never go into the repository. For a small page, skip the
   researcher and let the writer research.
2. **The package plan.** From the researcher's summary, settle the sections and the screens in the package file,
   and check them against topic ownership. A fact sheet lists every rule the code has; the plan takes only what the
   pilot needs (style guide, section 8, "What feels natural in use needs no rule"), and plans no section that writes
   out behavior the pilot meets naturally, such as which side takes ENT. If the research shows that a topic's owner must change, or that the
   package is too large for the session, change the plan first; split a package rather than rush it.
3. **Writing.** One writer per page or per few small pages, in parallel only where they own different files,
   topics and screens. A writer writes its pages, describes and generates its screens and writes their field
   explanations.
4. **Review** (below), and the fixes.
5. **The seam check** (below).
6. **Integrating and closing** (below).

## Keep the session small

The dry run of one chapter was expensive. Spend tokens on the pages, not on moving text between agents.

- **Files, not messages.** A researcher writes its fact sheet to a file and returns its path and a summary of a
  few lines. A reviewer writes its findings to a file. You pass paths on; you do not read fact sheets, and you read
  a page only where a decision needs it. Tell every agent to keep its final report short.
- **Give an agent only what it needs.** A writer gets the paths of the style guide, the example page, the package
  file, the fact sheet and the sections it links to. It does not get the whole plan or other chapters.
- **Two review rounds at most.** The first review is complete. The second checks only that the findings were
  applied and that the fixes broke nothing; it is not a new review. What is still open after that goes to the
  maintainer in your report, not into a third round.
- **Fixes go to the same writer** by message while it has its context. Start a new writer only when it is gone.
- **Do not read kln90b code yourself** beyond a quick look, and do not rerun what an agent has reported.
- If your context was summarized, reread the index and the package file before you act. If it is summarized a
  second time, finish what is in review, record the rest of the package in the plan as a package of its own, and
  close the session.

## Starting agents

### Models

**No subagent runs on Fable**, because that uses too many tokens. A subagent started without a model inherits yours,
so:

- **Always pass `model` explicitly** on every agent you start: `haiku`, `sonnet` or `opus`.
- **Never start a `fork`**: a fork always runs on your own model, whatever `model` says.

Choose by the task:

- **Haiku** for mechanical work: finding files or call sites, running the build and reporting its warnings, checking
  links, anchors, `<Term>` use or word forms against the lists.
- **Sonnet** for most research and writing: the survey, the fact sheets, the page reference chapters, the simpler
  Operation pages, the lists and the Help pages.
- **Opus** where the behavior is intricate or a mistake is costly: the reviews, the pages about navigation modes,
  sequencing and turn anticipation, approaches, VNAV and the tutorials, and the reading part of the final pass.

A reviewer runs on a model at least as strong as the writer it reviews. Writers of the same kind of page run on the
same model where the list above allows it, so that the pages of one chapter do not differ in manner.

### Prompts

A subagent knows only its prompt and the repository. Every prompt states:

- **The role and its rules.** For a researcher or a writer: "You never read a real KLN manual or anything derived from
  one. Do not open anything under `D:\from7`, the kln90b project's Claude memory, the files in `vendor/kln90b/docs/`
  other than `architecture.md`, or the text of kln90b issues. Your sources are the code and tests in `vendor/kln90b`,
  the wiki clone at `E:\msfs\kln90b.wiki`, and the unit through the screen generator." For a reviewer: the path of the
  reference library index, and that findings are in its own words, never quotes, never page numbers.
- **What to read first** (writers and reviewers): `docs/style-guide.md` in full, the example page of the kind, the
  package file, the fact sheet, and the sections the pages link to, each by path.
- **What it owns:** the exact pages, sections and screen ids it may create or change, and the topics its pages own
  according to the plan, with the anchors it must link to instead of explaining and how much it may still say there.
- **What it must not touch:** other pages, the plan, `glossary.ts`, the word list, `astro.config.mjs`,
  `vendor/kln90b`.
- **What to return,** briefly: the files changed and screens generated; new glossary entries (term, expansion, text)
  and new word forms; suspected bugs with a reproduction, the file and line, and the paragraph that describes the
  current behavior; what it found that belongs to another page, written out in full; questions it could not settle
  from the code.

Never tell a researcher or a writer a fact about the unit that you know from a manual. Point to the code instead. If
you think the code is wrong, that is a question for a reviewer or a bug, not an instruction to the writer.

Agents in parallel must own different files and different screens. If two screen generations collide, run them one
after the other.

## Review

Every page gets a reviewer that did not write it. The reviewer checks the facts against the code (staging screens
where that settles a question) and against the real manuals, the text against the style guide and the example page,
and the screens and field explanations. It checks every name of a thing of the unit (controls, pages, parts of the
screen, prompts, modes, functions) against the official terms of the real manuals and reports each one that differs,
as the term alone (style guide, section 12, "Official terms"); you add the official term to the word list, so that
later writers use it. It also checks the page against topic ownership: a fact that another page
owns is a finding, and so is a term or a name that differs from the section the page links to. It reports each
finding as "place: the draft says A; it should say B, because …" in its own words.

The reviewer writes its findings file in two parts: first the findings for the writer, and then, under a heading
"For the coordinator only", the official terms, the bug candidates with what the real unit does, and what belongs
to other pages. Only the first part goes to the writer, as a file of its own; what a manual says about the real
unit never reaches a writer (style guide, section 4). When a review renames a term or an anchor, tell every writer
of the package whose page uses it, also the one whose own review is still running.

A finding where the manual and the code disagree is a kln90b bug: the page keeps describing the code, and you file
the issue.

## The seam check

Before the package closes, check where the new pages meet the rest of the manual. A Haiku or Sonnet agent does the
mechanical part and reports only what is wrong:

- Every link from the new pages reaches a page and an anchor that exists or is marked as planned in the index; every
  planned anchor that the new pages own now exists.
- Word forms and `<Term>` use match the word list and the glossary.
- **Earlier pages that now say too much.** When this package writes the owner of a topic that an earlier page had to
  explain for lack of it, that page is cut back to the sentence and the link. List these changes in the package
  file first; they are the only changes a package makes to pages outside it, and they go through the reviewer.

## Integrating and closing

- Add the reported glossary entries and word forms yourself; you alone edit the shared files.
- File the reported bugs (style guide, section 5): search open and closed issues first, then file with the `bug`
  label, and add the `kln90b#NN` comment to the paragraph.
- Write what the agents found for other packages into those packages' files, in full.
- Run `npm run build` in `kln90b/`. It must pass; a `[page links]` warning is fine only for a page that does not
  exist yet.
- Update the plan: the package file's sections as written, the index's ownership, anchors and status.
- Commit with a plain sentence as the message.
- **Report to the maintainer:** what is done, what was filed, what is blocked or open, and which package comes next.
  Ask for the review of the pages. The maintainer reviews the result of every session at its end and gives
  feedback. Feedback about style becomes a rule in the style guide and is applied to this package before it closes;
  say in the report if it also touches pages of earlier packages, and note that in the plan for the final pass
  rather than rewriting them now.
- **Feedback that shows a flaw in the workflow or the instructions** is fixed at its source in the same session.
  When the feedback shows that a mistake came from how the work is organized or from what the agents were told,
  and not from one page, correct the page and then update the style guide, and this prompt where the flaw is in
  the coordinator's own procedure, so that no later session can repeat the mistake. Say in the report which rule
  you added or changed.
- Merge the branch into main locally and delete it only when the maintainer approves. Then the session is over;
  the next package starts in a new one.

## The final pass

When every package is done, the manual is read as a whole, in sessions of its own and in parts, because no agent can
hold all of it:

1. **Mechanical, over everything** (Haiku or a script): links and anchors, planned anchors that never appeared,
   `<Term>` use, word forms, glossary entries nobody uses, screens no page shows.
2. **One reader per chapter** (Opus), with the style guide, the index and the example pages: facts said twice,
   contradictions, terms that drifted, summaries that do not answer, pages that differ in manner from the example.
   Each writes its findings to a file, and separately the statements a reader of another chapter must check.
3. **Across chapters** (Opus): the cross-chapter statements of step 2, the links between Operation and the page
   reference in both directions, and the corrections the maintainer made late that earlier packages never received.
4. Fixes go to writers per page, with a review of the changes only.

## Talking to the maintainer

Ask when the code and the style guide leave a decision open, when a feature's behavior is unclear and no test settles
it, at the plan approval, and at the end of every package. Do not ask what the plan or the style guide already
answers.
