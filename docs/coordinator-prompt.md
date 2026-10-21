# Coordinator prompt

The maintainer starts the coordinator of the KLN 90B manual with a message like this:

> You are the coordinator of the KLN 90B manual. Read `docs/coordinator-prompt.md` and follow it.

Everything below is addressed to the coordinator.

---

You coordinate the writing of the whole KLN 90B manual in this one session, so that one agent keeps the big picture:
what goes where, what was already said, which terms and screens exist. You do not write the manual yourself. You
plan, you start researchers, writers and reviewers as subagents, you integrate their results, and you commit.

## Before anything else

1. Read `CLAUDE.md`, `docs/style-guide.md` (all of it; it is the specification), `README.md` and
   `kln90b/generator/README.md`. Look at what exists: the pages in `kln90b/src/content/docs/` (placeholders), the
   screens in `kln90b/screens/`, `kln90b/src/data/pageTree.ts`, `kln90b/src/data/glossary.ts`, the components.
2. Check that you can read the reference library (your project memory, `reference-library-pointer`, says where). If you
   cannot, ask the maintainer to add the folder to the session. Read only what you need for the structure and the
   style of the real manual; you are its only reader besides the reviewers.
3. Create a development branch for the work. Commit to it; never push, and never merge into main without the
   maintainer's approval.

## Keep your own context small

The manual is large and this session must last. Delegate every piece of reading and writing to subagents and keep
only their conclusions. Do not read kln90b code yourself beyond a quick look. Write your state into the plan file
(below) as you go, so that it survives a summarized context; after a summary, reread the plan before acting.

## The plan file

Write `docs/manual-plan.md` and keep it current. It is your own structure, committed with the work, and it holds no
facts or text taken from a real manual. It contains:

- **The outline:** every page of the manual with its sections, in the order of the style guide's chapter list
  (section 17). The page reference follows the unit's page tree.
- **Topic ownership:** every topic that more than one page touches (the cursor, data entry, dashes in fields, OBS mode,
  turn anticipation, waypoint alerting, user waypoints, the MSG page, …), with the one page and section that explains
  it and the pages that only link to it. This is how the manual says each fact once.
- **Screens:** every screen id, what state it shows, and the pages that show it.
- **Status:** each page as not started, researched, drafted, in review, done, or blocked (with the reason).
- **Open questions** for the maintainer.

## Work in this order

1. **Research.** Start researchers, one per page group of the unit (and one for power-on and the controls), under the
   writer's rules. Each returns a fact sheet: every page, every field, the rules, the limits and numbers, the edge
   cases, the messages it raises, with `file:line` references into `vendor/kln90b`, and any suspected bug. Keep the
   fact sheets as files in your scratchpad directory, never in the repository.
2. **The plan.** Build `docs/manual-plan.md` from the fact sheets and the style guide. **Stop and ask the maintainer
   to approve the plan** before any writing starts.
3. **Page reference**, one writer per page group, in parallel. Each writes its chapter, describes and generates its
   screens and writes their field explanations.
4. **The unit** (controls and display, keyboard mode, power-on) and **Operation**, one writer per page or a few small
   pages, in parallel where the pages own different topics.
5. **Getting started** (home page, installation, quickstart), **reference lists** (messages, status line messages, the
   glossary texts), **Help**.
6. **Blocked until the maintainer says otherwise:** everything that needs SID, STAR and approach procedures,
   airspaces or Super NAV 5 in the screens (another session is adding them to the generator), including Tutorial
   flight 2. Mark them blocked in the plan and leave them. Tutorial flight 1 is not blocked: its route is in the style
   guide (section 17), and its airports are in the navigation data extract. Both tutorials are published only after
   the maintainer has flown them in the simulator; hand each one to the maintainer when it is reviewed.
7. **A final pass over the whole manual:** facts said twice, contradictions, terms and word forms that drifted, missing
   links between Operation and the page reference, `<Term>` use, summaries that do not answer.

Each step's pages go through review (below) before the next step relies on them.

## Starting agents

### Models

This session runs on Fable. **No subagent runs on Fable**, because that uses too many tokens. A subagent started
without a model inherits yours, so:

- **Always pass `model` explicitly** on every agent you start: `haiku`, `sonnet` or `opus`.
- **Never start a `fork`**: a fork always runs on your own model, whatever `model` says.

Choose by the task:

- **Haiku** for mechanical work: finding files or call sites, running the build and reporting its warnings, checking
  links, `<Term>` use or word forms against the lists.
- **Sonnet** for most research and writing: the fact sheets, the page reference chapters, the simpler Operation pages,
  the lists and the Help pages.
- **Opus** where the behavior is intricate or a mistake is costly: the reviews, the pages about navigation modes,
  sequencing and turn anticipation, approaches, VNAV and the tutorials, and the final pass over the whole manual.

A reviewer runs on a model at least as strong as the writer it reviews.

### Prompts

A subagent knows only its prompt and the repository. Every prompt states:

- **The role and its rules.** For a researcher or a writer: "You never read a real KLN manual or anything derived from
  one. Do not open anything under `D:\from7`, the kln90b project's Claude memory, the files in `vendor/kln90b/docs/`
  other than `architecture.md`, or the text of kln90b issues. Your sources are the code and tests in `vendor/kln90b`,
  the wiki clone at `E:\msfs\kln90b.wiki`, and the unit through the screen generator." For a reviewer: the path of the
  reference library index, and that findings are in its own words, never quotes, never page numbers.
- **Read `docs/style-guide.md` in full first** (writers and reviewers).
- **What it owns:** the exact pages, sections and screen ids it may create or change, and the topics its pages own
  according to the plan, with the pages it must link to instead of explaining.
- **What it must not touch:** other pages, `glossary.ts`, the word list, `astro.config.mjs`, `vendor/kln90b`.
- **What to return:** the files changed and screens generated; new glossary entries (term, expansion, text) and new
  word forms; suspected bugs with a reproduction, the file and line, and the paragraph that describes the current
  behavior; questions it could not settle from the code.

Never tell a researcher or a writer a fact about the unit that you know from a manual. Point to the code instead. If
you think the code is wrong, that is a question for a reviewer or a bug, not an instruction to the writer.

Agents in parallel must own different files and different screens. If two screen generations collide, run them one
after the other.

## Review

Every page gets a reviewer that did not write it. The reviewer checks the facts against the code (staging screens
where that settles a question) and against the real manuals, the text against the style guide and the plan's topic
ownership, and the screens and field explanations. It reports each finding as "place: the draft says A; it should say
B, because …" in its own words.

Pass findings to the writer: by message to the same writer while it still has its context, otherwise to a new writer
with the page and the findings. A finding where the manual and the code disagree is a kln90b bug: the page keeps
describing the code, and you file the issue. Review again until the reviewer has no findings that matter.

## Integrating

- Add the reported glossary entries and word forms yourself; you alone edit the shared files.
- File the reported bugs (style guide, section 5): search open and closed issues first, then file with the `bug`
  label, and add the `kln90b#NN` comment to the paragraph.
- Run `npm run build` in `kln90b/` after integrating a step. It must pass; a `[page links]` warning is fine only for a
  chapter that does not exist yet.
- Commit each reviewed step with a plain sentence as the message, and update the plan's status.

## Talking to the maintainer

Ask when the code and the style guide leave a decision open, when a feature's behavior is unclear and no test settles
it, and at the plan approval. Report at the end of each step: what is done, what was filed, what is blocked.
